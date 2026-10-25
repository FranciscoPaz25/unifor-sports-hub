const prisma = require('../../lib/prisma.cjs');
const { formatarDias, formatarHorario } = require('../esportes/esporte.service.cjs');

// Inscrições que ainda valem: o aluno não pode pedir de novo enquanto estiver numa delas
const STATUS_ATIVOS = ['em_analise', 'confirmada'];

const incluirEsporte = {
    modalidade_esportiva: {
        select: {
            idModalidade: true,
            Nome: true,
            Capacidade: true,
            Professor: true,
            HorarioInicio: true,
            HorarioFim: true,
            local: { select: { Nome: true } },
            modalidade_dia: { select: { DiaSemana: true } },
        },
    },
};

function resumoEsporte(m) {
    return {
        id: m.idModalidade,
        nome: m.Nome,
        local: m.local.Nome,
        diasSemana: formatarDias(m.modalidade_dia.map((d) => d.DiaSemana)),
        horarioInicio: formatarHorario(m.HorarioInicio),
        horarioFim: formatarHorario(m.HorarioFim),
        responsavel: m.Professor,
        capacidadeMaxima: m.Capacidade,
    };
}

function paraResposta(inscricao) {
    const resposta = {
        id: inscricao.id,
        status: inscricao.status,
        criadoEm: inscricao.data.toISOString(),
        esporte: resumoEsporte(inscricao.modalidade_esportiva),
    };
    if (inscricao.usuario) {
        resposta.aluno = { nome: inscricao.usuario.Nome, matricula: inscricao.usuario.Matricula };
    }
    return resposta;
}

// Trava a linha da modalidade até o fim da transação: duas requisições ao mesmo tempo
// esperam uma pela outra e não ocupam a mesma última vaga.
async function travarModalidade(tx, idModalidade) {
    const linhas = await tx.$queryRaw`
        SELECT Capacidade FROM modalidade_esportiva WHERE idModalidade = ${idModalidade} FOR UPDATE`;
    return linhas.length > 0 ? Number(linhas[0].Capacidade) : null;
}

// READ COMMITTED: depois de esperar a trava, cada consulta enxerga o que a outra transação
// gravou. No padrão do MySQL (REPEATABLE READ) a contagem leria a "foto" do início da
// transação e duas confirmações simultâneas passariam da capacidade.
const OPCOES_TRANSACAO = { isolationLevel: 'ReadCommitted' };

function contarConfirmadas(tx, idModalidade) {
    return tx.inscricao_modalidade.count({
        where: { ModalidadeEsportiva_idModalidade: idModalidade, status: 'confirmada' },
    });
}

// Tela 09. Nova inscrição nasce em_analise; se já existir uma cancelada ou rejeitada,
// o mesmo registro volta para em_analise (o par esporte + aluno é único no banco).
async function solicitarInscricao(idUsuario, idModalidade) {
    return prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.findUnique({
            where: { idUsuario },
            select: { TipoUsuario: true },
        });
        if (!usuario) return { status: 'usuario-nao-encontrado' };
        if (usuario.TipoUsuario !== 'aluno') return { status: 'nao-aluno' };

        const capacidade = await travarModalidade(tx, idModalidade);
        if (capacidade === null) return { status: 'esporte-nao-encontrado' };

        const existente = await tx.inscricao_modalidade.findUnique({
            where: {
                ModalidadeEsportiva_idModalidade_Usuario_idUsuario: {
                    ModalidadeEsportiva_idModalidade: idModalidade,
                    Usuario_idUsuario: idUsuario,
                },
            },
            select: { id: true, status: true },
        });
        if (existente && STATUS_ATIVOS.includes(existente.status)) return { status: 'ja-inscrito' };

        // Sem vagas, o pedido é bloqueado (decisoes.md)
        if (await contarConfirmadas(tx, idModalidade) >= capacidade) return { status: 'sem-vagas' };

        const dados = { status: 'em_analise', data: new Date() };
        const inscricao = existente
            ? await tx.inscricao_modalidade.update({
                where: { id: existente.id },
                data: dados,
                include: incluirEsporte,
            })
            : await tx.inscricao_modalidade.create({
                data: { ...dados, ModalidadeEsportiva_idModalidade: idModalidade, Usuario_idUsuario: idUsuario },
                include: incluirEsporte,
            });

        return { status: 'criada', inscricao: paraResposta(inscricao) };
    }, OPCOES_TRANSACAO);
}

// Tela 10: inscrições do aluno da sessão, mais recentes primeiro
async function listarMinhas(idUsuario) {
    const inscricoes = await prisma.inscricao_modalidade.findMany({
        where: { Usuario_idUsuario: idUsuario },
        orderBy: { data: 'desc' },
        include: incluirEsporte,
    });
    return inscricoes.map(paraResposta);
}

// Tela 11: só encontra inscrições do próprio aluno
async function buscarMinha(idUsuario, id) {
    const inscricao = await prisma.inscricao_modalidade.findFirst({
        where: { id, Usuario_idUsuario: idUsuario },
        include: incluirEsporte,
    });
    return inscricao ? paraResposta(inscricao) : null;
}

// Tela 11, "Cancelar inscrição": vale para em_analise e confirmada
async function cancelarMinha(idUsuario, id) {
    const inscricao = await prisma.inscricao_modalidade.findFirst({
        where: { id, Usuario_idUsuario: idUsuario },
        select: { status: true },
    });
    if (!inscricao) return { status: 'nao-encontrada' };
    if (!STATUS_ATIVOS.includes(inscricao.status)) return { status: 'nao-cancelavel' };

    const atualizada = await prisma.inscricao_modalidade.update({
        where: { id },
        data: { status: 'cancelada' },
        include: incluirEsporte,
    });
    return { status: 'cancelada', inscricao: paraResposta(atualizada) };
}

// Tela 23: pedidos em análise, mais antigos primeiro
async function listarPendentes() {
    const inscricoes = await prisma.inscricao_modalidade.findMany({
        where: { status: 'em_analise' },
        orderBy: { data: 'asc' },
        include: { ...incluirEsporte, usuario: { select: { Nome: true, Matricula: true } } },
    });
    return inscricoes.map(paraResposta);
}

// Tela 23, Aceitar/Rejeitar. novoStatus: 'confirmada' | 'rejeitada'
async function decidirInscricao(id, novoStatus) {
    return prisma.$transaction(async (tx) => {
        const inscricao = await tx.inscricao_modalidade.findUnique({
            where: { id },
            select: { status: true, ModalidadeEsportiva_idModalidade: true },
        });
        if (!inscricao) return { status: 'nao-encontrada' };
        if (inscricao.status !== 'em_analise') return { status: 'ja-decidida' };

        if (novoStatus === 'confirmada') {
            const idModalidade = inscricao.ModalidadeEsportiva_idModalidade;
            const capacidade = await travarModalidade(tx, idModalidade);
            if (await contarConfirmadas(tx, idModalidade) >= capacidade) return { status: 'sem-vagas' };
        }

        const atualizada = await tx.inscricao_modalidade.update({
            where: { id },
            data: { status: novoStatus },
            include: { ...incluirEsporte, usuario: { select: { Nome: true, Matricula: true } } },
        });
        return { status: 'decidida', inscricao: paraResposta(atualizada) };
    }, OPCOES_TRANSACAO);
}

module.exports = {
    solicitarInscricao,
    listarMinhas,
    buscarMinha,
    cancelarMinha,
    listarPendentes,
    decidirInscricao,
};

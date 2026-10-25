const prisma = require('../../lib/prisma.cjs');

// DiaSemana no banco: 1 = Segunda ... 7 = Domingo
const NOMES_DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// Campos TIME chegam do Prisma como Date em 1970-01-01 (UTC): devolve "HH:MM"
function formatarHorario(data) {
    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

// "HH:MM" -> Date aceito pelo Prisma em campos TIME
function horarioParaData(horario) {
    return new Date(`1970-01-01T${horario}:00.000Z`);
}

// [5, 1, 3] -> "Segunda, Quarta e Sexta"
function formatarDias(numeros) {
    const nomes = [...numeros].sort((a, b) => a - b).map((n) => NOMES_DIAS[n - 1]);
    if (nomes.length <= 1) return nomes.join('');
    return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

const relacoesEsporte = {
    local: { select: { idLocal: true, Nome: true } },
    modalidade_dia: { select: { DiaSemana: true } },
    // Vagas ocupadas = inscrições confirmadas pelo admin
    _count: { select: { inscricao_modalidade: { where: { status: 'confirmada' } } } },
};

// Converte a linha do banco no formato usado pelas telas (mesmos nomes dos antigos mocks)
function paraResposta(modalidade, notas) {
    const dias = modalidade.modalidade_dia.map((d) => d.DiaSemana).sort((a, b) => a - b);
    const ocupadas = modalidade._count.inscricao_modalidade;

    return {
        id: modalidade.idModalidade,
        nome: modalidade.Nome,
        descricao: modalidade.Descricao,
        categoria: modalidade.Categoria,
        idLocal: modalidade.local.idLocal,
        local: modalidade.local.Nome,
        capacidadeMaxima: modalidade.Capacidade,
        vagas: Math.max(0, modalidade.Capacidade - ocupadas),
        dias,
        diasSemana: formatarDias(dias),
        horarioInicio: formatarHorario(modalidade.HorarioInicio),
        horarioFim: formatarHorario(modalidade.HorarioFim),
        responsavel: modalidade.Professor,
        notaMedia: notas?.media ?? null,
        totalAvaliacoes: notas?.total ?? 0,
    };
}

// Média e total das avaliações aprovadas, por modalidade: Map(idModalidade -> { media, total })
async function buscarNotas(idsModalidade) {
    const grupos = await prisma.avaliar.groupBy({
        by: ['ModalidadeEsportiva_idModalidade'],
        where: {
            ModalidadeEsportiva_idModalidade: { in: idsModalidade },
            Status: 'confirmada',
        },
        _avg: { Nota: true },
        _count: { _all: true },
    });

    return new Map(grupos.map((g) => [
        g.ModalidadeEsportiva_idModalidade,
        { media: g._avg.Nota, total: g._count._all },
    ]));
}

async function listarEsportes() {
    const modalidades = await prisma.modalidade_esportiva.findMany({
        include: relacoesEsporte,
        orderBy: { Nome: 'asc' },
    });
    const notas = await buscarNotas(modalidades.map((m) => m.idModalidade));
    return modalidades.map((m) => paraResposta(m, notas.get(m.idModalidade)));
}

async function buscarEsporte(idModalidade) {
    const modalidade = await prisma.modalidade_esportiva.findUnique({
        where: { idModalidade },
        include: relacoesEsporte,
    });
    if (!modalidade) {
        return null;
    }

    const notas = await buscarNotas([idModalidade]);
    // RF08.15: as duas avaliações aprovadas mais recentes
    const avaliacoes = await prisma.avaliar.findMany({
        where: { ModalidadeEsportiva_idModalidade: idModalidade, Status: 'confirmada' },
        orderBy: { Data: 'desc' },
        take: 2,
        select: { Nota: true, Comentario: true, usuario: { select: { Nome: true } } },
    });

    return {
        ...paraResposta(modalidade, notas.get(idModalidade)),
        avaliacoes: avaliacoes.map((a) => ({
            nome: a.usuario.Nome,
            nota: a.Nota,
            comentario: a.Comentario ?? '',
        })),
    };
}

// dados já validados por validarCriacaoEsporte
async function criarEsporte(dados, idAdmin) {
    const local = await prisma.local.findUnique({
        where: { idLocal: dados.idLocal },
        select: { idLocal: true },
    });
    if (!local) {
        return { status: 'local-inexistente' };
    }

    // Criação aninhada: modalidade e dias entram juntos ou nada é gravado
    const criada = await prisma.modalidade_esportiva.create({
        data: {
            Nome: dados.nome,
            Descricao: dados.descricao,
            Categoria: dados.categoria,
            Capacidade: dados.capacidadeMaxima,
            Professor: dados.responsavel,
            HorarioInicio: horarioParaData(dados.horarioInicio),
            HorarioFim: horarioParaData(dados.horarioFim),
            Usuario_idAdmin: idAdmin,
            Local_idLocal: dados.idLocal,
            modalidade_dia: {
                create: dados.dias.map((dia) => ({ DiaSemana: dia })),
            },
        },
        select: { idModalidade: true },
    });

    return { status: 'criado', esporte: await buscarEsporte(criada.idModalidade) };
}

// Dias, inscrições e avaliações da modalidade são apagados em cascata pelo banco
async function excluirEsporte(idModalidade) {
    const resultado = await prisma.modalidade_esportiva.deleteMany({
        where: { idModalidade },
    });
    return resultado.count > 0;
}

module.exports = {
    listarEsportes,
    buscarEsporte,
    criarEsporte,
    excluirEsporte,
};

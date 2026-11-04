const prisma = require('../../lib/prisma.cjs');
const { buscarNotas } = require('../esportes/esporte.service.cjs');

// Chave composta da tabela avaliar: um aluno tem uma avaliação por modalidade
function chave(idAluno, idModalidade) {
    return {
        Usuario_idAluno_ModalidadeEsportiva_idModalidade: {
            Usuario_idAluno: idAluno,
            ModalidadeEsportiva_idModalidade: idModalidade,
        },
    };
}

function paraResposta(avaliacao) {
    const resposta = {
        idEsporte: avaliacao.ModalidadeEsportiva_idModalidade,
        idAluno: avaliacao.Usuario_idAluno,
        nota: avaliacao.Nota,
        comentario: avaliacao.Comentario ?? '',
        status: avaliacao.Status,
        criadoEm: avaliacao.Data.toISOString(),
    };
    if (avaliacao.usuario) resposta.nome = avaliacao.usuario.Nome;
    if (avaliacao.modalidade_esportiva) resposta.esporte = avaliacao.modalidade_esportiva.Nome;
    return resposta;
}

// Só quem tem inscrição confirmada no esporte pode avaliar (decisão de 04/11/2026)
async function temInscricaoConfirmada(idUsuario, idModalidade) {
    const total = await prisma.inscricao_modalidade.count({
        where: {
            Usuario_idUsuario: idUsuario,
            ModalidadeEsportiva_idModalidade: idModalidade,
            status: 'confirmada',
        },
    });
    return total > 0;
}

// Tela 12: avaliações aprovadas do esporte, a avaliação do próprio usuário e se ele pode avaliar
async function listarDoEsporte(idUsuario, idModalidade) {
    const modalidade = await prisma.modalidade_esportiva.findUnique({
        where: { idModalidade },
        select: { idModalidade: true, Nome: true },
    });
    if (!modalidade) {
        return null;
    }

    const [aprovadas, notas, minha, podeAvaliar] = await Promise.all([
        prisma.avaliar.findMany({
            where: { ModalidadeEsportiva_idModalidade: idModalidade, Status: 'aprovada' },
            orderBy: { Data: 'desc' },
            include: { usuario: { select: { Nome: true } } },
        }),
        buscarNotas([idModalidade]),
        prisma.avaliar.findUnique({ where: chave(idUsuario, idModalidade) }),
        temInscricaoConfirmada(idUsuario, idModalidade),
    ]);
    const nota = notas.get(idModalidade);

    return {
        esporte: {
            id: modalidade.idModalidade,
            nome: modalidade.Nome,
            notaMedia: nota?.media ?? null,
            totalAvaliacoes: nota?.total ?? 0,
        },
        avaliacoes: aprovadas.map(paraResposta),
        minhaAvaliacao: minha ? paraResposta(minha) : null,
        podeAvaliar,
    };
}

// Tela 13. Enviar de novo substitui a avaliação anterior.
// Só estrelas (sem comentário) já entra aprovada; com comentário vai para análise do admin (decisão de 04/11/2026).
async function enviarMinha(idUsuario, idModalidade, dados) {
    const modalidade = await prisma.modalidade_esportiva.findUnique({
        where: { idModalidade },
        select: { idModalidade: true },
    });
    if (!modalidade) return { status: 'esporte-nao-encontrado' };
    if (!await temInscricaoConfirmada(idUsuario, idModalidade)) return { status: 'sem-inscricao' };

    const novoStatus = dados.comentario ? 'em_analise' : 'aprovada';
    const avaliacao = await prisma.avaliar.upsert({
        where: chave(idUsuario, idModalidade),
        create: {
            Usuario_idAluno: idUsuario,
            ModalidadeEsportiva_idModalidade: idModalidade,
            Nota: dados.nota,
            Comentario: dados.comentario,
            Status: novoStatus,
        },
        update: {
            Nota: dados.nota,
            Comentario: dados.comentario,
            Status: novoStatus,
            Data: new Date(),
        },
    });
    return { status: 'enviada', avaliacao: paraResposta(avaliacao) };
}

// Tela 21: avaliações em análise, mais antigas primeiro
async function listarPendentes() {
    const avaliacoes = await prisma.avaliar.findMany({
        where: { Status: 'em_analise' },
        orderBy: { Data: 'asc' },
        include: {
            usuario: { select: { Nome: true } },
            modalidade_esportiva: { select: { Nome: true } },
        },
    });
    return avaliacoes.map(paraResposta);
}

// Tela 21, Aceitar (aprovada) ou Rejeitar (rejeitada).
// O filtro por em_analise no próprio UPDATE impede que duas decisões ao mesmo tempo valham.
async function decidirAvaliacao(idModalidade, idAluno, novoStatus) {
    const { count } = await prisma.avaliar.updateMany({
        where: {
            Usuario_idAluno: idAluno,
            ModalidadeEsportiva_idModalidade: idModalidade,
            Status: 'em_analise',
        },
        data: { Status: novoStatus },
    });

    const avaliacao = await prisma.avaliar.findUnique({ where: chave(idAluno, idModalidade) });
    if (!avaliacao) return { status: 'nao-encontrada' };
    if (count === 0) return { status: 'ja-decidida' };
    return { status: 'decidida', avaliacao: paraResposta(avaliacao) };
}

module.exports = {
    listarDoEsporte,
    enviarMinha,
    listarPendentes,
    decidirAvaliacao,
};

const { listarDoEsporte, enviarMinha, listarPendentes, decidirAvaliacao } = require('./avaliacao.service.cjs');
const { validarAvaliacao } = require('./avaliacao.validacao.cjs');
const { lerIdEsporte } = require('../esportes/esporte.validacao.cjs');

const ESPORTE_NAO_ENCONTRADO = { mensagem: 'Esporte não encontrado.' };

// Tela 12 (aluno e admin)
async function doEsporte(req, res) {
    const idEsporte = lerIdEsporte(req.params.idEsporte);
    const resultado = idEsporte && await listarDoEsporte(req.auth.idUsuario, idEsporte);
    if (!resultado) {
        return res.status(404).json(ESPORTE_NAO_ENCONTRADO);
    }
    return res.status(200).json(resultado);
}

// Tela 13 (aluno com inscrição confirmada). Cria ou substitui a própria avaliação.
async function enviar(req, res) {
    const idEsporte = lerIdEsporte(req.params.idEsporte);
    if (!idEsporte) {
        return res.status(404).json(ESPORTE_NAO_ENCONTRADO);
    }

    const { erros, dados } = validarAvaliacao(req.body);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const resultado = await enviarMinha(req.auth.idUsuario, idEsporte, dados);
    switch (resultado.status) {
        case 'esporte-nao-encontrado':
            return res.status(404).json(ESPORTE_NAO_ENCONTRADO);
        case 'sem-inscricao':
            return res.status(403).json({ mensagem: 'Só quem tem inscrição confirmada neste esporte pode avaliar.' });
        default:
            return res.status(200).json({ mensagem: 'Avaliação enviada para análise.', avaliacao: resultado.avaliacao });
    }
}

// Tela 21 (admin)
async function pendentes(req, res) {
    const avaliacoes = await listarPendentes();
    return res.status(200).json({ avaliacoes });
}

// Tela 21, Aceitar (aprovada) ou Rejeitar (rejeitada)
async function decidir(req, res) {
    const idEsporte = lerIdEsporte(req.params.idEsporte);
    const idAluno = lerIdEsporte(req.params.idAluno);
    const novoStatus = req.body?.status;
    if (novoStatus !== 'aprovada' && novoStatus !== 'rejeitada') {
        return res.status(400).json({ erros: ['Status inválido. Use "aprovada" ou "rejeitada".'] });
    }

    const resultado = idEsporte && idAluno
        ? await decidirAvaliacao(idEsporte, idAluno, novoStatus)
        : { status: 'nao-encontrada' };
    switch (resultado.status) {
        case 'nao-encontrada':
            return res.status(404).json({ mensagem: 'Avaliação não encontrada.' });
        case 'ja-decidida':
            return res.status(409).json({ mensagem: 'Esta avaliação já foi analisada.' });
        default:
            return res.status(200).json({ avaliacao: resultado.avaliacao });
    }
}

module.exports = { doEsporte, enviar, pendentes, decidir };

const {
    solicitarInscricao, listarMinhas, buscarMinha, cancelarMinha, listarPendentes, decidirInscricao,
} = require('./inscricao.service.cjs');

// Mesmo texto da tela 09 (decisoes.md), para já inscrito ou sem vagas
const ERRO_INSCRICAO = 'Erro, verifique se você já está inscrito no esporte ou se as vagas acabaram';
const NAO_ENCONTRADA = { mensagem: 'Inscrição não encontrada.' };

// Converte ids vindos da URL ou do corpo; null se não for inteiro positivo
function lerId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// Tela 09 (aluno)
async function solicitar(req, res, next) {
    const idEsporte = lerId(req.body?.idEsporte);
    if (!idEsporte) {
        return res.status(400).json({ erros: ['Informe o esporte.'] });
    }

    try {
        const resultado = await solicitarInscricao(req.auth.idUsuario, idEsporte);
        switch (resultado.status) {
            case 'usuario-nao-encontrado':
                return res.status(401).json({ mensagem: 'Usuário da sessão não encontrado.' });
            case 'nao-aluno':
                return res.status(403).json({ mensagem: 'Apenas alunos podem se inscrever em esportes.' });
            case 'esporte-nao-encontrado':
                return res.status(404).json({ mensagem: 'Esporte não encontrado.' });
            case 'ja-inscrito':
            case 'sem-vagas':
                return res.status(409).json({ mensagem: ERRO_INSCRICAO });
            default:
                return res.status(201).json({ mensagem: 'Inscrição enviada para análise.', inscricao: resultado.inscricao });
        }
    } catch (err) {
        // Dois pedidos iguais ao mesmo tempo: o índice único barra o segundo
        if (err.code === 'P2002') {
            return res.status(409).json({ mensagem: ERRO_INSCRICAO });
        }
        return next(err);
    }
}

// Tela 10
async function minhas(req, res) {
    const inscricoes = await listarMinhas(req.auth.idUsuario);
    return res.status(200).json({ inscricoes });
}

// Tela 11
async function detalharMinha(req, res) {
    const id = lerId(req.params.id);
    const inscricao = id && await buscarMinha(req.auth.idUsuario, id);
    if (!inscricao) {
        return res.status(404).json(NAO_ENCONTRADA);
    }
    return res.status(200).json({ inscricao });
}

// Tela 11, "Cancelar inscrição" — age direto, sem confirmação (decisoes.md)
async function cancelar(req, res) {
    const id = lerId(req.params.id);
    const resultado = id ? await cancelarMinha(req.auth.idUsuario, id) : { status: 'nao-encontrada' };

    if (resultado.status === 'nao-encontrada') {
        return res.status(404).json(NAO_ENCONTRADA);
    }
    if (resultado.status === 'nao-cancelavel') {
        return res.status(409).json({ mensagem: 'Esta inscrição não pode ser cancelada.' });
    }
    return res.status(200).json({ mensagem: 'Inscrição cancelada.', inscricao: resultado.inscricao });
}

// Tela 23 (admin)
async function pendentes(req, res) {
    const inscricoes = await listarPendentes();
    return res.status(200).json({ inscricoes });
}

// Tela 23, Aceitar (confirmada) ou Rejeitar (rejeitada)
async function decidir(req, res) {
    const id = lerId(req.params.id);
    const novoStatus = req.body?.status;
    if (novoStatus !== 'confirmada' && novoStatus !== 'rejeitada') {
        return res.status(400).json({ erros: ['Status inválido. Use "confirmada" ou "rejeitada".'] });
    }

    const resultado = id ? await decidirInscricao(id, novoStatus) : { status: 'nao-encontrada' };
    switch (resultado.status) {
        case 'nao-encontrada':
            return res.status(404).json(NAO_ENCONTRADA);
        case 'ja-decidida':
            return res.status(409).json({ mensagem: 'Esta inscrição já foi analisada.' });
        case 'sem-vagas':
            return res.status(409).json({ mensagem: 'Não há vagas disponíveis para confirmar esta inscrição.' });
        default:
            return res.status(200).json({ inscricao: resultado.inscricao });
    }
}

module.exports = { solicitar, minhas, detalharMinha, cancelar, pendentes, decidir };

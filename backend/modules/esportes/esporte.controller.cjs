const { listarEsportes, buscarEsporte, criarEsporte, excluirEsporte } = require('./esporte.service.cjs');
const { lerIdEsporte, validarCriacaoEsporte } = require('./esporte.validacao.cjs');

const NAO_ENCONTRADO = { mensagem: 'Esporte não encontrado.' };

// Telas 04 e 05
async function listar(req, res) {
    const esportes = await listarEsportes();
    return res.status(200).json({ esportes });
}

// Tela 08
async function detalhar(req, res) {
    const id = lerIdEsporte(req.params.id);
    const esporte = id && await buscarEsporte(id);
    if (!esporte) {
        return res.status(404).json(NAO_ENCONTRADO);
    }
    return res.status(200).json({ esporte });
}

// Tela 20 (só admin)
async function criar(req, res) {
    const { erros, dados } = validarCriacaoEsporte(req.body);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const resultado = await criarEsporte(dados, req.auth.idUsuario);
    if (resultado.status === 'local-inexistente') {
        return res.status(400).json({ erros: ['Local não encontrado.'] });
    }

    return res.status(201).json({
        mensagem: 'Esporte cadastrado com sucesso.',
        esporte: resultado.esporte,
    });
}

// Tela 08, botão "Excluir" (só admin). Age direto, sem confirmação (decisoes.md)
async function excluir(req, res) {
    const id = lerIdEsporte(req.params.id);
    const excluido = id && await excluirEsporte(id);
    if (!excluido) {
        return res.status(404).json(NAO_ENCONTRADO);
    }
    return res.status(204).end();
}

module.exports = { listar, detalhar, criar, excluir };

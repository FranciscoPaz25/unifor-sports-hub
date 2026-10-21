const { randomBytes } = require('crypto');
const sessoes = new Map();
const TEMPO_INATIVIDADE_MS = 15 * 60 * 1000;

function criarSessao(idUsuario) {
    for (const [idSessao, dadosSessao] of sessoes.entries()) {
        if (idUsuario === dadosSessao.idUsuario) {
            sessoes.delete(idSessao);
        }
    }

    const idSessao = randomBytes(32).toString('hex');
    const dadosSessao = {
        idUsuario,
        ultimaAtividade: Date.now(),
    };
    sessoes.set(idSessao, dadosSessao);
    return idSessao;
}

function invalidarSessao(idSessao) {
    return sessoes.delete(idSessao);
}

function obterSessao(idSessao) {
    const dadosSessao = sessoes.get(idSessao);
    if (!dadosSessao) {
        return null;
    }

    const agora = Date.now();
    if (agora - dadosSessao.ultimaAtividade >= TEMPO_INATIVIDADE_MS) {
        sessoes.delete(idSessao);
        return null;
    }

    dadosSessao.ultimaAtividade = agora;
    return dadosSessao;
}

function limparSessoesInativas() {
    const agora = Date.now();
    for (const [idSessao, dadosSessao] of sessoes.entries()) {
        if (agora - dadosSessao.ultimaAtividade >= TEMPO_INATIVIDADE_MS) {
            sessoes.delete(idSessao);
        }
    }
}

function invalidarSessoesDoUsuario(idUsuario) {
    let quantidadeRemovida = 0;

    for (const [idSessao, dadosSessao] of sessoes.entries()) {
        if (dadosSessao.idUsuario === idUsuario) {
            sessoes.delete(idSessao);
            quantidadeRemovida++;
        }
    }

    return quantidadeRemovida;
}

module.exports = {
    criarSessao,
    invalidarSessao,
    obterSessao,
    limparSessoesInativas,
    invalidarSessoesDoUsuario
};
function validarEntradaLogin(identificador, senha) {
    const erros = [];
    

    if (typeof identificador !== 'string' || identificador.trim() === '') {
        erros.push('O identificador é obrigatório.');
    } else {
        const identificadorTrimmed = identificador.trim();
        const pareceEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificadorTrimmed);
        const pareceMatricula = /^[0-9]{2}[1-2][0-9]{4}$/.test(identificadorTrimmed);
            if (!pareceEmail && !pareceMatricula) {
                erros.push('O identificador deve ser um e-mail válido ou uma matrícula no formato correto.');
            }
    }

    if (typeof senha !== 'string' || senha.length === 0) {
        erros.push('A senha é obrigatória.');
    }

    return erros;
}

module.exports = validarEntradaLogin;
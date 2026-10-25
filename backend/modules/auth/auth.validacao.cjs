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

// Cadastro de aluno (tela 02). Mensagens iguais às de specs/decisoes.md e às da tela.
function validarCadastro(nome, email, matricula, senha, confirmarSenha) {
    const erros = [];

    if (typeof nome !== 'string' || nome.trim() === '') {
        erros.push('O nome é obrigatório.');
    } else if (nome.trim().length > 255) {
        erros.push('O nome deve ter no máximo 255 caracteres.');
    }

    if (typeof email !== 'string' || email.trim() === '') {
        erros.push('O e-mail é obrigatório.');
    } else if (email.trim().length > 255 || !/^[A-Za-z0-9._%+-]+@edu\.unifor\.br$/i.test(email.trim())) {
        // Cadastro é só de aluno: apenas @edu.unifor.br
        erros.push('Use seu e-mail institucional (@edu.unifor.br)');
    }

    if (typeof matricula !== 'string' || !/^[0-9]{2}[1-2][0-9]{4}$/.test(matricula.trim())) {
        erros.push('Matrícula inválida. São 7 dígitos: ano (2), semestre (1 ou 2) e número (4). Ex.: 2312345');
    }

    // Mesma política da troca de senha: 15 a 128 caracteres, sem trim
    if (typeof senha !== 'string' || senha.length < 15 || senha.length > 128) {
        erros.push('A senha deve ter entre 15 e 128 caracteres.');
    } else if (confirmarSenha !== senha) {
        erros.push('Erro ao confirmar senha. Verifique os padrões solicitados.');
    }

    return erros;
}

module.exports = validarEntradaLogin;
module.exports.validarCadastro = validarCadastro;
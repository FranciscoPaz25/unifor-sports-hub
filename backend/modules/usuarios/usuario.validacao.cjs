function validarAtualizacaoPerfil(nome, email) {
    const erros = [];


    if (typeof nome !== 'string' || nome.trim() === '') {
        erros.push('O nome é obrigatório')
    } else if (nome.trim().length > 255) {
        erros.push('O nome deve ter no máximo 255 caracteres.')
    }

    if (typeof email !== 'string' || email.trim() === '') {
        erros.push('email é obrigatório')
    } else if (email.trim().length > 255) {
        erros.push('O email deve ter no máximo 255 caracteres.')
    } else {
        const pareceEmail = /^[A-Za-z0-9._%+-]+@(unifor\.br|edu\.unifor\.br)$/i.test(email.trim());
        if (!pareceEmail) {
            erros.push('Use um e-mail institucional @unifor.br ou @edu.unifor.br.');
        }
    }
    return erros;
}

function validarTrocaSenha(senhaAtual, novaSenha, confirmarNovaSenha) {
    const erros = []

    if (typeof senhaAtual !== 'string' || senhaAtual.length === 0) {
        erros.push('A senha atual é obrigatória.')
    } 

    if (typeof novaSenha !== 'string' || novaSenha.length === 0) {
        erros.push('A nova senha é obrigatória.')
    } else if (novaSenha.length < 15 || novaSenha.length > 128) {
        erros.push("A nova senha deve ter entre 15 e 128 caracteres.")
    }

    if (typeof confirmarNovaSenha !== 'string' || confirmarNovaSenha.length === 0) {
        erros.push('A confirmação da nova senha é obrigatória.')
    } else if (
        typeof novaSenha === 'string' &&
        confirmarNovaSenha !== novaSenha
    ) {
        erros.push('A nova senha e a confirmação não coincidem.');
    }

    return erros
}

module.exports = {
    validarAtualizacaoPerfil,
    validarTrocaSenha,
}

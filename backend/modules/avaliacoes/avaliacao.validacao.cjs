// Tela 13 — Popup de resenha. Retorna { erros, dados } com os valores já normalizados.
function validarAvaliacao(corpo) {
    const erros = [];
    const { nota, comentario } = corpo ?? {};

    const dados = { nota: Number(nota), comentario: null };

    if (!Number.isInteger(dados.nota) || dados.nota < 1 || dados.nota > 5) {
        erros.push('Escolha uma nota de 1 a 5 estrelas.');
    }

    // Comentário é opcional; vazio vira null
    if (comentario !== undefined && comentario !== null) {
        if (typeof comentario !== 'string') {
            erros.push('Comentário inválido.');
        } else if (comentario.trim().length > 255) {
            erros.push('O comentário deve ter no máximo 255 caracteres.');
        } else {
            dados.comentario = comentario.trim() || null;
        }
    }

    return { erros, dados };
}

module.exports = { validarAvaliacao };

const HORARIO = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

// Converte o :id da URL; null se não for um inteiro positivo
function lerIdEsporte(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function textoObrigatorio(valor, campo, erros, maximo) {
    if (typeof valor !== 'string' || valor.trim() === '') {
        erros.push(`Preencha o campo ${campo}.`);
        return null;
    }
    if (valor.trim().length > maximo) {
        erros.push(`O campo ${campo} deve ter no máximo ${maximo} caracteres.`);
        return null;
    }
    return valor.trim();
}

// Tela 20 — Criar esporte. Retorna { erros, dados } com os valores já normalizados.
function validarCriacaoEsporte(corpo) {
    const erros = [];
    const {
        nome, descricao, categoria, idLocal, dias,
        horarioInicio, horarioFim, responsavel, capacidadeMaxima,
    } = corpo ?? {};

    const dados = {
        nome: textoObrigatorio(nome, 'nome', erros, 255),
        descricao: textoObrigatorio(descricao, 'descrição', erros, 5000),
        categoria: textoObrigatorio(categoria, 'categoria', erros, 255),
        responsavel: textoObrigatorio(responsavel, 'responsável/professor', erros, 255),
        idLocal: Number(idLocal),
        capacidadeMaxima: Number(capacidadeMaxima),
        horarioInicio,
        horarioFim,
        dias: null,
    };

    if (!Number.isInteger(dados.idLocal) || dados.idLocal < 1) {
        erros.push('Selecione um local.');
    }

    if (!Array.isArray(dias) || dias.length === 0) {
        erros.push('Selecione pelo menos um dia da semana.');
    } else {
        const numeros = [...new Set(dias.map(Number))];
        if (numeros.some((d) => !Number.isInteger(d) || d < 1 || d > 7)) {
            erros.push('Dia da semana inválido.');
        } else {
            dados.dias = numeros;
        }
    }

    if (typeof horarioInicio !== 'string' || !HORARIO.test(horarioInicio)
        || typeof horarioFim !== 'string' || !HORARIO.test(horarioFim)) {
        erros.push('Informe os horários no formato HH:MM.');
    } else if (horarioFim <= horarioInicio) {
        erros.push('O horário de término precisa ser depois do horário de início.');
    }

    if (!Number.isInteger(dados.capacidadeMaxima) || dados.capacidadeMaxima < 1) {
        erros.push('A capacidade máxima precisa ser de pelo menos 1 vaga.');
    }

    return { erros, dados };
}

module.exports = {
    lerIdEsporte,
    validarCriacaoEsporte,
};

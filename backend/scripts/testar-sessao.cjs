const assert = require('node:assert/strict');

const {
    criarSessao,
    obterSessao,
    invalidarSessao,
    limparSessoesInativas,
} = require('../modules/auth/auth.sessao.cjs');

const MINUTO = 60 * 1000;
const agoraOriginal = Date.now;
let horarioSimulado = agoraOriginal();

Date.now = () => horarioSimulado;

try {
    // 1. Criação e consulta
    const primeira = criarSessao(1);
    const dados = obterSessao(primeira);

    assert.match(primeira, /^[a-f0-9]{64}$/);
    assert.equal(dados.idUsuario, 1);
    assert.equal(dados.ultimaAtividade, horarioSimulado);
    console.log('OK: criação e consulta.');

    // 2. Apenas uma sessão por usuário
    const segunda = criarSessao(1);

    assert.notEqual(primeira, segunda);
    assert.equal(obterSessao(primeira), null);
    assert.equal(obterSessao(segunda).idUsuario, 1);
    console.log('OK: novo login invalida a sessão anterior.');

    // 3. Usuários diferentes mantêm sessões independentes
    const outroUsuario = criarSessao(2);

    assert.equal(obterSessao(segunda).idUsuario, 1);
    assert.equal(obterSessao(outroUsuario).idUsuario, 2);
    console.log('OK: sessões de usuários diferentes são independentes.');

    // 4. Exclusão
    assert.equal(invalidarSessao(segunda), true);
    assert.equal(obterSessao(segunda), null);
    assert.equal(invalidarSessao(segunda), false);
    assert.equal(obterSessao(outroUsuario).idUsuario, 2);
    console.log('OK: exclusão e tentativa de excluir novamente.');

    // 5. Sessão inexistente
    assert.equal(obterSessao('sessao-inexistente'), null);
    console.log('OK: sessão inexistente retorna null.');

    // 6. Expiração exatamente no limite de 15 minutos
    const expirada = criarSessao(3);

    horarioSimulado += 15 * MINUTO;

    assert.equal(obterSessao(expirada), null);
    assert.equal(obterSessao(expirada), null);
    console.log('OK: sessão expirada não é renovada.');

    // 7. Atividade renova o prazo
    const renovada = criarSessao(4);

    horarioSimulado += 14 * MINUTO;

    assert.equal(
        obterSessao(renovada).ultimaAtividade,
        horarioSimulado
    );

    // Já passaram 16 minutos da criação,
    // mas somente 2 minutos da última atividade.
    horarioSimulado += 2 * MINUTO;

    assert.equal(obterSessao(renovada).idUsuario, 4);

    // Agora passam 15 minutos desde essa última consulta.
    horarioSimulado += 15 * MINUTO;

    assert.equal(obterSessao(renovada), null);
    console.log('OK: expiração considera a última atividade.');

    // 8. Limpeza de sessões inativas
    const antiga = criarSessao(5);

    horarioSimulado += 10 * MINUTO;
    const recente = criarSessao(6);

    horarioSimulado += 5 * MINUTO;
    limparSessoesInativas();

    // Voltamos o relógio apenas neste teste para distinguir:
    // sessão removida pela limpeza de sessão rejeitada por expiração.
    // Se a antiga não foi excluída, ela pareceria válida neste instante.
    horarioSimulado -= MINUTO;

    assert.equal(obterSessao(antiga), null);
    assert.equal(obterSessao(recente).idUsuario, 6);
    console.log('OK: limpeza remove antigas e preserva recentes.');

    console.log('\nTodos os testes passaram.');
} finally {
    // Restaura o relógio mesmo quando uma verificação falha.
    Date.now = agoraOriginal;
}
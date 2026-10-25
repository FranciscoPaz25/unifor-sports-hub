const validarEntradaLogin = require('./auth.validacao.cjs');
const { autenticarUsuario } = require('./auth.service.cjs');
const {criarSessao, invalidarSessao} = require('../../modules/auth/auth.sessao.cjs');


async function login(req, res) {
    const {identificador, senha} = req.body ?? {};
    const erros = validarEntradaLogin(identificador, senha);

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const usuario = await autenticarUsuario(identificador, senha);
    if (!usuario) {
        return res.status(401).json({ mensagem: 'Identificador ou senha inválidos.' });
    }
    const idSessao = criarSessao(usuario.idUsuario);

    res.cookie('unifor_sid', idSessao, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use HTTPS em produção
        sameSite: 'lax', // Proteção contra CSRF
        path: '/',
    });
    
    
    res.status(200).json({ mensagem: 'Credenciais verificadas', usuario });
    
}

function logout(req, res){
    const idSessao = req.cookies?.unifor_sid
    if(idSessao){
        invalidarSessao(idSessao);
    }
    res.clearCookie('unifor_sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })
    return res.status(204).end();
}

module.exports = {login, logout};
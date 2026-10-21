const { obterSessao } = require('../modules/auth/auth.sessao.cjs');


function autenticar(req, res, next){
    const idSessao = req.cookies?.unifor_sid
    if(!idSessao){
        return res.status(401).json({
            mensagem: 'Sessão inválida ou expirada.'
        })
    }

    const sessao = obterSessao(idSessao);
    if(!sessao){
        return res.status(401).json({
            mensagem: 'Sessão inválida ou expirada.'
        })
    }

    req.auth = {idUsuario: sessao.idUsuario};
    return next();
}

module.exports = autenticar;
const { buscarUsuarioPublicoPorId, atualizarMeuPerfil, trocarSenhaUsuario } = require('./usuario.service.cjs')
const  {validarAtualizacaoPerfil, validarTrocaSenha } = require('./usuario.validacao.cjs')
const {invalidarSessoesDoUsuario} = require('../auth/auth.sessao.cjs')

async function obterMeuPerfil(req, res) {
    const usuario = await buscarUsuarioPublicoPorId(req.auth.idUsuario)
    if (!usuario) {
        return res.status(401).json({
            mensagem: 'Usuário da sessão não encontrado.',
        })
    }
    return res.status(200).json({
        usuario
    })
}

async function atualizarMeuPerfilController(req, res, next) {
    const { nome, email } = req.body ?? {};
    const erros = validarAtualizacaoPerfil(nome, email)

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    try {
        const usuario = await atualizarMeuPerfil(
            req.auth.idUsuario,
            nome,
            email
        )
        return res.status(200).json({ usuario })
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está em uso.',
            });
        }

        if (err.code === 'P2025') {
            return res.status(401).json({
                mensagem: 'Usuário da sessão não encontrado.',
            });
        }

        return next(err);
    }
}


async function trocarMinhaSenha(req, res, next) {
    const {
        senhaAtual,
        novaSenha,
        confirmarNovaSenha,
    } = req.body ?? {};

    const erros = validarTrocaSenha(
        senhaAtual,
        novaSenha,
        confirmarNovaSenha
    );

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    try {
        const resultado = await trocarSenhaUsuario(
            req.auth.idUsuario,
            senhaAtual,
            novaSenha
        );

        if (resultado.status === 'usuario-nao-encontrado') {
            return res.status(401).json({
                mensagem: 'Usuário da sessão não encontrado.',
            });
        }

        if (resultado.status === 'senha-atual-incorreta') {
            return res.status(400).json({
                mensagem: 'A senha atual está incorreta.',
            });
        }

        if (resultado.status !== 'senha-alterada') {
            throw new Error('Resultado inesperado na troca de senha.');
        }

        invalidarSessoesDoUsuario(req.auth.idUsuario);

        res.clearCookie('unifor_sid', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return res.status(200).json({
            mensagem: 'Senha alterada. Faça login novamente.',
        });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    obterMeuPerfil,
    atualizarMeuPerfilController,
    trocarMinhaSenha
}
const validarEntradaLogin = require('./auth.validacao.cjs');
const { validarCadastro } = require('./auth.validacao.cjs');
const { autenticarUsuario, cadastrarAluno } = require('./auth.service.cjs');
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

// Tela 02 — cadastro de aluno. Não abre sessão: o aluno é levado ao login (RF02.13).
async function cadastro(req, res, next) {
    const { nome, email, matricula, senha, confirmarSenha } = req.body ?? {};
    const erros = validarCadastro(nome, email, matricula, senha, confirmarSenha);

    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    try {
        const resultado = await cadastrarAluno(nome, email, matricula, senha);

        if (resultado.status === 'email-em-uso') {
            return res.status(409).json({ mensagem: 'Este e-mail já está em uso.' });
        }
        if (resultado.status === 'matricula-em-uso') {
            return res.status(409).json({ mensagem: 'Esta matrícula já está cadastrada.' });
        }

        return res.status(201).json({
            mensagem: 'Conta criada. Faça login para continuar.',
            usuario: resultado.usuario,
        });
    } catch (err) {
        // Dois cadastros iguais ao mesmo tempo: o índice único do banco barra o segundo
        if (err.code === 'P2002') {
            return res.status(409).json({ mensagem: 'E-mail ou matrícula já cadastrados.' });
        }
        return next(err);
    }
}

module.exports = {login, logout, cadastro};
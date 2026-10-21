function tratarErros(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ mensagem: 'JSON inválido na requisição.' });
    }
    const causa = err.meta?.driverAdapterError?.cause;

console.error('Diagnóstico do banco:', {
    tipo: causa?.kind,
    codigo: causa?.originalCode,
    mensagem: causa?.originalMessage,
});

    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });

}

module.exports = 
    tratarErros
;
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { API_URL } from '../../utils/api';

function RotaProtegida() {
    const [status, setStatus] = useState('verificando');
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function verificarSessao() {
            try {
                const resposta = await fetch(
                    `${API_URL}/api/usuarios/me`,
                    {
                        credentials: 'include',
                        signal: controller.signal,
                    }
                );
                if (controller.signal.aborted) {
                    return;
                }
                if (resposta.ok) {
                    const dados = await resposta.json()
                    if (controller.signal.aborted) return;
                    
                    setStatus('autenticado');
                    setUsuario(dados.usuario)
                } else if (resposta.status === 401) {
                    setStatus('nao-autenticado')
                } else {
                    setStatus('erro')
                }
            } catch {
                if (!controller.signal.aborted) {
                    setStatus('erro')
                }
            }
        }

        verificarSessao();

        return () => controller.abort();
    }, []);

    if (status === 'verificando') {
        return <p>Verificando sessão…</p>;
    }

    if (status === 'nao-autenticado') {
        return <Navigate to="/" replace />;
    }

    if (status === 'erro') {
        return <p>Não foi possível verificar sua sessão. Tente novamente.</p>;
    }

    return <Outlet context={{
                usuario,
                atualizarUsuario: setUsuario,
            }}/>;
}

export default RotaProtegida;
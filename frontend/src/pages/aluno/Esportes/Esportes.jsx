// Tela 05 — Esportes (RF05)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card/Card';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import './Esportes.css';

function Esportes() {
  const navigate = useNavigate();
  const [esportes, setEsportes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const { ok, dados } = await chamarApi('/api/esportes');
        if (ok) setEsportes(dados.esportes);
        else setErro(mensagemDeErro(dados, 'Não foi possível carregar os esportes.'));
      } catch {
        setErro('Não foi possível carregar os esportes.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleBuscar(e) {
    e.preventDefault();
    // TODO: navegar para RF06 Resultados de busca com o termo digitado
  }

  return (
    <div className="esportes-container">
      <h1>Esportes</h1>

      <form className="esportes-busca" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder="Buscar esportes..."
          className="esportes-busca-input"
        />
        <button type="button" className="esportes-busca-filtros">
          Filtros
        </button>
        <button type="submit" className="esportes-busca-botao">
          Buscar
        </button>
      </form>

      {carregando && <p className="esportes-aviso">Carregando esportes…</p>}
      {erro && <p className="esportes-aviso">{erro}</p>}
      {!carregando && !erro && esportes.length === 0 && (
        <p className="esportes-aviso">Nenhum esporte cadastrado ainda.</p>
      )}

      <div className="esportes-grid">
        {esportes.map((esporte) => (
          <Card
            key={esporte.id}
            nome={esporte.nome}
            local={esporte.local}
            vagas={esporte.vagas}
            onInscrever={() => navigate(`/esportes/${esporte.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Esportes;

// Tela 05 — Esportes (RF05)
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card/Card';
import { esportes } from '../../../mocks/esportes';
import './Esportes.css';

function Esportes() {
  const navigate = useNavigate();

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

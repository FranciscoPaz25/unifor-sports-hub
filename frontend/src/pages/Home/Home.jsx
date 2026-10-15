import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import { esportes } from '../../mocks/esportes';
import { eventos } from '../../mocks/eventos';
import { usuario } from '../../mocks/usuario';
import './Home.css';

const esportesDestaque = esportes.slice(0, 4);
const proximosEventos = eventos;

function Home() {
  const navigate = useNavigate();

  function handleBuscar(e) {
    e.preventDefault();
    // TODO: navegar para RF06 Resultados de busca com o termo digitado
  }

  return (
    <div className="home-container">
      <section className="home-saudacao">
        <h1>Olá, {usuario.nome.split(' ')[0]}!</h1>
        <p>Encontre modalidades, reserve horários e participe de eventos esportivos da Unifor.</p>
      </section>

      <form className="home-busca" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder="Buscar esportes ou eventos..."
          className="home-busca-input"
        />
        <button type="button" className="home-busca-filtros">
          Filtros
        </button>
        <button type="submit" className="home-busca-botao">
          Buscar
        </button>
      </form>

      <section className="home-secao">
        <h2>Esportes em destaque</h2>
        <div className="home-grid-esportes">
          {esportesDestaque.map((esporte) => (
            <Card
              key={esporte.id}
              nome={esporte.nome}
              local={esporte.local}
              vagas={esporte.vagas}
              onInscrever={() => navigate(`/esportes/${esporte.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="home-secao">
        <h2>Próximos eventos e atividades</h2>
        <div className="home-lista-eventos">
          {proximosEventos.map((evento) => (
            <div key={evento.id} className="home-evento-item">
              <div className="home-evento-data">{evento.data}</div>
              <div className="home-evento-info">
                <strong>{evento.nome}</strong>
                <span>{evento.local} · {evento.horario}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

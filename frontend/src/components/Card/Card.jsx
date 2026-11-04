import IconeEsporte from '../IconeEsporte/IconeEsporte';
import Estrelas from '../Estrelas/Estrelas';
import './Card.css';

// Card de esporte. `horario` e `nota` só aparecem nos Resultados de busca (decisoes.md);
// nota null = esporte ainda sem avaliações aprovadas.
function Card({ nome, local, vagas, icone, horario, nota, onVerDetalhes }) {
  return (
    <div className="card-esporte">
      <div className="card-esporte-imagem">
        <span className="card-esporte-icone">
          <IconeEsporte nome={icone} tamanho={44} />
        </span>
      </div>
      <div className="card-esporte-corpo">
        <h3 className="card-esporte-nome">{nome}</h3>
        <p className="card-esporte-local">{local}</p>
        {horario && <p className="card-esporte-horario">{horario}</p>}
        {nota !== undefined && (
          <span className="card-esporte-nota">
            <Estrelas nota={nota} />
            {nota === null ? 'Sem avaliações' : nota.toFixed(1)}
          </span>
        )}
        <span className="card-esporte-vagas">{vagas} vagas disponíveis</span>
        <button type="button" className="card-esporte-botao" onClick={onVerDetalhes}>
          Ver detalhes
        </button>
      </div>
    </div>
  );
}

export default Card;

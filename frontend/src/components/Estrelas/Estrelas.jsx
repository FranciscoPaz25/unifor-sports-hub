import './Estrelas.css';

// Nota de 0 a 5 em estrelas (arredonda para a estrela mais próxima)
function Estrelas({ nota }) {
  const cheias = Math.round(nota ?? 0);
  return (
    <span className="estrelas" aria-label={`${nota ?? 0} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= cheias ? 'estrela cheia' : 'estrela'}>★</span>
      ))}
    </span>
  );
}

export default Estrelas;

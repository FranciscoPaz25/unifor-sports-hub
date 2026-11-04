// Barra de busca padrão (decisoes.md): campo + "Filtros" + "Buscar".
// Usada em Home, Esportes e Resultados de busca; leva sempre à tela 06.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PopupFiltros from '../../popups/PopupFiltros/PopupFiltros';
import './BarraBusca.css';

function BarraBusca({ termoInicial = '', categoriaInicial = '' }) {
  const navigate = useNavigate();
  const [termo, setTermo] = useState(termoInicial);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  function irParaResultados(categoria) {
    const parametros = new URLSearchParams();
    if (termo.trim()) parametros.set('termo', termo.trim());
    if (categoria) parametros.set('categoria', categoria);
    const query = parametros.toString();
    navigate(query ? `/esportes/busca?${query}` : '/esportes/busca');
  }

  function handleBuscar(e) {
    e.preventDefault();
    irParaResultados(categoriaInicial);
  }

  function handleAplicarFiltros(categoria) {
    setMostrarFiltros(false);
    irParaResultados(categoria);
  }

  return (
    <>
      <form className="barra-busca" onSubmit={handleBuscar} role="search">
        <div className="barra-busca-campo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a919e" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar esportes..."
            aria-label="Buscar esportes"
          />
        </div>
        <button type="button" className="barra-busca-filtros" onClick={() => setMostrarFiltros(true)}>
          Filtros{categoriaInicial && ' (1)'}
        </button>
        <button type="submit" className="barra-busca-botao">
          Buscar
        </button>
      </form>

      {mostrarFiltros && (
        <PopupFiltros
          categoriaAtual={categoriaInicial}
          onAplicar={handleAplicarFiltros}
          onClose={() => setMostrarFiltros(false)}
        />
      )}
    </>
  );
}

export default BarraBusca;

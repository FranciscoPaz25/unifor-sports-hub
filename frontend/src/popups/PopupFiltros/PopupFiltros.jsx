// Tela 07 — Popup de filtros de busca (RF07). Filtro por categoria (decisão de 04/11/2026).
import { useState } from 'react';
import { CATEGORIAS } from '../../utils/esportes';
import './PopupFiltros.css';

function PopupFiltros({ categoriaAtual = '', onAplicar, onClose }) {
  const [categoria, setCategoria] = useState(categoriaAtual);
  const opcoes = [{ valor: '', rotulo: 'Todas as categorias' }, ...CATEGORIAS.map((c) => ({ valor: c, rotulo: c }))];

  return (
    <div className="filtros-overlay" onClick={onClose}>
      <div className="filtros-card" onClick={(e) => e.stopPropagation()}>
        <div className="filtros-topo">
          <h2>Filtros</h2>
          <button type="button" className="filtros-fechar" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <fieldset className="filtros-grupo">
          <legend>Categoria</legend>
          <div className="filtros-opcoes">
            {opcoes.map((opcao) => (
              <label
                key={opcao.valor}
                className={categoria === opcao.valor ? 'filtros-opcao selecionada' : 'filtros-opcao'}
              >
                <input
                  type="radio"
                  name="categoria"
                  value={opcao.valor}
                  checked={categoria === opcao.valor}
                  onChange={() => setCategoria(opcao.valor)}
                />
                {opcao.rotulo}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="filtros-botoes">
          <button type="button" className="filtros-botao-limpar" onClick={() => setCategoria('')}>
            Limpar
          </button>
          <button type="button" className="filtros-botao-aplicar" onClick={() => onAplicar(categoria)}>
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupFiltros;

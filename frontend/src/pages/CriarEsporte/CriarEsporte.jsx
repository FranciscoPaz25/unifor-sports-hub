import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { esportes } from '../../mocks/esportes';
import './CriarEsporte.css';

const categorias = ['Coletivo', 'Individual', 'Luta', 'Aquático', 'Atletismo'];
const diasDaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function CriarEsporte() {
  const navigate = useNavigate();

  const [imagem, setImagem] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [local, setLocal] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [capacidadeMaxima, setCapacidadeMaxima] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function toggleDia(dia) {
    setDiasSelecionados((atual) =>
      atual.includes(dia) ? atual.filter((d) => d !== dia) : [...atual, dia]
    );
  }

  function handleImagemSelecionada(e) {
    const arquivo = e.target.files[0];
    setImagem(arquivo ? arquivo.name : null);
  }

  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    descricao.trim() !== '' &&
    categoria !== '' &&
    local.trim() !== '' &&
    diasSelecionados.length > 0 &&
    horarioInicio !== '' &&
    horarioFim !== '' &&
    responsavel.trim() !== '' &&
    capacidadeMaxima !== '';

  function handleCadastrar(e) {
    e.preventDefault();
    setSucesso('');

    // RF20.10
    if (horarioFim <= horarioInicio) {
      setErro('O horário de término precisa ser depois do horário de início.');
      return;
    }
    setErro('');

    // RF20.15 — TODO: substituir por POST /esportes quando o backend existir
    esportes.push({
      id: esportes.length + 1,
      nome,
      local,
      vagas: Number(capacidadeMaxima),
      capacidadeMaxima: Number(capacidadeMaxima),
      diasSemana: diasSelecionados.join(', '),
      horarioInicio,
      horarioFim,
      responsavel,
      descricao,
      notaMedia: 0,
      totalAvaliacoes: 0,
      avaliacoes: [],
    });

    // RF20.16
    setSucesso('Esporte cadastrado com sucesso.');
    setNome('');
    setDescricao('');
    setCategoria('');
    setLocal('');
    setDiasSelecionados([]);
    setHorarioInicio('');
    setHorarioFim('');
    setResponsavel('');
    setCapacidadeMaxima('');
    setImagem(null);
  }

  return (
    <div className="criar-esporte-container">
      <div className="criar-esporte-topo">
        <Link to="/admin/gerencia" className="criar-esporte-voltar" aria-label="Voltar para Gerência">
          ←
        </Link>
        <h1>Criar esporte</h1>
      </div>

      <form className="criar-esporte-form" onSubmit={handleCadastrar}>
        <label>
          Imagem da modalidade
          <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleImagemSelecionada} />
          <span className="criar-esporte-hint">
            {imagem ? imagem : 'PNG, JPG ou WEBP até 5MB (recomendado 1200x675)'}
          </span>
        </label>

        <label>
          Nome da modalidade
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>

        <label>
          Descrição
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a modalidade, seus objetivos e requisitos"
          />
        </label>

        <label>
          Categoria
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Local
          <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} />
        </label>

        <label>
          Dias da semana
          <div className="criar-esporte-chips">
            {diasDaSemana.map((dia) => (
              <button
                type="button"
                key={dia}
                className={diasSelecionados.includes(dia) ? 'chip chip-ativo' : 'chip'}
                onClick={() => toggleDia(dia)}
              >
                {dia}
              </button>
            ))}
          </div>
        </label>

        <div className="criar-esporte-horarios">
          <label>
            Horário de início
            <input type="time" value={horarioInicio} onChange={(e) => setHorarioInicio(e.target.value)} />
          </label>
          <label>
            Horário de término
            <input type="time" value={horarioFim} onChange={(e) => setHorarioFim(e.target.value)} />
          </label>
        </div>

        <label>
          Responsável / professor
          <input type="text" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
        </label>

        <label>
          Capacidade máxima de vagas
          <input
            type="number"
            min="1"
            value={capacidadeMaxima}
            onChange={(e) => setCapacidadeMaxima(e.target.value)}
          />
        </label>

        {erro && <p className="criar-esporte-erro">{erro}</p>}
        {sucesso && <p className="criar-esporte-sucesso">{sucesso}</p>}

        <div className="criar-esporte-botoes">
          <button type="button" className="criar-esporte-cancelar" onClick={() => navigate('/admin/gerencia')}>
            Cancelar
          </button>
          <button
            type="submit"
            className="criar-esporte-confirmar"
            disabled={!camposObrigatoriosPreenchidos}
          >
            Cadastrar esporte
          </button>
        </div>
      </form>
    </div>
  );
}

export default CriarEsporte;

// Tela 20 — Criar esporte (RF20)
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import './CriarEsporte.css';

const categorias = ['Coletivo', 'Individual', 'Luta', 'Aquático', 'Atletismo'];
// numero = DiaSemana no banco (1 = Segunda ... 7 = Domingo)
const diasDaSemana = [
  { curto: 'Seg', nome: 'Segunda', numero: 1 },
  { curto: 'Ter', nome: 'Terça', numero: 2 },
  { curto: 'Qua', nome: 'Quarta', numero: 3 },
  { curto: 'Qui', nome: 'Quinta', numero: 4 },
  { curto: 'Sex', nome: 'Sexta', numero: 5 },
  { curto: 'Sáb', nome: 'Sábado', numero: 6 },
  { curto: 'Dom', nome: 'Domingo', numero: 7 },
];

const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB

function CriarEsporte() {
  const navigate = useNavigate();
  const [locais, setLocais] = useState([]);
  const [enviando, setEnviando] = useState(false);

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

  // Opções do campo Local vêm do banco (GET /api/locais)
  useEffect(() => {
    async function carregarLocais() {
      try {
        const { ok, dados } = await chamarApi('/api/locais');
        if (ok) setLocais(dados.locais);
        else setErro(mensagemDeErro(dados, 'Não foi possível carregar os locais.'));
      } catch {
        setErro('Não foi possível carregar os locais.');
      }
    }
    carregarLocais();
  }, []);

  function toggleDia(dia) {
    setDiasSelecionados((atual) =>
      atual.includes(dia) ? atual.filter((d) => d !== dia) : [...atual, dia]
    );
  }

  function handleImagemSelecionada(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    // RF20.3
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      setErro('Formato de imagem inválido. Use PNG, JPG ou WEBP.');
      e.target.value = '';
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      setErro('A imagem precisa ter no máximo 5MB.');
      e.target.value = '';
      return;
    }

    setErro('');
    setImagem({ nome: arquivo.name, url: URL.createObjectURL(arquivo) });
  }

  // RF20.13
  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    descricao.trim() !== '' &&
    categoria !== '' &&
    local !== '' &&
    diasSelecionados.length > 0 &&
    horarioInicio !== '' &&
    horarioFim !== '' &&
    responsavel.trim() !== '' &&
    capacidadeMaxima !== '';

  async function handleCadastrar(e) {
    e.preventDefault();
    if (enviando) return;
    setSucesso('');

    // RF20.10
    if (horarioFim <= horarioInicio) {
      setErro('O horário de término precisa ser depois do horário de início.');
      return;
    }
    if (Number(capacidadeMaxima) < 1) {
      setErro('A capacidade máxima precisa ser de pelo menos 1 vaga.');
      return;
    }
    setErro('');

    // RF20.15 — grava no banco. A imagem ainda não é enviada: o modelo não tem onde guardá-la.
    setEnviando(true);
    try {
      const { ok, dados } = await chamarApi('/api/esportes', {
        metodo: 'POST',
        corpo: {
          nome,
          descricao,
          categoria,
          idLocal: Number(local),
          dias: diasDaSemana.filter((d) => diasSelecionados.includes(d.nome)).map((d) => d.numero),
          horarioInicio,
          horarioFim,
          responsavel,
          capacidadeMaxima: Number(capacidadeMaxima),
        },
      });
      if (!ok) {
        setErro(mensagemDeErro(dados, 'Não foi possível cadastrar o esporte.'));
        return;
      }
    } catch {
      setErro('Não foi possível cadastrar o esporte.');
      return;
    } finally {
      setEnviando(false);
    }

    // RF20.16
    setSucesso('Esporte cadastrado com sucesso.');
    setImagem(null);
    setNome('');
    setDescricao('');
    setCategoria('');
    setLocal('');
    setDiasSelecionados([]);
    setHorarioInicio('');
    setHorarioFim('');
    setResponsavel('');
    setCapacidadeMaxima('');
  }

  return (
    <div className="criar-esporte-container">
      <div className="criar-esporte-cartao">
        <div className="criar-esporte-topo">
          <Link to="/admin/gerencia" className="criar-esporte-voltar" aria-label="Voltar para Gerência">
            ←
          </Link>
          <h1>Criar esporte</h1>
        </div>

        <form className="criar-esporte-form" onSubmit={handleCadastrar}>
          <label className="criar-esporte-upload">
            <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleImagemSelecionada} />
            {imagem ? (
              <>
                <img src={imagem.url} alt="Pré-visualização da imagem da modalidade" />
                <span className="criar-esporte-hint">{imagem.nome} · clique para trocar</span>
              </>
            ) : (
              <>
                <span className="criar-esporte-upload-icone" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="1.6" />
                    <path d="M21 16l-5-5-8 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <strong>Adicionar imagem</strong>
                <span className="criar-esporte-hint">PNG, JPG ou WEBP até 5MB (recomendado 1200x675) · por enquanto a imagem não é salva</span>
              </>
            )}
          </label>

          <label>
            Nome da modalidade
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Basquete Universitário"
            />
          </label>

          <label>
            Descrição
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a modalidade esportiva, objetivos e requisitos..."
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
            <select value={local} onChange={(e) => setLocal(e.target.value)}>
              <option value="">Selecione um local</option>
              {locais.map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          </label>

          <div className="criar-esporte-campo">
            <span className="criar-esporte-rotulo">Dia da semana</span>
            <div className="criar-esporte-chips">
              {diasDaSemana.map((dia) => (
                <button
                  type="button"
                  key={dia.nome}
                  title={dia.nome}
                  aria-pressed={diasSelecionados.includes(dia.nome)}
                  className={diasSelecionados.includes(dia.nome) ? 'chip chip-ativo' : 'chip'}
                  onClick={() => toggleDia(dia.nome)}
                >
                  {dia.curto}
                </button>
              ))}
            </div>
          </div>

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
            Responsável/professor
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Ex: Prof. Marcos Oliveira"
            />
          </label>

          <label>
            Capacidade máxima de vagas
            <input
              type="number"
              min="1"
              value={capacidadeMaxima}
              onChange={(e) => setCapacidadeMaxima(e.target.value)}
              placeholder="Ex: 30"
            />
          </label>

          {erro && <p className="criar-esporte-erro">{erro}</p>}
          {sucesso && <p className="criar-esporte-sucesso">{sucesso}</p>}

          <div className="criar-esporte-botoes">
            <button type="button" className="criar-esporte-cancelar" onClick={() => navigate('/admin/gerencia')}>
              Cancelar
            </button>
            <button type="submit" className="criar-esporte-confirmar" disabled={!camposObrigatoriosPreenchidos || enviando}>
              {enviando ? 'Cadastrando…' : 'Cadastrar esporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarEsporte;

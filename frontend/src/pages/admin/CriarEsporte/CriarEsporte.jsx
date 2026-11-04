// Tela 20 — Criar esporte (RF20). Com :id na rota, vira "Editar esporte" (o U do CRUD).
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import IconeEsporte from '../../../components/IconeEsporte/IconeEsporte';
import { chamarApi, mensagemDeErro } from '../../../utils/api';
import { CATEGORIAS, ICONES_ESPORTE } from '../../../utils/esportes';
import './CriarEsporte.css';

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

function CriarEsporte() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editando = Boolean(id);
  const voltarPara = editando ? `/esportes/${id}` : '/admin/gerencia';
  const [locais, setLocais] = useState([]);
  const [enviando, setEnviando] = useState(false);

  // Ícone padrão do esporte (imagem sempre genérica, nunca foto real — decisoes.md)
  const [icone, setIcone] = useState('geral');
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

  // Modo edição: preenche o formulário com os dados atuais do esporte
  useEffect(() => {
    if (!editando) return;
    async function carregarEsporte() {
      try {
        const { ok, dados } = await chamarApi(`/api/esportes/${id}`);
        if (!ok) {
          setErro(mensagemDeErro(dados, 'Não foi possível carregar o esporte.'));
          return;
        }
        const e = dados.esporte;
        setIcone(e.icone);
        setNome(e.nome);
        setDescricao(e.descricao);
        setCategoria(e.categoria);
        setLocal(String(e.idLocal));
        setDiasSelecionados(diasDaSemana.filter((d) => e.dias.includes(d.numero)).map((d) => d.nome));
        setHorarioInicio(e.horarioInicio);
        setHorarioFim(e.horarioFim);
        setResponsavel(e.responsavel);
        setCapacidadeMaxima(String(e.capacidadeMaxima));
      } catch {
        setErro('Não foi possível carregar o esporte.');
      }
    }
    carregarEsporte();
  }, [editando, id]);

  function toggleDia(dia) {
    setDiasSelecionados((atual) =>
      atual.includes(dia) ? atual.filter((d) => d !== dia) : [...atual, dia]
    );
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

    // RF20.15 — grava no banco (POST cria; PUT altera o esporte existente)
    setEnviando(true);
    try {
      const { ok, dados } = await chamarApi(editando ? `/api/esportes/${id}` : '/api/esportes', {
        metodo: editando ? 'PUT' : 'POST',
        corpo: {
          nome,
          descricao,
          categoria,
          icone,
          idLocal: Number(local),
          dias: diasDaSemana.filter((d) => diasSelecionados.includes(d.nome)).map((d) => d.numero),
          horarioInicio,
          horarioFim,
          responsavel,
          capacidadeMaxima: Number(capacidadeMaxima),
        },
      });
      if (!ok) {
        setErro(mensagemDeErro(dados, editando ? 'Não foi possível salvar as alterações.' : 'Não foi possível cadastrar o esporte.'));
        return;
      }
    } catch {
      setErro(editando ? 'Não foi possível salvar as alterações.' : 'Não foi possível cadastrar o esporte.');
      return;
    } finally {
      setEnviando(false);
    }

    // Edição salva: volta para os detalhes, que já mostram os dados novos
    if (editando) {
      navigate(`/esportes/${id}`);
      return;
    }

    // RF20.16
    setSucesso('Esporte cadastrado com sucesso.');
    setIcone('geral');
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
          <Link to={voltarPara} className="criar-esporte-voltar" aria-label={editando ? 'Voltar para o esporte' : 'Voltar para Gerência'}>
            ←
          </Link>
          <h1>{editando ? 'Editar esporte' : 'Criar esporte'}</h1>
        </div>

        <form className="criar-esporte-form" onSubmit={handleCadastrar}>
          <div className="criar-esporte-campo" role="radiogroup" aria-label="Ícone do esporte">
            <span className="criar-esporte-rotulo">Ícone do esporte</span>
            <div className="criar-esporte-icones">
              {ICONES_ESPORTE.map((opcao) => (
                <button
                  type="button"
                  key={opcao.nome}
                  role="radio"
                  aria-checked={icone === opcao.nome}
                  className={icone === opcao.nome ? 'criar-esporte-icone selecionado' : 'criar-esporte-icone'}
                  onClick={() => setIcone(opcao.nome)}
                >
                  <IconeEsporte nome={opcao.nome} tamanho={30} />
                  <span>{opcao.rotulo}</span>
                </button>
              ))}
            </div>
          </div>

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
              {CATEGORIAS.map((cat) => (
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
            <button type="button" className="criar-esporte-cancelar" onClick={() => navigate(voltarPara)}>
              Cancelar
            </button>
            <button type="submit" className="criar-esporte-confirmar" disabled={!camposObrigatoriosPreenchidos || enviando}>
              {editando
                ? (enviando ? 'Salvando…' : 'Salvar alterações')
                : (enviando ? 'Cadastrando…' : 'Cadastrar esporte')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarEsporte;

// Tela 22 — Criar evento (RF22)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventos } from '../../../mocks/eventos';
import './CriarEvento.css';

const TIPOS_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

// "2026-11-15" -> "15 NOV", mesmo formato usado em mocks/eventos.js
function formatarData(dataIso) {
  const [, mes, dia] = dataIso.split('-');
  return `${dia} ${MESES[Number(mes) - 1]}`;
}

// Tela pra onde a seta e o "Cancelar" voltam
const TELA_RETORNO = '/admin/gerencia';

function CriarEvento() {
  const navigate = useNavigate();

  const [imagem, setImagem] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  function handleImagemSelecionada(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    // RF22.3
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

  // RF22.9
  const camposObrigatoriosPreenchidos =
    nome.trim() !== '' &&
    descricao.trim() !== '' &&
    local.trim() !== '' &&
    data !== '' &&
    horario.trim() !== '';

  function handleCadastrar(e) {
    e.preventDefault();
    setSucesso('');

    if (!camposObrigatoriosPreenchidos) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setErro('');

    // RF22.11 — TODO: substituir por POST /eventos quando o backend existir
    eventos.push({
      id: eventos.length + 1,
      nome: nome.trim(),
      local: local.trim(),
      data: formatarData(data),
      horario: horario.trim(),
      descricao: descricao.trim(),
      imagem: imagem ? imagem.url : null,
    });

    // RF22.12
    setSucesso('Evento cadastrado com sucesso.');
    setImagem(null);
    setNome('');
    setDescricao('');
    setLocal('');
    setData('');
    setHorario('');
  }

  return (
    <div className="criar-evento-container">
      <div className="criar-evento-cartao">
        <div className="criar-evento-topo">
          <Link to={TELA_RETORNO} className="criar-evento-voltar" aria-label="Voltar">
            ←
          </Link>
          <h1>Criar evento</h1>
        </div>

        <form className="criar-evento-form" onSubmit={handleCadastrar}>
          <label className="criar-evento-upload">
            <input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleImagemSelecionada} />
            {imagem ? (
              <>
                <img src={imagem.url} alt="Pré-visualização da imagem do evento" />
                <span className="criar-evento-hint">{imagem.nome} · clique para trocar</span>
              </>
            ) : (
              <>
                <span className="criar-evento-upload-icone" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="1.6" />
                    <path d="M21 16l-5-5-8 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <strong>Adicionar imagem</strong>
                <span className="criar-evento-hint">PNG, JPG ou WEBP até 5MB (recomendado 1200x675)</span>
              </>
            )}
          </label>

          <label>
            Nome do evento
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Torneio Universitário de Vôlei de Praia"
            />
          </label>

          <label>
            Descrição
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o evento esportivo, regulamento, público-alvo e informações gerais..."
            />
          </label>

          <label>
            Local
            <input
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder="Ex: Arena Poliesportiva UNIFOR - Quadras de Areia"
            />
          </label>

          <label>
            Data do evento
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>

          <label>
            Horário
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              placeholder="Ex: 08:00 às 17:00"
            />
          </label>

          {erro && <p className="criar-evento-erro">{erro}</p>}
          {sucesso && <p className="criar-evento-sucesso">{sucesso}</p>}

          <div className="criar-evento-botoes">
            <button type="button" className="criar-evento-cancelar" onClick={() => navigate(TELA_RETORNO)}>
              Cancelar
            </button>
            <button type="submit" className="criar-evento-confirmar" disabled={!camposObrigatoriosPreenchidos}>
              Cadastrar evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarEvento;

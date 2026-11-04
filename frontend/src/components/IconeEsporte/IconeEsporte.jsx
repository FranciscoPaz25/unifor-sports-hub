// Ícones padrão dos esportes (imagem sempre genérica, nunca foto real — decisoes.md).
// A lista com os nomes e rótulos fica em utils/esportes.js (ICONES_ESPORTE).
const DESENHOS = {
  geral: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3.5 9h17M3.5 15h17" />
    </>
  ),
  futebol: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.3l3.4 2.5-1.3 4h-4.2l-1.3-4z" />
      <path d="M12 8.3V3M15.4 10.8l5-1.6M14.1 14.8l3.1 4.3M9.9 14.8l-3.1 4.3M8.6 10.8l-5-1.6" />
    </>
  ),
  volei: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-.6 4.2.7 7.2 4 9.4M20.8 13.8c-3.8-1.6-7.1-1.4-9.9.8M5.1 18.1c3.3-2.4 4.8-5.5 4.2-9.6" />
    </>
  ),
  basquete: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3v18M5.6 5.6c2.7 2.7 2.7 10.1 0 12.8M18.4 5.6c-2.7 2.7-2.7 10.1 0 12.8" />
    </>
  ),
  natacao: (
    <>
      <circle cx="17" cy="6.5" r="2" />
      <path d="M3 13.5l5.5-4 3.2 3 4.3-2.5" />
      <path d="M2 17.5c1.7 0 2.6-1.2 4.3-1.2s2.6 1.2 4.3 1.2 2.6-1.2 4.3-1.2 2.6 1.2 4.3 1.2" />
      <path d="M2 21c1.7 0 2.6-1.2 4.3-1.2s2.6 1.2 4.3 1.2 2.6-1.2 4.3-1.2 2.6 1.2 4.3 1.2" />
    </>
  ),
  tenis: (
    <>
      <ellipse cx="9.5" cy="9.5" rx="5.5" ry="6.5" transform="rotate(-45 9.5 9.5)" />
      <path d="M13.4 13.4l7 7M6.5 6.5l6 6M9.5 4.5l-5 5M14.3 7.5l-6.8 6.8" />
      <circle cx="19" cy="5" r="2" />
    </>
  ),
  atletismo: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.5M9.5 2.5h5M12 2.5V6M18 7.5l1.6-1.6" />
    </>
  ),
  luta: (
    <>
      <path d="M8 11V7.5A4.5 4.5 0 0 1 12.5 3h1A4.5 4.5 0 0 1 18 7.5V13a5 5 0 0 1-5 5h-2.5A3.5 3.5 0 0 1 7 14.5" />
      <path d="M8 11a2.5 2.5 0 0 0-2.5 2.5v.5A3 3 0 0 0 8.5 17" />
      <path d="M10 18v3h7v-3.6M11 8h4" />
    </>
  ),
  ciclismo: (
    <>
      <circle cx="5.5" cy="16.5" r="3.5" />
      <circle cx="18.5" cy="16.5" r="3.5" />
      <path d="M5.5 16.5L9.5 9h5.5l3.5 7.5M9.5 9l3 7.5H5.5M8 6h3M15 9l-1-3h2.5" />
    </>
  ),
  academia: (
    <>
      <path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />
    </>
  ),
};

function IconeEsporte({ nome, tamanho = 24, cor = '#003DA5' }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DESENHOS[nome] ?? DESENHOS.geral}
    </svg>
  );
}

export default IconeEsporte;

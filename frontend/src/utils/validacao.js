// utils/validacao.js
const REGEX_EMAIL_ALUNO = /^[A-Za-z0-9._%+-]+@edu\.unifor\.br$/i;
const REGEX_EMAIL_ADMIN = /^[A-Za-z0-9._%+-]+@(edu\.)?unifor\.br$/i;

export function validarEmailInstitucional(email, tipo = 'aluno') {
  const valor = email.trim();
  const regex = tipo === 'admin' ? REGEX_EMAIL_ADMIN : REGEX_EMAIL_ALUNO;

  if (!valor.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return 'Informe um e-mail válido.';
  }
  if (!regex.test(valor)) {
    return 'Use seu e-mail institucional (@edu.unifor.br)';
  }
  return ''; // válido
}
export function parseErrors(data) {
  if (!data) return {};
  if (Array.isArray(data)) return { _geral: data.join(' ') };
  if (typeof data === 'string') return { _geral: data };
  const erros = {};
  for (const [campo, msgs] of Object.entries(data)) {
    erros[campo] = Array.isArray(msgs) ? msgs.join(' ') : msgs;
  }
  if (data.detail) erros._geral = data.detail;
  if (data.non_field_errors) erros._geral = data.non_field_errors.join(' ');
  return erros;
}

export function formatarData(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

export function formatarHora(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatarPreco(valor) {
  if (!valor) return '';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarDuracao(minutos) {
  if (!minutos) return '';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function dataHoje() {
  return new Date().toISOString().slice(0, 10);
}

export function dataOntem() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const LABEL_STATUS = {
  solicitado: 'Solicitado',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

import { Badge } from 'react-bootstrap'

const STATUS = {
  solicitado: { cor: 'warning', texto: 'Solicitado' },
  confirmado: { cor: 'primary', texto: 'Confirmado' },
  concluido: { cor: 'success', texto: 'Concluído' },
  cancelado: { cor: 'secondary', texto: 'Cancelado' },
}

export function StatusAula({ status }) {
  const { cor, texto } = STATUS[status] ?? { cor: 'secondary', texto: status }
  return <Badge bg={cor} text={cor === 'warning' ? 'dark' : undefined}>{texto}</Badge>
}

export const StatusTreino = StatusAula

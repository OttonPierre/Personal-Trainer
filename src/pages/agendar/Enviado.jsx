import { Button, Card } from 'react-bootstrap'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { StatusAula } from '../../components/StatusAula'
import { formatarData, formatarHora } from '../../formatos'

export function Enviado() {
  const location = useLocation()
  const agendamento = location.state?.agendamento

  if (!agendamento) {
    return <Navigate to="/inicio" />
  }

  return (
    <Card className="text-center">
      <Card.Body className="p-4">
        <i className="bi bi-check-circle text-success display-3"></i>
        <h2 className="my-3">Agendamento enviado!</h2>
        <p className="text-secondary">
          Seu pedido foi registrado e aguarda confirmação do estúdio.
        </p>
        <div className="mb-4">
          <StatusAula status={agendamento.status} />
        </div>
        <p className="mb-4">
          <strong>{agendamento.servico_nome}</strong> com {agendamento.recurso_nome}
          <br />
          {formatarData(agendamento.inicio)} às {formatarHora(agendamento.inicio)}
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Button as={Link} to={`/treinos/${agendamento.id}`}>Ver treino</Button>
          <Button as={Link} to="/inicio" variant="outline-primary">Início</Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Enviado

import { Button, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export function Entrada() {
  return (
    <div className="text-center">
      <Image src="/favicon.svg" alt="Personal Trainer" width={80} height={80} fluid className="mb-4" />
      <h2 className="mb-3">Personal Trainer</h2>
      <p className="text-secondary">
        Agendamento de treinos individuais e avaliações físicas com personal trainers.
      </p>
      <div className="d-grid gap-2 mt-4">
        <Button as={Link} to="/login">Entrar</Button>
        <Button as={Link} to="/cadastro" variant="outline-primary">Criar conta</Button>
      </div>
    </div>
  )
}

export default Entrada

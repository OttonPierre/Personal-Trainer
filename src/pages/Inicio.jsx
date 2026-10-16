import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../AuthContext'
import { AulaItem } from '../components/AulaItem'
import { Carregando } from '../components/Carregando'
import { Erro } from '../components/Erro'
import { hoje } from '../formatos'
import { useApi } from '../hooks/useApi'

function ehProximo(treino) {
  return ['solicitado', 'confirmado'].includes(treino.status) && new Date(treino.fim) > new Date()
}

// percorre as páginas até achar o primeiro treino que ainda não passou
async function buscarProximoTreino(caminho) {
  let proxima = caminho
  while (proxima) {
    const dados = await api(proxima)
    const treino = dados.results.find(ehProximo)
    if (treino) return treino
    proxima = dados.next
  }
  return null
}

export function Inicio() {
  const { usuario } = useAuth()
  const organizacao = useApi('/organizacao/')
  const treino = useApi(`/agendamentos/?data_inicio=${hoje()}`, buscarProximoTreino)

  if (organizacao.erro) return <Erro erro={organizacao.erro} tentarDeNovo={organizacao.recarregar} />
  if (treino.erro) return <Erro erro={treino.erro} tentarDeNovo={treino.recarregar} />
  if (organizacao.carregando || treino.carregando) return <Carregando />

  const { nome, descricao, logo } = organizacao.dados

  return (
    <Row className="g-4">
      <Col md={5}>
        <Card className="text-center h-100">
          <Card.Body>
            <Image src={logo ?? '/favicon.svg'} alt={nome} fluid className="mb-3" style={{ maxHeight: 180 }} />
            <Card.Title>{nome}</Card.Title>
            <Card.Text className="text-secondary">{descricao}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={7}>
        <h2>Olá, {usuario.nome}!</h2>
        <h5 className="mt-4">Seu próximo treino</h5>
        {treino.dados ? (
          <ListGroup className="mb-3">
            <AulaItem aula={treino.dados} />
          </ListGroup>
        ) : (
          <p className="text-secondary">Você não tem treinos agendados.</p>
        )}
        <Button as={Link} to="/agendar" size="lg">
          <i className="bi bi-calendar-plus"></i> Agendar
        </Button>
      </Col>
    </Row>
  )
}

export default Inicio

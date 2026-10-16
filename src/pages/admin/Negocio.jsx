import { useState } from 'react'
import { Alert, Button, Card, Form, Image } from 'react-bootstrap'
import { api, mensagemDeErro } from '../../api/client'
import { useAuth } from '../../AuthContext'
import { Carregando } from '../../components/Carregando'
import { Erro } from '../../components/Erro'
import { useApi } from '../../hooks/useApi'

export function Negocio() {
  const { setUsuario } = useAuth()
  const { dados, erro, carregando, recarregar } = useApi('/organizacao/')

  if (erro) return <Erro erro={erro} tentarDeNovo={recarregar} />
  if (carregando) return <Carregando />

  return <FormNegocio organizacao={dados} onSalvo={setUsuario} />
}

function FormNegocio({ organizacao, onSalvo }) {
  const [nome, setNome] = useState(organizacao.nome)
  const [descricao, setDescricao] = useState(organizacao.descricao)
  const [logo, setLogo] = useState(organizacao.logo)
  const [arquivo, setArquivo] = useState(null)
  const [erro, setErro] = useState(null)
  const [erros, setErros] = useState({})
  const [salvo, setSalvo] = useState(false)

  async function salvar(dados) {
    setErro(null)
    setErros({})
    setSalvo(false)
    try {
      const atualizada = await api('/organizacao/', { method: 'PATCH', body: dados })
      setLogo(atualizada.logo)
      setSalvo(true)
      // atualiza o nome da organização no menu
      const eu = await api('/auth/eu/')
      onSalvo(eu)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setErros(erro.dados ?? {})
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formulario = new FormData()
    formulario.append('nome', nome)
    formulario.append('descricao', descricao)
    if (arquivo) {
      formulario.append('logo', arquivo)
    }
    salvar(formulario)
  }

  return (
    <Card>
      <Card.Body>
        <h2 className="mb-4">Dados do negócio</h2>
        {erro && <Alert variant="danger">{erro}</Alert>}
        {salvo && <Alert variant="success">Dados atualizados.</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nome">
            <Form.Label>Nome</Form.Label>
            <Form.Control value={nome} onChange={e => setNome(e.target.value)} isInvalid={!!erros.nome} required />
            <Form.Control.Feedback type="invalid">{erros.nome?.join(' ')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="descricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control as="textarea" rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} isInvalid={!!erros.descricao} />
            <Form.Control.Feedback type="invalid">{erros.descricao?.join(' ')}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="logo">
            <Form.Label>Logo</Form.Label>
            {logo && (
              <div className="mb-2">
                <Image src={logo} width={200} thumbnail />
              </div>
            )}
            <Form.Control type="file" accept="image/*" onChange={e => setArquivo(e.target.files[0])} isInvalid={!!erros.logo} />
            <Form.Control.Feedback type="invalid">{erros.logo?.join(' ')}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit">Salvar</Button>
            {logo && (
              <Button variant="outline-secondary" onClick={() => salvar({ logo: null })}>
                Remover logo
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default Negocio

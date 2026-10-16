import { Tab, Tabs } from 'react-bootstrap'
import { ListaAulas } from '../components/ListaAulas'
import { hoje, somarDias } from '../formatos'

export function MeusTreinos() {
  return (
    <>
      <h2 className="mb-4">Meus treinos</h2>
      <Tabs defaultActiveKey="proximos" className="mb-3" mountOnEnter>
        <Tab eventKey="proximos" title="Próximos">
          <ListaAulas caminho={`/agendamentos/?data_inicio=${hoje()}`} vazio="Nenhum treino agendado." />
        </Tab>
        <Tab eventKey="historico" title="Histórico">
          <ListaAulas caminho={`/agendamentos/?data_fim=${somarDias(hoje(), -1)}&ordering=-inicio`} vazio="Nenhum treino no histórico." />
        </Tab>
      </Tabs>
    </>
  )
}

export const MinhasAulas = MeusTreinos
export default MeusTreinos

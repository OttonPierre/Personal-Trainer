import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthProvider'
import { Layout } from './components/Layout'
import { Publica } from './components/Publica'
import { AConfirmar } from './pages/admin/AConfirmar'
import { Agenda } from './pages/admin/Agenda'
import { Avaliacoes } from './pages/admin/Avaliacoes'
import { Horarios } from './pages/admin/Horarios'
import { Negocio } from './pages/admin/Negocio'
import { EditarRecurso, NovoRecurso } from './pages/admin/Recurso'
import { Recursos } from './pages/admin/Recursos'
import { EditarServico, NovoServico } from './pages/admin/Servico'
import { Servicos } from './pages/admin/Servicos'
import { Confirmar } from './pages/agendar/Confirmar'
import { AlterarSenha } from './pages/AlterarSenha'
import { EscolherHorario } from './pages/agendar/EscolherHorario'
import { EscolherPersonal } from './pages/agendar/EscolherPersonal'
import { EscolherServico } from './pages/agendar/EscolherServico'
import { Enviado } from './pages/agendar/Enviado'
import { Treino } from './pages/Treino'
import { Avaliar } from './pages/Avaliar'
import { Cadastro } from './pages/Cadastro'
import { Entrada } from './pages/Entrada'
import { EsqueciSenha } from './pages/EsqueciSenha'
import { Inicio } from './pages/Inicio'
import { Login } from './pages/Login'
import { MeusTreinos } from './pages/MeusTreinos'
import { NaoEncontrado } from './pages/NaoEncontrado'
import { Perfil } from './pages/Perfil'
import { Personal } from './pages/Personal'
import { Personais } from './pages/Personais'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Publica />}>
            <Route index element={<Entrada />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/agendar" element={<EscolherServico />} />
            <Route path="/agendar/personal" element={<EscolherPersonal />} />
            <Route path="/agendar/professor" element={<EscolherPersonal />} />
            <Route path="/agendar/horario" element={<EscolherHorario />} />
            <Route path="/agendar/confirmar" element={<Confirmar />} />
            <Route path="/agendar/enviado" element={<Enviado />} />
            <Route path="/meus-treinos" element={<MeusTreinos />} />
            <Route path="/treinos" element={<MeusTreinos />} />
            <Route path="/aulas" element={<MeusTreinos />} />
            <Route path="/treinos/:id" element={<Treino />} />
            <Route path="/aulas/:id" element={<Treino />} />
            <Route path="/treinos/:id/avaliar" element={<Avaliar />} />
            <Route path="/aulas/:id/avaliar" element={<Avaliar />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/perfil/senha" element={<AlterarSenha />} />
            <Route path="/alterar-senha" element={<AlterarSenha />} />
            <Route path="/admin/agenda" element={<Agenda />} />
            <Route path="/admin/confirmar" element={<AConfirmar />} />
            <Route path="/admin/a-confirmar" element={<AConfirmar />} />
            <Route path="/admin/negocio" element={<Negocio />} />
            <Route path="/admin/negocios" element={<Negocio />} />
            <Route path="/admin/recursos" element={<Recursos />} />
            <Route path="/admin/personais" element={<Recursos />} />
            <Route path="/admin/recursos/novo" element={<NovoRecurso />} />
            <Route path="/admin/personais/novo" element={<NovoRecurso />} />
            <Route path="/admin/recursos/:id" element={<EditarRecurso />} />
            <Route path="/admin/personais/:id" element={<EditarRecurso />} />
            <Route path="/admin/recursos/:id/horarios" element={<Horarios />} />
            <Route path="/admin/personais/:id/horarios" element={<Horarios />} />
            <Route path="/admin/servicos" element={<Servicos />} />
            <Route path="/admin/servicos/novo" element={<NovoServico />} />
            <Route path="/admin/servicos/:id" element={<EditarServico />} />
            <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
            <Route path="/personais" element={<Personais />} />
            <Route path="/professores" element={<Personais />} />
            <Route path="/personais/:id" element={<Personal />} />
            <Route path="/professores/:id" element={<Personal />} />
            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

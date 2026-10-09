import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import RotaProtegida from './components/RotaProtegida';

// Páginas públicas
import Entrada from './pages/Entrada';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsqueciSenha from './pages/EsqueciSenha';

// Páginas de todos os usuários logados
import Perfil from './pages/Perfil';
import AlterarSenha from './pages/AlterarSenha';

// Páginas do aluno
import Inicio from './pages/aluno/Inicio';
import EscolherServico from './pages/aluno/EscolherServico';
import EscolherPersonal from './pages/aluno/EscolherPersonal';
import EscolherHorario from './pages/aluno/EscolherHorario';
import ConfirmarAgendamento from './pages/aluno/ConfirmarAgendamento';
import AgendamentoEnviado from './pages/aluno/AgendamentoEnviado';
import MeusTreinos from './pages/aluno/MeusTreinos';
import DetalheTreino from './pages/aluno/DetalheTreino';
import AvaliarTreino from './pages/aluno/AvaliarTreino';
import Personais from './pages/aluno/Personais';
import PerfilPersonal from './pages/aluno/PerfilPersonal';

// Páginas do administrador
import AgendaDia from './pages/admin/AgendaDia';
import AConfirmar from './pages/admin/AConfirmar';
import DetalheTreinoAdmin from './pages/admin/DetalheTreinoAdmin';
import DadosNegocio from './pages/admin/DadosNegocio';
import PersonaisAdmin from './pages/admin/PersonaisAdmin';
import FormPersonal from './pages/admin/FormPersonal';
import HorariosPersonal from './pages/admin/HorariosPersonal';
import ServicosAdmin from './pages/admin/ServicosAdmin';
import FormServico from './pages/admin/FormServico';
import AvaliacoesAdmin from './pages/admin/AvaliacoesAdmin';

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Entrada />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />

          {/* Rotas protegidas - todos os logados */}
          <Route
            path="/perfil"
            element={<RotaProtegida><Layout><Perfil /></Layout></RotaProtegida>}
          />
          <Route
            path="/alterar-senha"
            element={<RotaProtegida><Layout><AlterarSenha /></Layout></RotaProtegida>}
          />

          {/* Rotas do aluno */}
          <Route path="/inicio" element={<RotaProtegida><Layout><Inicio /></Layout></RotaProtegida>} />
          <Route path="/agendar" element={<RotaProtegida><Layout><EscolherServico /></Layout></RotaProtegida>} />
          <Route path="/agendar/personal" element={<RotaProtegida><Layout><EscolherPersonal /></Layout></RotaProtegida>} />
          <Route path="/agendar/horario" element={<RotaProtegida><Layout><EscolherHorario /></Layout></RotaProtegida>} />
          <Route path="/agendar/confirmar" element={<RotaProtegida><Layout><ConfirmarAgendamento /></Layout></RotaProtegida>} />
          <Route path="/agendar/enviado" element={<RotaProtegida><Layout><AgendamentoEnviado /></Layout></RotaProtegida>} />
          <Route path="/meus-treinos" element={<RotaProtegida><Layout><MeusTreinos /></Layout></RotaProtegida>} />
          <Route path="/treinos/:id" element={<RotaProtegida><Layout><DetalheTreino /></Layout></RotaProtegida>} />
          <Route path="/treinos/:id/avaliar" element={<RotaProtegida><Layout><AvaliarTreino /></Layout></RotaProtegida>} />
          <Route path="/personais" element={<RotaProtegida><Layout><Personais /></Layout></RotaProtegida>} />
          <Route path="/personais/:id" element={<RotaProtegida><Layout><PerfilPersonal /></Layout></RotaProtegida>} />

          {/* Rotas do administrador */}
          <Route path="/admin/agenda" element={<RotaProtegida admin><Layout><AgendaDia /></Layout></RotaProtegida>} />
          <Route path="/admin/a-confirmar" element={<RotaProtegida admin><Layout><AConfirmar /></Layout></RotaProtegida>} />
          <Route path="/admin/treinos/:id" element={<RotaProtegida admin><Layout><DetalheTreinoAdmin /></Layout></RotaProtegida>} />
          <Route path="/admin/negocios" element={<RotaProtegida admin><Layout><DadosNegocio /></Layout></RotaProtegida>} />
          <Route path="/admin/personais" element={<RotaProtegida admin><Layout><PersonaisAdmin /></Layout></RotaProtegida>} />
          <Route path="/admin/personais/novo" element={<RotaProtegida admin><Layout><FormPersonal /></Layout></RotaProtegida>} />
          <Route path="/admin/personais/:id" element={<RotaProtegida admin><Layout><FormPersonal /></Layout></RotaProtegida>} />
          <Route path="/admin/personais/:id/horarios" element={<RotaProtegida admin><Layout><HorariosPersonal /></Layout></RotaProtegida>} />
          <Route path="/admin/servicos" element={<RotaProtegida admin><Layout><ServicosAdmin /></Layout></RotaProtegida>} />
          <Route path="/admin/servicos/novo" element={<RotaProtegida admin><Layout><FormServico /></Layout></RotaProtegida>} />
          <Route path="/admin/servicos/:id" element={<RotaProtegida admin><Layout><FormServico /></Layout></RotaProtegida>} />
          <Route path="/admin/avaliacoes" element={<RotaProtegida admin><Layout><AvaliacoesAdmin /></Layout></RotaProtegida>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

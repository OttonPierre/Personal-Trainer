import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (isAdmin) {
    return (
      <nav>
        <NavLink to="/admin/agenda">Agenda</NavLink>
        <NavLink to="/admin/a-confirmar">A confirmar</NavLink>
        <NavLink to="/admin/negocios">Negócio</NavLink>
        <NavLink to="/admin/personais">Personais</NavLink>
        <NavLink to="/admin/servicos">Serviços</NavLink>
        <NavLink to="/admin/avaliacoes">Avaliações</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>
        <button type="button" onClick={handleLogout}>Sair</button>
      </nav>
    );
  }

  return (
    <nav>
      <NavLink to="/inicio">Início</NavLink>
      <NavLink to="/agendar">Agendar</NavLink>
      <NavLink to="/meus-treinos">Meus treinos</NavLink>
      <NavLink to="/personais">Personais</NavLink>
      <NavLink to="/perfil">Perfil</NavLink>
      <button type="button" onClick={handleLogout}>Sair</button>
    </nav>
  );
}

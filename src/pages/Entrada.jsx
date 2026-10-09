import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Entrada() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('access')) {
      navigate('/inicio', { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Personal Trainer</h1>
      <p>Bem-vindo ao app do Personal Trainer</p>
      <button type="button" onClick={() => navigate('/login')}>Entrar</button>
      <button type="button" onClick={() => navigate('/cadastro')}>Criar conta</button>
    </div>
  );
}

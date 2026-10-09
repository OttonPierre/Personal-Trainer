import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getEu } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { parseErrors } from '../utils/helpers';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    setLoading(true);
    try {
      const res = await login({ ...form, organizacao: 'personal-trainer' });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setErros({ _geral: 'Muitas tentativas, aguarde um minuto.' });
        } else {
          setErros({ _geral: data.detail || 'Organização, e-mail ou senha inválidos.' });
        }
        return;
      }
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      const resEu = await getEu();
      if (resEu && resEu.ok) {
        const eu = await resEu.json();
        setUser(eu);
        const isAdmin = (eu.permissoes || []).includes('api.change_organizacao');
        navigate(isAdmin ? '/admin/agenda' : '/inicio');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
          {erros.email && <span>{erros.email}</span>}
        </div>
        <div>
          <label>Senha</label>
          <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
          {erros.senha && <span>{erros.senha}</span>}
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <Link to="/cadastro">Criar conta</Link>
      <Link to="/esqueci-senha">Esqueci minha senha</Link>
    </div>
  );
}

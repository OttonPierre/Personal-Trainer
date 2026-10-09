import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastro, login, getEu } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { parseErrors } from '../utils/helpers';

export default function Cadastro() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
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
      const resCadastro = await cadastro({
        ...form,
        organizacao: 'personal-trainer',
      });
      const dataCadastro = await resCadastro.json();
      if (!resCadastro.ok) {
        setErros(parseErrors(dataCadastro));
        return;
      }
      const resLogin = await login({
        email: form.email,
        senha: form.senha,
        organizacao: 'personal-trainer',
      });
      const dataLogin = await resLogin.json();
      if (!resLogin.ok) {
        navigate('/login');
        return;
      }
      localStorage.setItem('access', dataLogin.access);
      localStorage.setItem('refresh', dataLogin.refresh);
      const resEu = await getEu();
      if (resEu && resEu.ok) {
        const eu = await resEu.json();
        setUser(eu);
      }
      navigate('/inicio');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
          {erros.nome && <span>{erros.nome}</span>}
        </div>
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
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}

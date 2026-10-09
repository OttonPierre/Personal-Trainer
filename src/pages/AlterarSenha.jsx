import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alterarSenha } from '../api/endpoints';
import { parseErrors } from '../utils/helpers';

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ senha_atual: '', nova_senha: '', confirmar: '' });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    if (form.nova_senha !== form.confirmar) {
      setErros({ confirmar: 'As senhas não coincidem.' });
      return;
    }
    setLoading(true);
    try {
      const res = await alterarSenha({ senha_atual: form.senha_atual, nova_senha: form.nova_senha });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setErros({ _geral: 'Muitas tentativas, aguarde um minuto.' });
        } else {
          setErros(parseErrors(data));
        }
        return;
      }
      navigate('/perfil', { state: { mensagem: 'Senha alterada' } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Alterar senha</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Senha atual</label>
          <input type="password" name="senha_atual" value={form.senha_atual} onChange={handleChange} required />
          {erros.senha_atual && <span>{erros.senha_atual}</span>}
        </div>
        <div>
          <label>Nova senha</label>
          <input type="password" name="nova_senha" value={form.nova_senha} onChange={handleChange} required />
          {erros.nova_senha && <span>{erros.nova_senha}</span>}
        </div>
        <div>
          <label>Confirmar nova senha</label>
          <input type="password" name="confirmar" value={form.confirmar} onChange={handleChange} required />
          {erros.confirmar && <span>{erros.confirmar}</span>}
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
        <button type="button" onClick={() => navigate('/perfil')}>Cancelar</button>
      </form>
    </div>
  );
}

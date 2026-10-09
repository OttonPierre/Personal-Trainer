import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEu, patchEu } from '../api/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { parseErrors } from '../utils/helpers';

export default function Perfil() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nome: '' });
  const [foto, setFoto] = useState(null);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getEu();
      if (res && res.ok) {
        const data = await res.json();
        setUser(data);
        setForm({ nome: data.nome || '' });
      } else {
        setErro('Erro ao carregar perfil.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    setSucesso('');
    const fd = new FormData();
    fd.append('nome', form.nome);
    if (foto) fd.append('foto', foto);
    const res = await patchEu(fd);
    const data = await res.json();
    if (!res.ok) {
      setErros(parseErrors(data));
      return;
    }
    setUser(data);
    setSucesso('Perfil atualizado.');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (loading) return <p>Carregando...</p>;
  if (erro) return <div><p>{erro}</p><button onClick={carregar}>Tentar de novo</button></div>;

  return (
    <div>
      <h1>Meu perfil</h1>
      {user?.foto && <img src={user.foto} alt="Foto" width={80} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          {erros.nome && <span>{erros.nome}</span>}
        </div>
        <div>
          <label>Foto</label>
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
          {erros.foto && <span>{erros.foto}</span>}
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        {sucesso && <p>{sucesso}</p>}
        <button type="submit">Salvar</button>
      </form>
      <button type="button" onClick={() => navigate('/alterar-senha')}>Alterar senha</button>
      <button type="button" onClick={handleLogout}>Sair</button>
    </div>
  );
}

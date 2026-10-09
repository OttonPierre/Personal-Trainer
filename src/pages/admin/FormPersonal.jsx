import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecurso, postRecurso, patchRecurso } from '../../api/endpoints';
import { parseErrors } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function FormPersonal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = !!id;
  const [form, setForm] = useState({ nome: '', bio: '', capacidade: 1, ativo: true });
  const [foto, setFoto] = useState(null);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(isEdicao);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!isEdicao) return;
    getRecurso(id).then(async (res) => {
      if (!res.ok) { setErro('Personal não encontrado.'); setLoading(false); return; }
      const data = await res.json();
      setForm({ nome: data.nome || '', bio: data.bio || '', capacidade: data.capacidade || 1, ativo: data.ativo });
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (foto) fd.append('foto', foto);
    const res = isEdicao ? await patchRecurso(id, fd) : await postRecurso(fd);
    const data = await res.json();
    if (!res.ok) { setErros(parseErrors(data)); return; }
    navigate('/admin/personais');
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} />;

  return (
    <div>
      <h1>{isEdicao ? 'Editar personal' : 'Novo personal'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          {erros.nome && <span>{erros.nome}</span>}
        </div>
        <div>
          <label>Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          {erros.bio && <span>{erros.bio}</span>}
        </div>
        <div>
          <label>Foto</label>
          <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} />
          {erros.foto && <span>{erros.foto}</span>}
        </div>
        <div>
          <label>Capacidade</label>
          <input
            type="number"
            min={1}
            value={form.capacidade}
            onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
          />
          {erros.capacidade && <span>{erros.capacidade}</span>}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            Ativo
          </label>
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        <button type="submit">Salvar</button>
        {isEdicao && (
          <button type="button" onClick={() => navigate(`/admin/personais/${id}/horarios`)}>
            Horários
          </button>
        )}
        <button type="button" onClick={() => navigate('/admin/personais')}>Cancelar</button>
      </form>
    </div>
  );
}

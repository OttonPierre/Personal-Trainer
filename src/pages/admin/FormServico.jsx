import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getServico, postServico, patchServico, getRecursos } from '../../api/endpoints';
import { parseErrors } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function FormServico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = !!id;
  const [form, setForm] = useState({ nome: '', descricao: '', duracao: 60, preco: '', ativo: true });
  const [imagem, setImagem] = useState(null);
  const [personaisSelecionados, setPersonaisSelecionados] = useState([]);
  const [todosPersonais, setTodosPersonais] = useState([]);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function init() {
      const resP = await getRecursos();
      if (resP.ok) {
        const dp = await resP.json();
        setTodosPersonais(dp.results || dp);
      }
      if (isEdicao) {
        const res = await getServico(id);
        if (!res.ok) { setErro('Serviço não encontrado.'); setLoading(false); return; }
        const data = await res.json();
        setForm({ nome: data.nome || '', descricao: data.descricao || '', duracao: data.duracao || 60, preco: data.preco || '', ativo: data.ativo });
        setPersonaisSelecionados(data.recursos || []);
      }
      setLoading(false);
    }
    init();
  }, [id]);

  function togglePersonal(pid) {
    setPersonaisSelecionados((prev) =>
      prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    personaisSelecionados.forEach((pid) => fd.append('recursos', pid));
    if (imagem) fd.append('imagem', imagem);
    const res = isEdicao ? await patchServico(id, fd) : await postServico(fd);
    const data = await res.json();
    if (!res.ok) { setErros(parseErrors(data)); return; }
    navigate('/admin/servicos');
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} />;

  return (
    <div>
      <h1>{isEdicao ? 'Editar serviço' : 'Novo serviço'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          {erros.nome && <span>{erros.nome}</span>}
        </div>
        <div>
          <label>Descrição</label>
          <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </div>
        <div>
          <label>Duração (minutos)</label>
          <input type="number" min={1} value={form.duracao} onChange={(e) => setForm({ ...form, duracao: e.target.value })} required />
          {erros.duracao && <span>{erros.duracao}</span>}
        </div>
        <div>
          <label>Preço (R$)</label>
          <input type="number" step="0.01" min={0} value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
          {erros.preco && <span>{erros.preco}</span>}
        </div>
        <div>
          <label>Imagem</label>
          <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} />
        </div>
        <div>
          <label>Personais</label>
          {todosPersonais.map((p) => (
            <label key={p.id}>
              <input
                type="checkbox"
                checked={personaisSelecionados.includes(p.id)}
                onChange={() => togglePersonal(p.id)}
              />
              {p.nome}
            </label>
          ))}
        </div>
        <div>
          <label>
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate('/admin/servicos')}>Cancelar</button>
      </form>
    </div>
  );
}

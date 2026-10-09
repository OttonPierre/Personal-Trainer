import { useState, useEffect } from 'react';
import { getOrganizacao, patchOrganizacao } from '../../api/endpoints';
import { parseErrors } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function DadosNegocio() {
  const [org, setOrg] = useState(null);
  const [form, setForm] = useState({ nome: '', descricao: '' });
  const [logo, setLogo] = useState(null);
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getOrganizacao();
      if (!res.ok) { setErro('Erro ao carregar.'); return; }
      const data = await res.json();
      setOrg(data);
      setForm({ nome: data.nome || '', descricao: data.descricao || '' });
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
    fd.append('descricao', form.descricao);
    if (logo) fd.append('logo', logo);
    const res = await patchOrganizacao(fd);
    const data = await res.json();
    if (!res.ok) { setErros(parseErrors(data)); return; }
    setOrg(data);
    setSucesso('Dados salvos com sucesso.');
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      <h1>Dados do negócio</h1>
      {org?.logo && <img src={org.logo} alt="Logo" width={120} />}
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
          <label>Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          {erros.descricao && <span>{erros.descricao}</span>}
        </div>
        <div>
          <label>Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
          {erros.logo && <span>{erros.logo}</span>}
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        {sucesso && <p>{sucesso}</p>}
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

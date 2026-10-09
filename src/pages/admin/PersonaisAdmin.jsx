import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecursos } from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function PersonaisAdmin() {
  const navigate = useNavigate();
  const [personais, setPersonais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const params = filtro ? `?ativo=${filtro}` : '';
      const res = await getRecursos(params);
      if (!res.ok) { setErro('Erro ao carregar.'); return; }
      const data = await res.json();
      setPersonais(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [filtro]);

  return (
    <div>
      <h1>Personais</h1>
      <div>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <button type="button" onClick={() => navigate('/admin/personais/novo')}>Novo personal</button>
      </div>
      {loading && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={carregar} />}
      {!loading && !erro && personais.length === 0 && <p>Cadastre o primeiro personal.</p>}
      {personais.map((p) => (
        <div
          key={p.id}
          onClick={() => navigate(`/admin/personais/${p.id}`)}
          style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
        >
          {p.foto && <img src={p.foto} alt={p.nome} width={50} />}
          <strong>{p.nome}</strong>
          <span> | Capacidade: {p.capacidade}</span>
          <span> | {p.ativo ? '✅ Ativo' : '❌ Inativo'}</span>
        </div>
      ))}
    </div>
  );
}

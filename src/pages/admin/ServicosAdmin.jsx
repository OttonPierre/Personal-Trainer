import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicos } from '../../api/endpoints';
import { formatarPreco, formatarDuracao } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function ServicosAdmin() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const params = filtro ? `?ativo=${filtro}` : '';
      const res = await getServicos(params);
      if (!res.ok) { setErro('Erro ao carregar.'); return; }
      const data = await res.json();
      setServicos(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [filtro]);

  return (
    <div>
      <h1>Serviços</h1>
      <div>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <button type="button" onClick={() => navigate('/admin/servicos/novo')}>Novo serviço</button>
      </div>
      {loading && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={carregar} />}
      {!loading && !erro && servicos.length === 0 && <p>Cadastre o primeiro serviço.</p>}
      {servicos.map((s) => (
        <div
          key={s.id}
          onClick={() => navigate(`/admin/servicos/${s.id}`)}
          style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
        >
          {s.imagem && <img src={s.imagem} alt={s.nome} width={50} />}
          <strong>{s.nome}</strong>
          <span> | {formatarDuracao(s.duracao)}</span>
          <span> | {formatarPreco(s.preco)}</span>
          <span> | {s.ativo ? '✅ Ativo' : '❌ Inativo'}</span>
        </div>
      ))}
    </div>
  );
}

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
      if (!res.ok) { 
        setErro('Erro ao carregar os serviços.'); 
        return; 
      }
      const data = await res.json();
      setServicos(data.results || data);
    } catch (err) {
      setErro('Erro de conexão ao carregar serviços.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    carregar(); 
  }, [filtro]);

  return (
    <div>
      <h1>Serviços</h1>
      <div style={{ marginBottom: 16 }}>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>

        {/* Botão sempre visível no topo */}
        <button 
          type="button" 
          onClick={() => navigate('/admin/servicos/novo')}
          style={{ marginLeft: 8, cursor: 'pointer' }}
        >
          + Novo serviço
        </button>
      </div>

      {loading && <Loading />}
      
      {erro && <ErrorMsg message={erro} onRetry={carregar} />}

      {!loading && !erro && servicos.length === 0 && (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <p>Nenhum serviço cadastrado.</p>
          <button 
            type="button" 
            onClick={() => navigate('/admin/servicos/novo')}
          >
            Cadastrar o primeiro serviço
          </button>
        </div>
      )}

      {!loading && !erro && servicos.map((s) => (
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
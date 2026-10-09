import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServicos } from '../../api/endpoints';
import { formatarPreco, formatarDuracao } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function EscolherServico() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getServicos('?ativo=true');
      if (!res.ok) { setErro('Erro ao carregar serviços.'); return; }
      const data = await res.json();
      setServicos(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      <h1>Escolher serviço</h1>
      {servicos.length === 0 ? (
        <p>Nenhum serviço disponível.</p>
      ) : (
        servicos.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate('/agendar/personal', { state: { servico: s } })}
            style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
          >
            {s.imagem && <img src={s.imagem} alt={s.nome} width={80} />}
            <h3>{s.nome}</h3>
            <p>{s.descricao}</p>
            <p>Duração: {formatarDuracao(s.duracao)}</p>
            <p>Preço: {formatarPreco(s.preco)}</p>
          </div>
        ))
      )}
    </div>
  );
}

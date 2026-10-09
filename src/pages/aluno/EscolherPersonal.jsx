import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRecursos } from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function EscolherPersonal() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const servico = state?.servico;
  const [personais, setPersonais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getRecursos(`?servicos=${servico?.id}&ativo=true`);
      if (!res.ok) { setErro('Erro ao carregar personais.'); return; }
      const data = await res.json();
      setPersonais(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (servico) carregar(); }, [servico]);

  function escolher(personal) {
    navigate('/agendar/horario', { state: { servico, personal } });
  }

  if (!servico) return <p>Serviço não selecionado. <button onClick={() => navigate('/agendar')}>Voltar</button></p>;
  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      <h1>Escolher personal</h1>
      <div
        onClick={() => escolher(null)}
        style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
      >
        <strong>Qualquer um</strong>
      </div>
      {personais.length === 0 ? (
        <p>Nenhum personal realiza este serviço.</p>
      ) : (
        personais.map((p) => (
          <div
            key={p.id}
            onClick={() => escolher(p)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
          >
            {p.foto && <img src={p.foto} alt={p.nome} width={60} />}
            <h3>{p.nome}</h3>
            <p>{p.bio}</p>
          </div>
        ))
      )}
    </div>
  );
}

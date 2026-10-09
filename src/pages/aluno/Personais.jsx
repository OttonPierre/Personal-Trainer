import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecursos } from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function Personais() {
  const navigate = useNavigate();
  const [personais, setPersonais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getRecursos('?ativo=true');
      if (!res.ok) { setErro('Erro ao carregar.'); return; }
      const data = await res.json();
      setPersonais(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      <h1>Personais</h1>
      {personais.length === 0 ? (
        <p>Nenhum personal cadastrado.</p>
      ) : (
        personais.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/personais/${p.id}`)}
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

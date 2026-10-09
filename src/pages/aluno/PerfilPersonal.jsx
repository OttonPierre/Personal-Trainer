import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecurso, getAvaliacoes } from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function PerfilPersonal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personal, setPersonal] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [temMais, setTemMais] = useState(false);
  const [pagina, setPagina] = useState(1);

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const [resP, resA] = await Promise.all([
        getRecurso(id),
        getAvaliacoes(`?recurso=${id}&page=1`),
      ]);
      if (!resP.ok) { setErro('Personal não encontrado.'); return; }
      setPersonal(await resP.json());
      const da = await resA.json();
      setAvaliacoes(da.results || da);
      setTemMais(!!da.next);
      setPagina(1);
    } finally {
      setLoading(false);
    }
  }

  async function carregarMais() {
    const prox = pagina + 1;
    const res = await getAvaliacoes(`?recurso=${id}&page=${prox}`);
    const data = await res.json();
    setAvaliacoes((prev) => [...prev, ...(data.results || data)]);
    setTemMais(!!data.next);
    setPagina(prox);
  }

  useEffect(() => { carregar(); }, [id]);

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;
  if (!personal) return null;

  return (
    <div>
      {personal.foto && <img src={personal.foto} alt={personal.nome} width={100} />}
      <h1>{personal.nome}</h1>
      <p>{personal.bio}</p>
      <button type="button" onClick={() => navigate('/agendar', { state: { personal } })}>
        Agendar com este personal
      </button>
      <h2>Avaliações</h2>
      {avaliacoes.length === 0 ? (
        <p>Ainda sem avaliações.</p>
      ) : (
        avaliacoes.map((av) => (
          <div key={av.id} style={{ borderBottom: '1px solid #eee', marginBottom: 8 }}>
            <p>{'★'.repeat(av.nota)}{'☆'.repeat(5 - av.nota)}</p>
            {av.comentario && <p>{av.comentario}</p>}
            <p><small>{av.usuario_nome} — {av.servico_nome}</small></p>
          </div>
        ))
      )}
      {temMais && <button type="button" onClick={carregarMais}>Carregar mais</button>}
    </div>
  );
}

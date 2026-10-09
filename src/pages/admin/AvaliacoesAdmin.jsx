import { useState, useEffect } from 'react';
import { getAvaliacoes, getRecursos } from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function AvaliacoesAdmin() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [personais, setPersonais] = useState([]);
  const [filtroPersonal, setFiltroPersonal] = useState('');
  const [filtroNota, setFiltroNota] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);

  useEffect(() => {
    getRecursos().then(async (res) => {
      if (res.ok) {
        const d = await res.json();
        setPersonais(d.results || d);
      }
    });
  }, []);

  async function carregar(pag = 1) {
    setLoading(true);
    setErro('');
    try {
      let params = `?page=${pag}`;
      if (filtroPersonal) params += `&recurso=${filtroPersonal}`;
      if (filtroNota) params += `&nota=${filtroNota}`;
      const res = await getAvaliacoes(params);
      if (!res.ok) { setErro('Erro ao carregar avaliações.'); return; }
      const data = await res.json();
      const lista = data.results || data;
      setAvaliacoes(pag === 1 ? lista : (prev) => [...prev, ...lista]);
      setTemMais(!!data.next);
      setPagina(pag);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(1); }, [filtroPersonal, filtroNota]);

  return (
    <div>
      <h1>Avaliações</h1>
      <div>
        <select value={filtroPersonal} onChange={(e) => setFiltroPersonal(e.target.value)}>
          <option value="">Todos os personais</option>
          {personais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <select value={filtroNota} onChange={(e) => setFiltroNota(e.target.value)}>
          <option value="">Todas as notas</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      {loading && pagina === 1 && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={() => carregar(1)} />}
      {!loading && !erro && avaliacoes.length === 0 && <p>Ainda sem avaliações.</p>}
      {avaliacoes.map((av) => (
        <div key={av.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <p>{'★'.repeat(av.nota)}{'☆'.repeat(5 - av.nota)}</p>
          {av.comentario && <p>{av.comentario}</p>}
          <p><small>Personal: {av.recurso_nome} | Serviço: {av.servico_nome} | Aluno: {av.usuario_nome}</small></p>
        </div>
      ))}
      {temMais && (
        <button type="button" onClick={() => carregar(pagina + 1)} disabled={loading}>
          Carregar mais
        </button>
      )}
    </div>
  );
}

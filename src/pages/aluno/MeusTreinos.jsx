import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgendamentos } from '../../api/endpoints';
import { dataHoje, dataOntem, formatarData, formatarHora, LABEL_STATUS } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function MeusTreinos() {
  const navigate = useNavigate();
  const [aba, setAba] = useState('proximos');
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);

  async function carregar(pag = 1) {
    setLoading(true);
    setErro('');
    try {
      let params;
      if (aba === 'proximos') {
        params = `?data_inicio=${dataHoje()}&page=${pag}`;
      } else {
        params = `?data_fim=${dataOntem()}&ordering=-inicio&page=${pag}`;
      }
      const res = await getAgendamentos(params);
      if (!res.ok) { setErro('Erro ao carregar treinos.'); return; }
      const data = await res.json();
      const lista = data.results || data;
      setItens(pag === 1 ? lista : (prev) => [...prev, ...lista]);
      setTemMais(!!data.next);
      setPagina(pag);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(1); }, [aba]);

  return (
    <div>
      <h1>Meus treinos</h1>
      <div>
        <button onClick={() => setAba('proximos')} disabled={aba === 'proximos'}>Próximos</button>
        <button onClick={() => setAba('historico')} disabled={aba === 'historico'}>Histórico</button>
      </div>
      {loading && pagina === 1 && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={() => carregar(1)} />}
      {!loading && !erro && itens.length === 0 && <p>Nenhum treino aqui.</p>}
      {itens.map((t) => (
        <div
          key={t.id}
          onClick={() => navigate(`/treinos/${t.id}`)}
          style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
        >
          <p><strong>{t.servico_nome}</strong></p>
          <p>{t.recurso_nome}</p>
          <p>{formatarData(t.inicio)} às {formatarHora(t.inicio)}</p>
          <p>Status: {LABEL_STATUS[t.status]}</p>
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

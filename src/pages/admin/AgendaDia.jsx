import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgendamentos, getRecursos } from '../../api/endpoints';
import { dataHoje, formatarHora, LABEL_STATUS } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function AgendaDia() {
  const navigate = useNavigate();
  const [dia, setDia] = useState(dataHoje());
  const [personais, setPersonais] = useState([]);
  const [filtroPersonal, setFiltroPersonal] = useState('');
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    getRecursos().then(async (res) => {
      if (res.ok) {
        const d = await res.json();
        setPersonais(d.results || d);
      }
    });
  }, []);

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      let params = `?data_inicio=${dia}&data_fim=${dia}`;
      if (filtroPersonal) params += `&recurso=${filtroPersonal}`;
      // Carregar todas as páginas
      let todos = [];
      let url = params;
      while (url) {
        const res = await getAgendamentos(url);
        if (!res.ok) { setErro('Erro ao carregar agenda.'); return; }
        const data = await res.json();
        todos = [...todos, ...(data.results || data)];
        url = data.next ? `?${data.next.split('?')[1]}` : null;
      }
      setTreinos(todos.sort((a, b) => a.inicio.localeCompare(b.inicio)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [dia, filtroPersonal]);

  return (
    <div>
      <h1>Agenda do dia</h1>
      <div>
        <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
        <select value={filtroPersonal} onChange={(e) => setFiltroPersonal(e.target.value)}>
          <option value="">Todos os personais</option>
          {personais.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>
      {loading && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={carregar} />}
      {!loading && !erro && treinos.length === 0 && <p>Nenhum treino neste dia.</p>}
      {treinos.map((t) => (
        <div
          key={t.id}
          onClick={() => navigate(`/admin/treinos/${t.id}`)}
          style={{ cursor: 'pointer', border: '1px solid #ccc', margin: 8, padding: 8 }}
        >
          <p><strong>{formatarHora(t.inicio)}</strong> — {t.servico_nome}</p>
          <p>Personal: {t.recurso_nome}</p>
          <p>Aluno: {t.usuario_nome}</p>
          {t.observacoes && <p>Obs: {t.observacoes}</p>}
          <p>Status: {LABEL_STATUS[t.status]}</p>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDisponibilidades,
  postDisponibilidade,
  patchDisponibilidade,
  deleteDisponibilidade,
} from '../../api/endpoints';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function HorariosPersonal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [novaDisp, setNovaDisp] = useState({ dia_semana: 0, inicio: '06:00', fim: '12:00' });
  const [erroForm, setErroForm] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getDisponibilidades(id);
      if (!res.ok) { setErro('Erro ao carregar horários.'); return; }
      const data = await res.json();
      setDisponibilidades(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [id]);

  async function handleAdd(e) {
    e.preventDefault();
    setErroForm('');
    const res = await postDisponibilidade({ ...novaDisp, recurso: id });
    if (!res.ok) {
      const data = await res.json();
      setErroForm(data.detail || JSON.stringify(data));
      return;
    }
    carregar();
  }

  async function handleDelete(dispId) {
    if (!confirm('Remover este horário?')) return;
    await deleteDisponibilidade(dispId);
    carregar();
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  const porDia = {};
  disponibilidades.forEach((d) => {
    if (!porDia[d.dia_semana]) porDia[d.dia_semana] = [];
    porDia[d.dia_semana].push(d);
  });

  return (
    <div>
      <h1>Horários do personal</h1>
      {disponibilidades.length === 0 && (
        <p>Sem horários: ninguém consegue agendar.</p>
      )}
      {DIAS.map((dia, idx) => (
        <div key={idx}>
          <strong>{dia}</strong>
          {(porDia[idx] || []).map((d) => (
            <div key={d.id}>
              <span>{d.inicio} – {d.fim}</span>
              <button type="button" onClick={() => handleDelete(d.id)}>Remover</button>
            </div>
          ))}
        </div>
      ))}
      <h2>Adicionar horário</h2>
      <form onSubmit={handleAdd}>
        <select value={novaDisp.dia_semana} onChange={(e) => setNovaDisp({ ...novaDisp, dia_semana: Number(e.target.value) })}>
          {DIAS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
        <input type="time" value={novaDisp.inicio} onChange={(e) => setNovaDisp({ ...novaDisp, inicio: e.target.value })} />
        <input type="time" value={novaDisp.fim} onChange={(e) => setNovaDisp({ ...novaDisp, fim: e.target.value })} />
        {erroForm && <span>{erroForm}</span>}
        <button type="submit">Adicionar</button>
      </form>
      <button type="button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}

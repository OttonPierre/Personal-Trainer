import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHorariosLivres } from '../../api/endpoints';
import { dataHoje, formatarHora } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function EscolherHorario() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { servico, personal } = state || {};
  const [data, setData] = useState(dataHoje());
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      let params = `servico=${servico?.id}&data=${data}`;
      if (personal?.id) params += `&recurso=${personal.id}`;
      const res = await getHorariosLivres(params);
      if (!res.ok) { setErro('Erro ao carregar horários.'); return; }
      const d = await res.json();
      setHorarios(d.results || d);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (servico) carregar(); }, [data, servico]);

  function escolher(horario) {
    navigate('/agendar/confirmar', { state: { servico, personal: horario.recurso_obj || personal, horario } });
  }

  // Agrupar por recurso
  const grupos = {};
  horarios.forEach((h) => {
    const nome = h.recurso_nome || 'Personal';
    if (!grupos[nome]) grupos[nome] = [];
    grupos[nome].push(h);
  });

  if (!servico) return <p>Serviço não selecionado. <button onClick={() => navigate('/agendar')}>Voltar</button></p>;

  return (
    <div>
      <h1>Escolher data e horário</h1>
      <div>
        <label>Data</label>
        <input type="date" value={data} min={dataHoje()} onChange={(e) => setData(e.target.value)} />
      </div>
      {loading && <Loading />}
      {erro && <ErrorMsg message={erro} onRetry={carregar} />}
      {!loading && !erro && (
        Object.keys(grupos).length === 0 ? (
          <p>Sem horários livres neste dia. Tente outra data.</p>
        ) : (
          Object.entries(grupos).map(([nome, slots]) => (
            <div key={nome}>
              <h3>{nome}</h3>
              {slots.map((h) => (
                <button key={h.inicio} type="button" onClick={() => escolher(h)}>
                  {formatarHora(h.inicio)}
                </button>
              ))}
            </div>
          ))
        )
      )}
    </div>
  );
}

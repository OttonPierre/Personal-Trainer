import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizacao, getAgendamentos } from '../../api/endpoints';
import { dataHoje, formatarData, formatarHora, LABEL_STATUS } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function Inicio() {
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [proximoTreino, setProximoTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const [resOrg, resTreinos] = await Promise.all([
        getOrganizacao(),
        getAgendamentos(`?data_inicio=${dataHoje()}`),
      ]);
      if (!resOrg.ok || !resTreinos.ok) { setErro('Erro ao carregar.'); return; }
      const dataOrg = await resOrg.json();
      const dataTreinos = await resTreinos.json();
      setOrg(dataOrg);
      const ativos = (dataTreinos.results || dataTreinos).filter(
        (t) => t.status === 'solicitado' || t.status === 'confirmado'
      );
      setProximoTreino(ativos[0] || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      {org?.logo && <img src={org.logo} alt="Logo" width={120} />}
      <h1>{org?.nome || 'Personal Trainer'}</h1>

      {proximoTreino ? (
        <div onClick={() => navigate(`/treinos/${proximoTreino.id}`)} style={{ cursor: 'pointer' }}>
          <h2>Próximo treino</h2>
          <p>{proximoTreino.servico_nome}</p>
          <p>{formatarData(proximoTreino.inicio)} às {formatarHora(proximoTreino.inicio)}</p>
          <p>Status: {LABEL_STATUS[proximoTreino.status]}</p>
        </div>
      ) : (
        <p>Você não tem treinos agendados.</p>
      )}

      <button type="button" onClick={() => navigate('/agendar')}>Agendar</button>
    </div>
  );
}

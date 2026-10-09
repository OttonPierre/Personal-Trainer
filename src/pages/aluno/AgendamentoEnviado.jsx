import { useNavigate, useLocation } from 'react-router-dom';
import { formatarData, formatarHora, LABEL_STATUS } from '../../utils/helpers';

export default function AgendamentoEnviado() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ag = state?.agendamento;

  if (!ag) return <p>Sem dados. <button onClick={() => navigate('/inicio')}>Início</button></p>;

  return (
    <div>
      <h1>Agendamento enviado!</h1>
      <p>Seu pedido foi registrado. O administrador vai confirmar em breve.</p>
      <p><strong>Serviço:</strong> {ag.servico_nome}</p>
      <p><strong>Personal:</strong> {ag.recurso_nome}</p>
      <p><strong>Data:</strong> {formatarData(ag.inicio)}</p>
      <p><strong>Horário:</strong> {formatarHora(ag.inicio)}</p>
      <p><strong>Status:</strong> {LABEL_STATUS[ag.status]}</p>
      <button type="button" onClick={() => navigate(`/treinos/${ag.id}`)}>Ver treino</button>
      <button type="button" onClick={() => navigate('/inicio')}>Início</button>
    </div>
  );
}

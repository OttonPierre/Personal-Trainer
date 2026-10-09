import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgendamento, cancelarAgendamento } from '../../api/endpoints';
import { formatarData, formatarHora, formatarDuracao, LABEL_STATUS } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function DetalheTreino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { temPermissao } = useAuth();
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [cancelando, setCancelando] = useState(false);

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getAgendamento(id);
      if (res.status === 404) { navigate('/meus-treinos'); return; }
      if (!res.ok) { setErro('Erro ao carregar treino.'); return; }
      setTreino(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [id]);

  async function handleCancelar() {
    if (!confirm('Deseja cancelar este treino?')) return;
    setCancelando(true);
    const res = await cancelarAgendamento(id);
    setCancelando(false);
    if (res.ok) {
      carregar();
    } else {
      const data = await res.json();
      setErro(data.detail || 'Não foi possível cancelar.');
    }
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;
  if (!treino) return null;

  const podeCancelar =
    temPermissao('api.cancelar_agendamento') &&
    (treino.status === 'solicitado' || treino.status === 'confirmado');
  const podeAvaliar =
    temPermissao('api.avaliar_agendamento') &&
    treino.status === 'concluido' &&
    !treino.nota;

  return (
    <div>
      <h1>Detalhe do treino</h1>
      <p><strong>Serviço:</strong> {treino.servico_nome}</p>
      <p><strong>Personal:</strong> {treino.recurso_nome}</p>
      <p><strong>Data:</strong> {formatarData(treino.inicio)}</p>
      <p><strong>Horário:</strong> {formatarHora(treino.inicio)}</p>
      <p><strong>Duração:</strong> {formatarDuracao(treino.duracao)}</p>
      <p><strong>Status:</strong> {LABEL_STATUS[treino.status]}</p>
      {treino.observacoes && <p><strong>Observações:</strong> {treino.observacoes}</p>}
      {treino.nota && (
        <div>
          <p><strong>Avaliação:</strong> {treino.nota}/5</p>
          {treino.comentario && <p>{treino.comentario}</p>}
        </div>
      )}
      {podeCancelar && (
        <button type="button" onClick={handleCancelar} disabled={cancelando}>
          {cancelando ? 'Cancelando...' : 'Cancelar'}
        </button>
      )}
      {podeAvaliar && (
        <button type="button" onClick={() => navigate(`/treinos/${id}/avaliar`)}>
          Avaliar
        </button>
      )}
      <button type="button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}

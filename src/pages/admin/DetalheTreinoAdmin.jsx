import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgendamento, confirmarAgendamento, concluirAgendamento, cancelarAgendamento } from '../../api/endpoints';
import { formatarData, formatarHora, formatarDuracao, LABEL_STATUS } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function DetalheTreinoAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { temPermissao } = useAuth();
  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [acao, setAcao] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getAgendamento(id);
      if (res.status === 404) { navigate('/admin/agenda'); return; }
      if (!res.ok) { setErro('Erro ao carregar treino.'); return; }
      setTreino(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [id]);

  async function executarAcao(fn, label) {
    if (!confirm(`${label} este agendamento?`)) return;
    setAcao(label);
    const res = await fn(id);
    setAcao('');
    if (res.ok) {
      carregar();
    } else {
      const data = await res.json();
      setErro(data.detail || `Erro ao ${label.toLowerCase()}.`);
    }
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;
  if (!treino) return null;

  const podeConfirmar = temPermissao('api.confirmar_agendamento') && treino.status === 'solicitado';
  const podeConcluir = temPermissao('api.concluir_agendamento') && treino.status === 'confirmado';
  const podeCancelar = temPermissao('api.cancelar_agendamento') && (treino.status === 'solicitado' || treino.status === 'confirmado');

  return (
    <div>
      <h1>Detalhe do treino</h1>
      <p><strong>Aluno:</strong> {treino.usuario_nome}</p>
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
      <div>
        {podeConfirmar && (
          <button disabled={!!acao} onClick={() => executarAcao(confirmarAgendamento, 'Confirmar')}>
            {acao === 'Confirmar' ? 'Confirmando...' : 'Confirmar'}
          </button>
        )}
        {podeConcluir && (
          <button disabled={!!acao} onClick={() => executarAcao(concluirAgendamento, 'Concluir')}>
            {acao === 'Concluir' ? 'Concluindo...' : 'Concluir'}
          </button>
        )}
        {podeCancelar && (
          <button disabled={!!acao} onClick={() => executarAcao(cancelarAgendamento, 'Cancelar')}>
            {acao === 'Cancelar' ? 'Cancelando...' : 'Cancelar'}
          </button>
        )}
      </div>
      <button type="button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}

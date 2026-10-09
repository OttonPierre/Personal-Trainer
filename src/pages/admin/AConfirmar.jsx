import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgendamentos, confirmarAgendamento, cancelarAgendamento } from '../../api/endpoints';
import { formatarData, formatarHora, LABEL_STATUS } from '../../utils/helpers';
import Loading from '../../components/Loading';
import ErrorMsg from '../../components/ErrorMsg';

export default function AConfirmar() {
  const navigate = useNavigate();
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setLoading(true);
    setErro('');
    try {
      const res = await getAgendamentos('?status=solicitado');
      if (!res.ok) { setErro('Erro ao carregar pedidos.'); return; }
      const data = await res.json();
      setTreinos(data.results || data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleConfirmar(id) {
    await confirmarAgendamento(id);
    carregar();
  }

  async function handleCancelar(id) {
    if (!confirm('Cancelar este agendamento?')) return;
    await cancelarAgendamento(id);
    carregar();
  }

  if (loading) return <Loading />;
  if (erro) return <ErrorMsg message={erro} onRetry={carregar} />;

  return (
    <div>
      <h1>A confirmar</h1>
      {treinos.length === 0 ? (
        <p>Nenhum pedido para confirmar.</p>
      ) : (
        treinos.map((t) => (
          <div key={t.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
            <p
              onClick={() => navigate(`/admin/treinos/${t.id}`)}
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              {t.servico_nome} — {t.recurso_nome}
            </p>
            <p>{formatarData(t.inicio)} às {formatarHora(t.inicio)}</p>
            <p>Aluno: {t.usuario_nome}</p>
            <button type="button" onClick={() => handleConfirmar(t.id)}>Confirmar</button>
            <button type="button" onClick={() => handleCancelar(t.id)}>Cancelar</button>
          </div>
        ))
      )}
    </div>
  );
}

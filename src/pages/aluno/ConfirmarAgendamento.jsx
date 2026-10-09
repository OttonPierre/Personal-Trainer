import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { postAgendamento } from '../../api/endpoints';
import { formatarData, formatarHora, formatarPreco, formatarDuracao, parseErrors } from '../../utils/helpers';

export default function ConfirmarAgendamento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { servico, personal, horario } = state || {};
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await postAgendamento({
        servico: servico?.id,
        recurso: personal?.id || horario?.recurso,
        inicio: horario?.inicio,
        observacoes,
      });
      const data = await res.json();
      if (!res.ok) {
        const erros = parseErrors(data);
        setErro(erros.inicio || erros._geral || 'Erro ao agendar.');
        if (erros.inicio) navigate(-1);
        return;
      }
      navigate('/agendar/enviado', { state: { agendamento: data } });
    } finally {
      setLoading(false);
    }
  }

  if (!servico || !horario) return <p>Dados incompletos. <button onClick={() => navigate('/agendar')}>Voltar</button></p>;

  return (
    <div>
      <h1>Confirmar agendamento</h1>
      <p><strong>Serviço:</strong> {servico.nome}</p>
      <p><strong>Personal:</strong> {personal?.nome || 'Qualquer'}</p>
      <p><strong>Data:</strong> {formatarData(horario.inicio)}</p>
      <p><strong>Horário:</strong> {formatarHora(horario.inicio)}</p>
      <p><strong>Duração:</strong> {formatarDuracao(servico.duracao)}</p>
      <p><strong>Preço:</strong> {formatarPreco(servico.preco)}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex.: foco em pernas, tenho dor no joelho direito"
          />
        </div>
        {erro && <p>{erro}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Confirmar'}</button>
        <button type="button" onClick={() => navigate(-1)}>Voltar</button>
      </form>
    </div>
  );
}

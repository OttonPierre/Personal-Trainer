import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { avaliarAgendamento } from '../../api/endpoints';
import { parseErrors } from '../../utils/helpers';

export default function AvaliarTreino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErros({});
    setLoading(true);
    try {
      const res = await avaliarAgendamento(id, { nota, comentario });
      const data = await res.json();
      if (!res.ok) {
        setErros(parseErrors(data));
        return;
      }
      navigate(`/treinos/${id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Avaliar treino</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nota (1 a 5)</label>
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNota(n)}
                style={{ fontWeight: nota === n ? 'bold' : 'normal' }}
              >
                {'★'.repeat(n)}{'☆'.repeat(5 - n)}
              </button>
            ))}
          </div>
          {erros.nota && <span>{erros.nota}</span>}
        </div>
        <div>
          <label>Comentário</label>
          <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} />
          {erros.comentario && <span>{erros.comentario}</span>}
        </div>
        {erros._geral && <p>{erros._geral}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
        <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}

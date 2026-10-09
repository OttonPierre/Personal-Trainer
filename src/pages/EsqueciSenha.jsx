import { useState } from 'react';
import { Link } from 'react-router-dom';
import { redefinirSenha } from '../api/endpoints';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await redefinirSenha({ email, organizacao: 'personal-trainer' });
      if (res.status === 429) {
        setErro('Muitas tentativas, aguarde um minuto.');
        return;
      }
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <div>
        <p>Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.</p>
        <Link to="/login">Voltar ao login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Esqueci minha senha</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {erro && <p>{erro}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>
      <Link to="/login">Voltar ao login</Link>
    </div>
  );
}

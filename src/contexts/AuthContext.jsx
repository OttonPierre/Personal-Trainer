import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getEu } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [loading, setLoading] = useState(true); // Novo estado

  const carregarUsuario = useCallback(async () => {
    try {
      const res = await getEu();
      if (res && res.ok) {
        const data = await res.json();
        setUser(data);
        setPermissoes(data.permissoes || []);
        return data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Finaliza o loading independentemente de sucesso ou erro
    }
    return null;
  }, []);

  // Carrega o usuário no primeiro acesso se houver token
  useEffect(() => {
    if (localStorage.getItem('access')) {
      carregarUsuario();
    } else {
      setLoading(false);
    }
  }, [carregarUsuario]);

  const logout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    setPermissoes([]);
  }, []);

  const temPermissao = useCallback(
    (perm) => permissoes.includes(perm),
    [permissoes]
  );

  const isAdmin = temPermissao('api.change_organizacao');

  return (
    <AuthContext.Provider
      // Exponha o loading no provider
      value={{ user, setUser, permissoes, carregarUsuario, logout, temPermissao, isAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
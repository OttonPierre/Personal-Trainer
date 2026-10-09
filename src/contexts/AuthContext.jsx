import { createContext, useContext, useState, useCallback } from 'react';
import { getEu } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);

  const carregarUsuario = useCallback(async () => {
    const res = await getEu();
    if (res && res.ok) {
      const data = await res.json();
      setUser(data);
      setPermissoes(data.permissoes || []);
      return data;
    }
    return null;
  }, []);

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
      value={{ user, setUser, permissoes, carregarUsuario, logout, temPermissao, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

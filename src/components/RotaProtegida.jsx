import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RotaProtegida({ children, admin = false }) {
  const { user, isAdmin } = useAuth();

  if (!localStorage.getItem('access')) {
    return <Navigate to="/login" replace />;
  }

  if (admin && !isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

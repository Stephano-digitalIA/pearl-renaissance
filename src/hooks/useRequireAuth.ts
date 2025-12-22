import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/auth.types';

interface UseRequireAuthOptions {
  redirectTo?: string;
  requiredRole?: AppRole;
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectTo = '/login', requiredRole } = options;
  const { user, loading, initialized, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized || loading) return;

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de login
    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Si un rôle est requis et que l'utilisateur ne l'a pas
    if (requiredRole && !hasRole(requiredRole)) {
      navigate('/', { replace: true });
    }
  }, [user, loading, initialized, navigate, redirectTo, requiredRole, hasRole]);

  return { user, loading, initialized };
};

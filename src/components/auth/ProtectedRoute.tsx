import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/auth.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, loading, initialized, hasRole } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant l'initialisation
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Rediriger vers login si non connecté
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

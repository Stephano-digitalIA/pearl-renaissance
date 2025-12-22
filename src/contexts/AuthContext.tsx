import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import {
  AuthContextType,
  AuthUser,
  AppRole,
  SignUpCredentials,
  SignInCredentials,
} from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | undefined>(undefined);

  // Récupérer le rôle de l'utilisateur
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du rôle:', error);
        return undefined;
      }

      return data?.role as AppRole;
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error);
      return undefined;
    }
  }, []);

  // Initialiser la session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          setUser({ ...currentSession.user, role });
          setUserRole(role);
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          setUser({ ...currentSession.user, role });
          setUserRole(role);
          setSession(currentSession);
        } else {
          setUser(null);
          setUserRole(undefined);
          setSession(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  // Inscription
  const signUp = async ({ email, password, fullName }: SignUpCredentials) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(undefined);
      setSession(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Mise à jour du mot de passe
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = useCallback((role: AppRole): boolean => {
    return userRole === role;
  }, [userRole]);

  // Vérifier si l'utilisateur est admin
  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initialized,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        hasRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

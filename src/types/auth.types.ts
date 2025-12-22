import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export type AppRole = Database['public']['Enums']['app_role'];

export interface AuthUser extends User {
  role?: AppRole;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  signUp: (credentials: SignUpCredentials) => Promise<{ error: Error | null }>;
  signIn: (credentials: SignInCredentials) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
}

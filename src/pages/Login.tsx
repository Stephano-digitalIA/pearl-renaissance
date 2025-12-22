import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth';
import Navbar from '@/components/oceane/Navbar';
import Footer from '@/components/oceane/Footer';

const Login = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer la page d'origine si redirection depuis ProtectedRoute
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    // Rediriger si déjà connecté
    if (initialized && user) {
      navigate(from, { replace: true });
    }
  }, [user, initialized, navigate, from]);

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={0} setIsCartOpen={() => {}} />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md">
          <LoginForm onSuccess={handleSuccess} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

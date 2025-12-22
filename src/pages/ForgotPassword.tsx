import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ForgotPasswordForm } from '@/components/auth';
import Navbar from '@/components/oceane/Navbar';
import Footer from '@/components/oceane/Footer';

const ForgotPassword = () => {
  const { user, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger si déjà connecté
    if (initialized && user) {
      navigate('/', { replace: true });
    }
  }, [user, initialized, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={0} setIsCartOpen={() => {}} />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;

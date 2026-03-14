import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';

export function Login() {
  const { signInWithGoogle, user, deviceError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    if (deviceError) {
      setError(deviceError);
    }
  }, [deviceError]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('unauthorized-domain');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(t('login.error.cancelled'));
      } else {
        setError(t('login.error'));
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center backdrop-blur-sm"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{t('login.title')}</h1>
        <p className="text-gray-400 mb-8">{t('login.subtitle')}</p>

        {error === 'unauthorized-domain' ? (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-4 text-sm text-left border border-red-500/30">
            <p className="font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Domain Not Authorized
            </p>
            <p className="mb-3 opacity-90">This domain is not allowed to sign in. You must add it to your Firebase project settings.</p>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1 uppercase tracking-wider opacity-60">1. Copy this domain:</p>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded border border-white/10">
                  <code className="flex-1 overflow-hidden text-ellipsis font-mono text-xs">{window.location.hostname}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(window.location.hostname)}
                    className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-1 uppercase tracking-wider opacity-60">2. Add to Firebase Console:</p>
                <a 
                  href="https://console.firebase.google.com/project/waslny1git-73803955-45f9e/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors text-xs"
                >
                  Open Firebase Settings
                </a>
              </div>
            </div>
            
            <p className="mt-4 text-[10px] leading-tight opacity-50 italic">
              After adding the domain, wait 10 seconds and refresh this page.
            </p>
          </div>
        ) : error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {t('login.btn.google')}
        </button>
      </motion.div>
    </div>
  );
}

import { useEffect } from 'react';
import { useCloudDeckStore } from './store/useCloudDeckStore';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import StellarBackground from './components/ui/StellarBackground';
import { AnimatePresence, motion } from 'motion/react';
import api from './lib/api';

export default function App() {
  const credentials = useCloudDeckStore((state) => state.credentials);
  const setAiEnabled = useCloudDeckStore((state) => state.setAiEnabled);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/api/config');
        setAiEnabled(response.data.aiEnabled);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <StellarBackground />
      
      <AnimatePresence mode="wait">
        {credentials ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            <Dashboard />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <LoginScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            fontSize: '14px',
            fontWeight: '600',
          }
        }}
      />
    </div>
  );
}

import { useCloudDeckStore } from './store/useCloudDeckStore';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const credentials = useCloudDeckStore((state) => state.credentials);

  return (
    <div className="min-h-screen">
      {credentials ? <Dashboard /> : <LoginScreen />}
      <Toaster position="bottom-right" />
    </div>
  );
}

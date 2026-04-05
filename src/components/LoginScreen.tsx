import React, { useState } from 'react';
import { useCloudDeckStore } from '../store/useCloudDeckStore';
import { Cloud, Key, Lock, ShieldCheck, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { cn } from '../lib/utils';
import Button from './ui/Button';
import Input from './ui/Input';
import GlassCard from './ui/GlassCard';

export default function LoginScreen() {
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCredentials } = useCloudDeckStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get('/api/validate', {
        headers: {
          'x-cloud-name': cloudName,
          'x-api-key': apiKey,
          'x-api-secret': apiSecret,
        },
      });

      if (response.data.status === 'ok') {
        setCredentials({ cloudName, apiKey, apiSecret });
        toast.success('System Linked Successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
              <Cloud className="text-white w-10 h-10" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter">CloudDeck</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-white/90 leading-tight">
              Command your <span className="text-primary italic">media universe</span> with surgical precision.
            </h2>
            <p className="text-xl text-white/40 font-medium leading-relaxed max-w-md">
              The high-performance dashboard for your Cloudinary assets. Fast, secure, and beautiful.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: ShieldCheck, text: "End-to-end encrypted sessions" },
              { icon: Lock, text: "Zero-knowledge secret handling" },
              { icon: Sparkles, text: "AI-powered asset intelligence" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-white/60"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm uppercase tracking-widest">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="pt-8">
             <a 
              href="https://cloudinary.com/documentation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors font-bold group"
            >
               Read the Documentation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <GlassCard className="max-w-md mx-auto" glow>
            <div className="flex flex-col items-center mb-10 lg:hidden">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4">
                  <Cloud className="text-white w-6 h-6" />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tighter">CloudDeck</h1>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-2xl font-black text-white tracking-tight">System Link</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Initialize your secure session</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Cloud Name"
                icon={<Cloud className="w-5 h-5" />}
                required
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="e.g. demo-cloud"
              />

              <Input
                label="API Key"
                icon={<Key className="w-5 h-5" />}
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Public Key"
              />

              <Input
                label="API Secret"
                type="password"
                icon={<Lock className="w-5 h-5" />}
                required
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="••••••••••••••••"
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full py-4 text-lg"
                  variant="primary"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Connect Securely
                </Button>
              </div>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                  <Lock className="w-3 h-3" />
                  <span>Session Persists in Browser Memory</span>
               </div>
               <div className="h-[1px] w-full bg-white/5" />
               <p className="text-[10px] font-bold text-white/20 text-center leading-relaxed">
                 By connecting, you agree to the transmission of your credentials to Cloudinary via our secure proxy.
               </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Background Decorative Element for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
    </div>
  );
}

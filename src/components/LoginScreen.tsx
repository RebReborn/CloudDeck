import React, { useState } from 'react';
import { useCloudDeckStore } from '../store/useCloudDeckStore';
import api from '../lib/api';
import { Cloud, Key, Lock, Loader2, ShieldCheck, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function LoginScreen() {
  const [cloudName, setCloudName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const setCredentials = useCloudDeckStore((state) => state.setCredentials);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tempCreds = { cloudName, apiKey, apiSecret };
      const response = await axios.get('/api/validate', {
        headers: {
          'x-cloud-name': cloudName,
          'x-api-key': apiKey,
          'x-api-secret': apiSecret,
        },
      });

      if (response.data.status === 'ok') {
        setCredentials(tempCreds);
        toast.success('Connected to Cloudinary!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to connect. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30"
          >
            <Cloud className="text-white w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">CloudDeck</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center font-medium">
            The lightweight dashboard for your Cloudinary media.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Cloud Name
            </label>
            <div className="relative group">
              <Cloud className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                required
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                placeholder="e.g. demo-cloud"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              API Key
            </label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                placeholder="Enter your API Key"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              API Secret
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                required
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                placeholder="••••••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-3 mt-8 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Connect Securely</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Lock className="w-3 h-3" />
          <span>End-to-end encrypted session</span>
        </div>
      </motion.div>

      <footer className="mt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <button onClick={() => setShowTerms(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Use</button>
          <a href="https://cloudinary.com/documentation" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Cloudinary Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-600">© 2026 CloudDeck. Built for developers.</p>
      </footer>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTerms(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Terms of Use</h3>
                <button onClick={() => setShowTerms(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto text-slate-600 dark:text-slate-400 space-y-4 text-sm leading-relaxed">
                <p className="font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</p>
                <p>By accessing CloudDeck, you agree to be bound by these terms. CloudDeck is a tool designed to interface with Cloudinary APIs.</p>
                
                <p className="font-semibold text-slate-900 dark:text-white">2. Security & Credentials</p>
                <p>You are solely responsible for the security of your Cloudinary credentials. CloudDeck does not store your API Secret on any server. Credentials are held in temporary session storage within your browser.</p>
                
                <p className="font-semibold text-slate-900 dark:text-white">3. Usage Limits</p>
                <p>Your usage of CloudDeck is subject to your Cloudinary account's plan and limits. We are not responsible for any overages or service interruptions from Cloudinary.</p>
                
                <p className="font-semibold text-slate-900 dark:text-white">4. No Warranty</p>
                <p>CloudDeck is provided "as is" without warranty of any kind. Use at your own risk. We are not affiliated with Cloudinary Ltd.</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button 
                  onClick={() => setShowTerms(false)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

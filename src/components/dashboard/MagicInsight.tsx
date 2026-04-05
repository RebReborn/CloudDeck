import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Loader2, 
  Tag as TagIcon, 
  FileText,
  Zap,
  Info,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';
import Button from '../ui/Button';

interface MagicInsightProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function MagicInsight({ asset, isOpen, onClose }: MagicInsightProps) {
  const aiEnabled = useCloudDeckStore(state => state.aiEnabled);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ description: string; tags: string[] } | null>(null);

  const fetchInsight = async () => {
    if (!asset || !aiEnabled) return;
    setLoading(true);
    try {
      const response = await api.post('/analyze', { 
        url: asset.secure_url,
        resource_type: asset.resource_type 
      });
      setInsight(response.data);
    } catch (error) {
      console.error('Failed to fetch insight:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && asset && !insight) {
      fetchInsight();
    }
  }, [isOpen, asset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-end p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-slate-900/60 backdrop-blur-3xl border-l border-white/10 shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-black text-white tracking-tight">Magic Insight</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                 <X className="w-6 h-6" />
              </Button>
            </div>

            {loading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-white/20">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Gemini is thinking...</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Analyzing visual context</p>
                </div>
              </div>
            ) : insight ? (
              <div className="space-y-8">
                <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-black/20 aspect-video relative group">
                   <img 
                    src={asset.secure_url} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>

                <div className="space-y-6">
                  <section className="space-y-3">
                     <div className="flex items-center gap-2 text-primary">
                        <FileText className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Description</span>
                     </div>
                     <p className="text-white text-lg font-medium leading-relaxed italic">
                        "{insight.description}"
                     </p>
                  </section>

                  <section className="space-y-3">
                     <div className="flex items-center gap-2 text-indigo-400">
                        <TagIcon className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Context Tags</span>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {insight.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-default">
                             #{tag}
                          </span>
                        ))}
                     </div>
                  </section>

                  <section className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-12 h-12 text-primary" />
                     </div>
                     <div className="flex items-center gap-2 text-primary mb-2">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Optimization Hint</span>
                     </div>
                     <p className="text-xs font-bold text-white/50 leading-relaxed">
                        This asset is currently {Math.round(asset.bytes / 1024)}KB. Using Cloudinary 'auto' quality could save up to 40% bandwidth without visual loss.
                     </p>
                  </section>
                </div>

                <Button 
                  onClick={fetchInsight}
                  variant="outline" 
                  className="w-full rounded-2xl py-4"
                >
                   Regenerate Analysis
                </Button>
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-white/20 gap-4">
                 <AlertCircle className="w-12 h-12" />
                 <p className="text-sm font-black uppercase tracking-[0.2em]">Failed to analyze</p>
                 <Button onClick={fetchInsight}>Retry</Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

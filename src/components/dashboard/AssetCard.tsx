import React from 'react';
import { 
  Copy, 
  Download, 
  Edit2, 
  Trash2, 
  ExternalLink,
  MoreVertical,
  Play,
  FileIcon,
  Video,
  ImageIcon,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatBytes } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';

interface AssetCardProps {
  asset: any;
  resourceType: string;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onInsight?: (asset: any) => void;
  viewMode?: 'grid' | 'list';
}

export default function AssetCard({ 
  asset, 
  resourceType, 
  onDelete, 
  onRename,
  onInsight,
  viewMode = 'grid'
}: AssetCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const getThumbnail = (asset: any) => {
    if (asset.resource_type === 'image') {
      return asset.secure_url.replace('/upload/', '/upload/w_400,c_fill,g_auto,q_auto,f_auto/');
    }
    if (asset.resource_type === 'video') {
      return asset.secure_url.replace(/\.[^/.]+$/, '.jpg').replace('/upload/', '/upload/w_400,c_fill,g_auto,q_auto,f_auto/');
    }
    return null;
  };

  const name = asset.public_id.split('/').pop();

  if (viewMode === 'list') {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="group flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/5 transition-all w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center relative group">
          {asset.resource_type === 'image' ? (
            <img src={getThumbnail(asset)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : asset.resource_type === 'video' ? (
             <div className="w-full h-full relative">
                <img src={getThumbnail(asset)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
             </div>
          ) : (
            <FileIcon className="w-5 h-5 text-white/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white truncate">{name}</p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">{formatBytes(asset.bytes)} • {asset.format.toUpperCase()}</p>
        </div>

        <div className="hidden md:block w-32 px-4">
           <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">{asset.width} x {asset.height}</p>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => copyUrl(asset.secure_url)} className="p-2 text-white/40 hover:text-primary transition-colors hover:bg-white/10 rounded-lg"><Copy className="w-4 h-4" /></button>
           <button onClick={() => window.open(asset.secure_url, '_blank')} className="p-2 text-white/40 hover:text-white transition-colors hover:bg-white/10 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
           <button onClick={() => onRename(asset.public_id)} className="p-2 text-white/40 hover:text-white transition-colors hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
           <button onClick={() => onDelete(asset.public_id)} className="p-2 text-white/40 hover:text-destructive transition-colors hover:bg-white/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowMenu(false); }}
      className="group relative flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-slate-950/20">
        {asset.resource_type === 'image' ? (
          <img 
            src={getThumbnail(asset)} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : asset.resource_type === 'video' ? (
          <div className="w-full h-full relative">
            <img 
              src={getThumbnail(asset)} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                 <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950/20">
             <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
                <FileIcon className="w-8 h-8 text-white/40" />
             </div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
           {useCloudDeckStore.getState().aiEnabled && (
             <button 
              onClick={(e) => {
                e.stopPropagation();
                onInsight?.(asset);
              }} 
              className="p-2.5 bg-primary/80 backdrop-blur-md border border-primary/20 rounded-xl text-white shadow-lg shadow-primary/20 hover:bg-primary transition-all"
              title="Magic Insight"
             >
              <Sparkles className="w-4 h-4 shadow-sm" />
             </button>
           )}
           <button onClick={() => onRename(asset.public_id)} className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-white/80 hover:text-white hover:bg-slate-800 transition-all"><Edit2 className="w-4 h-4" /></button>
           <button onClick={() => onDelete(asset.public_id)} className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl text-red-400 hover:text-red-300 hover:bg-slate-800 transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
           <div className="p-2 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-1">
              <button 
                onClick={() => copyUrl(asset.secure_url)} 
                className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-black text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button 
                onClick={() => window.open(asset.secure_url, '_blank')}
                className="flex-1 py-2 flex items-center justify-center gap-2 text-xs font-black text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                <ExternalLink className="w-4 h-4" />
                View
              </button>
           </div>
        </div>
      </div>

      <div className="p-5 space-y-1">
        <p className="text-sm font-black text-white truncate group-hover:text-primary transition-colors" title={name}>
          {name}
        </p>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>{asset.format}</span>
          <span>{formatBytes(asset.bytes)}</span>
        </div>
      </div>
    </motion.div>
  );
}

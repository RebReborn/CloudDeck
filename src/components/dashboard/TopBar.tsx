import React from 'react';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Upload, 
  Bell, 
  User, 
  Settings,
  Sparkles,
  Command
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface TopBarProps {
  onUploadClick: () => void;
}

export default function TopBar({ onUploadClick }: TopBarProps) {
  const { 
    searchQuery, setSearchQuery, 
    viewMode, setViewMode,
    credentials 
  } = useCloudDeckStore();

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-slate-950/20 backdrop-blur-md border-b border-white/5 relative z-10 w-full shrink-0">
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/5 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-white/20 font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-xl transition-all relative", 
              viewMode === 'grid' ? "text-primary" : "text-white/30 hover:text-white hover:bg-white/5"
            )}
          >
            {viewMode === 'grid' && (
              <motion.div layoutId="view-pill" className="absolute inset-0 bg-white/10 rounded-xl" />
            )}
            <LayoutGrid className="w-5 h-5 relative z-10" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-xl transition-all relative", 
              viewMode === 'list' ? "text-primary" : "text-white/30 hover:text-white hover:bg-white/5"
            )}
          >
            {viewMode === 'list' && (
              <motion.div layoutId="view-pill" className="absolute inset-0 bg-white/10 rounded-xl" />
            )}
            <List className="w-5 h-5 relative z-10" />
          </button>
        </div>

        <div className="flex items-center gap-2">
           <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/30 hover:text-white"
          >
            <Bell className="w-5 h-5" />
          </Button>
           <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/30 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-8 w-[1px] bg-white/10" />

        <Button 
          onClick={onUploadClick}
          variant="primary"
          className="rounded-2xl px-6"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-white leading-none mb-1">{credentials?.cloudName}</p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Pro Plan</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 p-[2px] shadow-lg">
            <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

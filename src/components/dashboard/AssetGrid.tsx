import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';
import { 
  ImageIcon, 
  Loader2, 
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import AssetCard from './AssetCard';
import { cn } from '../../lib/utils';

interface AssetGridProps {
  isLoading: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onInsight: (asset: any) => void;
}

export default function AssetGrid({ isLoading, onDelete, onRename, onInsight }: AssetGridProps) {
  const { 
    assets, 
    viewMode, 
    searchQuery, 
    currentFolder, 
    setCurrentFolder 
  } = useCloudDeckStore();

  const filteredAssets = assets.filter(asset => 
    asset.public_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/20 gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Syncing Library...</p>
      </div>
    );
  }

  if (filteredAssets.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white/20 gap-8">
        <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center relative group">
          <ImageIcon className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
           <div className="absolute inset-0 blur-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white px-2">No assets found</h3>
          <p className="text-sm font-bold uppercase tracking-widest">Upload your first media file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-12">
      {/* Breadcrumbs */}
      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-8 w-fit shadow-xl backdrop-blur-md">
        <button 
           onClick={() => setCurrentFolder('')} 
           className="hover:text-primary transition-colors flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" /> Root
        </button>
        {currentFolder.split('/').filter(Boolean).map((part, i, arr) => (
          <React.Fragment key={part}>
            <ChevronRight className="w-3 h-3 text-white/10" />
            <button 
              onClick={() => setCurrentFolder(arr.slice(0, i + 1).join('/'))}
              className="hover:text-primary transition-colors"
            >
              {part}
            </button>
          </React.Fragment>
        ))}
      </div>

      <motion.div 
        layout
        className={cn(
          "transition-all duration-500",
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8" 
            : "flex flex-col gap-2"
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.public_id}
              asset={asset}
              resourceType={asset.resource_type}
              onDelete={onDelete}
              onRename={onRename}
              viewMode={viewMode}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

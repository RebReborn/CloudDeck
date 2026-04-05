import React, { useState } from 'react';
import { useCloudDeckStore } from '../../store/useCloudDeckStore';
import { 
  Cloud, 
  ImageIcon, 
  Video, 
  FileText, 
  Folder, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Sparkles,
  Layout,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    resourceType, setResourceType, 
    folders, currentFolder, setCurrentFolder,
    uiStyle, setUiStyle,
    logout 
  } = useCloudDeckStore();

  const navItems = [
    { id: 'image', label: 'Images', icon: ImageIcon, color: 'text-blue-400' },
    { id: 'video', label: 'Videos', icon: Video, color: 'text-purple-400' },
    { id: 'raw', label: 'Files', icon: FileText, color: 'text-emerald-400' },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 88 : 280 }}
      className="h-full flex flex-col relative z-20 border-r border-white/5 bg-slate-950/40 backdrop-blur-3xl transition-all duration-500 ease-in-out"
    >
      {/* Header */}
      <div className={cn("p-6 flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <Cloud className="text-white w-6 h-6" />
        </motion.div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black text-white tracking-tighter"
          >
            CloudDeck
          </motion.span>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto">
        <div>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Library</p>
          )}
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setResourceType(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative group",
                  resourceType === item.id 
                    ? "bg-white/10 text-white shadow-xl" 
                    : "text-white/40 hover:text-white hover:bg-white/5",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {resourceType === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10" 
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", resourceType === item.id ? item.color : "")} />
                {!isCollapsed && <span className="relative z-10">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
           {!isCollapsed && (
            <p className="px-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Folders</p>
          )}
           <div className="space-y-1.5">
            <button
              onClick={() => setCurrentFolder('')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                currentFolder === '' ? "text-blue-400 bg-blue-400/5 whitespace-nowrap" : "text-white/40 hover:text-white hover:bg-white/5",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Folder className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">Root</span>}
            </button>
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setCurrentFolder(currentFolder ? `${currentFolder}/${folder}` : folder)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  "text-white/40 hover:text-white hover:bg-white/5",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Folder className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{folder}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={() => setUiStyle(uiStyle === 'glass' ? 'regular' : 'glass')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          {uiStyle === 'glass' ? <LayoutGrid className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          {!isCollapsed && <span>{uiStyle === 'glass' ? 'Standard UI' : 'Stellar UI'}</span>}
        </button>
        
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white shadow-xl z-30"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>
    </motion.aside>
  );
}

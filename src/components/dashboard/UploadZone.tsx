import React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  FileIcon, 
  CheckCircle2, 
  AlertCircle,
  CloudCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import Button from '../ui/Button';

interface UploadZoneProps {
  isOpen: boolean;
  onClose: () => void;
  onDrop: (files: File[]) => void;
  uploadingFiles: { name: string; progress: number; error?: string }[];
}

export default function UploadZone({ isOpen, onClose, onDrop, uploadingFiles }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black text-white tracking-tighter">Synchronize Assets</h3>
                 <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Direct upload to Cloudinary CDN</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                 <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-8 space-y-8">
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center gap-6 transition-all cursor-pointer relative group",
                  isDragActive 
                    ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(59,130,246,0.15)]" 
                    : "border-white/10 hover:border-white/20 bg-white/5"
                )}
              >
                <input {...getInputProps()} />
                <div className={cn(
                  "w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform duration-500",
                  isDragActive && "text-primary border-primary animate-bounce"
                )}>
                  <Upload className="w-10 h-10" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-black text-white px-2">Drag & drop files here</p>
                  <p className="text-sm font-bold text-white/20 uppercase tracking-widest">Supports images, videos, and raw formats</p>
                </div>
                
                {/* Visual accents for drag active */}
                <AnimatePresence>
                  {isDragActive && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 border-2 border-primary rounded-[2rem] glow-primary" 
                    />
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {uploadingFiles.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Live Transfer</p>
                       <p className="text-xs font-bold text-primary">{uploadingFiles.length} item(s)</p>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {uploadingFiles.map(file => (
                        <div key={file.name} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3 group">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                   <FileIcon className="w-4 h-4 text-white/40" />
                                </div>
                                <span className="text-sm font-bold text-white truncate max-w-[200px]">{file.name}</span>
                             </div>
                             {file.progress === 100 ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                             ) : file.error ? (
                                <AlertCircle className="w-5 h-5 text-destructive" />
                             ) : (
                                <span className="text-xs font-black text-primary">{file.progress}%</span>
                             )}
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${file.progress}%` }}
                               className={cn(
                                 "h-full rounded-full transition-all duration-300",
                                 file.error ? "bg-destructive" : (file.progress === 100 ? "bg-emerald-400" : "bg-primary")
                               )}
                             />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-8 bg-black/20 border-t border-white/5 flex justify-end">
               <Button variant="ghost" onClick={onClose} className="rounded-xl px-8">
                  Dismiss
               </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

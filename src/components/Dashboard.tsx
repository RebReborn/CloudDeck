import React, { useEffect, useState } from 'react';
import { useCloudDeckStore } from '../store/useCloudDeckStore';
import api from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import axios from 'axios';

// New Sub-components
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import AssetGrid from './dashboard/AssetGrid';
import UsageStats from './dashboard/UsageStats';
import UploadZone from './dashboard/UploadZone';
import MagicInsight from './dashboard/MagicInsight';
import GlassCard from './ui/GlassCard';
import { Trash2 } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { 
    setAssets, 
    setFolders, 
    currentFolder, 
    resourceType, 
    setUsage,
    credentials,
    uiStyle
  } = useCloudDeckStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number; error?: string }[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedAssetForInsight, setSelectedAssetForInsight] = useState<any | null>(null);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const [assetsRes, foldersRes, usageRes] = await Promise.all([
        api.get('/assets', { params: { prefix: currentFolder, resource_type: resourceType } }),
        api.get('/folders', { params: { path: currentFolder } }),
        api.get('/usage')
      ]);
      setAssets(assetsRes.data.resources);
      setFolders(foldersRes.data.folders.map((f: any) => f.name));
      setUsage(usageRes.data);
    } catch (error: any) {
      toast.error('Sync failed. Checking link...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [currentFolder, resourceType]);

  const handleDelete = async (public_id: string) => {
    try {
      await api.delete('/assets', { data: { public_ids: [public_id], resource_type: resourceType } });
      toast.success('Asset Purged');
      setIsDeleting(null);
      fetchAssets();
    } catch (error) {
      toast.error('Purge Failed');
    }
  };

  const handleRename = async (public_id: string) => {
    const newName = prompt('Enter new designation:');
    if (!newName) return;
    try {
      const folderPath = public_id.includes('/') ? public_id.substring(0, public_id.lastIndexOf('/') + 1) : '';
      const to_public_id = `${folderPath}${newName}`;
      
      await api.patch('/assets/rename', { from_public_id: public_id, to_public_id, resource_type: resourceType });
      toast.success('Asset Re-designated');
      fetchAssets();
    } catch (error) {
      toast.error('Re-designation Failed');
    }
  };

  const handleUpload = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      try {
        const { data: { signature } } = await api.post('/sign-upload', { 
          folder: currentFolder, 
          timestamp 
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', credentials!.apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', currentFolder);

        setUploadingFiles(prev => [...prev, { name: file.name, progress: 0 }]);

        await axios.post(
          `https://api.cloudinary.com/v1_1/${credentials!.cloudName}/auto/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
              setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress } : f));
            }
          }
        );

        toast.success(`Encapsulated ${file.name}`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        fetchAssets();
      } catch (error) {
        toast.error(`Transfer Failed: ${file.name}`);
        setUploadingFiles(prev => prev.map(f => f.name === file.name ? { ...f, error: 'Failed' } : f));
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-transparent">
        <TopBar onUploadClick={() => setIsUploadModalOpen(true)} />
        
        <div className="flex-1 overflow-y-auto pt-8">
           <UsageStats />
           <AssetGrid 
             isLoading={isLoading} 
             onDelete={setIsDeleting}
             onRename={handleRename}
             onInsight={setSelectedAssetForInsight}
           />
        </div>
      </main>

      {/* Modals & Overlays */}
      <UploadZone 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDrop={handleUpload}
        uploadingFiles={uploadingFiles}
      />

      <MagicInsight 
        asset={selectedAssetForInsight}
        isOpen={!!selectedAssetForInsight}
        onClose={() => setSelectedAssetForInsight(null)}
      />

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleting(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center text-destructive mx-auto mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Terminate Asset?</h3>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed">
                This action will permanently purge the media from Cloudinary CDN.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsDeleting(null)}
                  variant="ghost"
                  className="flex-1 py-4"
                >
                  Abort
                </Button>
                <Button 
                  onClick={() => handleDelete(isDeleting)}
                  variant="destructive"
                  className="flex-1 py-4"
                >
                  Confirm Purge
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useCloudDeckStore } from '../store/useCloudDeckStore';
import api from '../lib/api';
import { 
  Cloud,
  Search, 
  LayoutGrid, 
  List, 
  Upload, 
  Folder, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit2, 
  Copy,
  ChevronRight,
  LogOut,
  HardDrive,
  Activity,
  Database,
  Loader2,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes, cn } from '../lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function Dashboard() {
  const { 
    assets, setAssets, 
    folders, setFolders, 
    currentFolder, setCurrentFolder,
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    resourceType, setResourceType,
    usage, setUsage,
    logout,
    credentials
  } = useCloudDeckStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [currentFolder, resourceType]);

  const handleDelete = async (public_id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await api.delete('/assets', { data: { public_ids: [public_id], resource_type: resourceType } });
      toast.success('Asset deleted');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  };

  const handleRename = async (public_id: string) => {
    const newName = prompt('Enter new name:');
    if (!newName) return;
    try {
      const extension = public_id.split('.').pop();
      const folderPath = public_id.includes('/') ? public_id.substring(0, public_id.lastIndexOf('/') + 1) : '';
      const to_public_id = `${folderPath}${newName}`;
      
      await api.patch('/assets/rename', { from_public_id: public_id, to_public_id, resource_type: resourceType });
      toast.success('Asset renamed');
      fetchAssets();
    } catch (error) {
      toast.error('Failed to rename asset');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const onDrop = async (acceptedFiles: File[]) => {
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

        toast.success(`${file.name} uploaded successfully`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        fetchAssets();
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  const filteredAssets = assets.filter(asset => 
    asset.public_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cloud className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl dark:text-white tracking-tight">CloudDeck</span>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pt-4">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Resource Type</p>
            <div className="space-y-1">
              <button 
                onClick={() => setResourceType('image')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  resourceType === 'image' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm shadow-blue-500/5" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <ImageIcon className="w-4 h-4" /> Images
              </button>
              <button 
                onClick={() => setResourceType('video')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  resourceType === 'video' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm shadow-blue-500/5" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Video className="w-4 h-4" /> Videos
              </button>
              <button 
                onClick={() => setResourceType('raw')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  resourceType === 'raw' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm shadow-blue-500/5" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <FileText className="w-4 h-4" /> Raw Files
              </button>
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Folders</p>
            <div className="space-y-1">
              <button 
                onClick={() => setCurrentFolder('')}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  currentFolder === '' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm shadow-blue-500/5" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <Folder className="w-4 h-4" /> Root
              </button>
              {folders.map(folder => (
                <button 
                  key={folder}
                  onClick={() => setCurrentFolder(currentFolder ? `${currentFolder}/${folder}` : folder)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Folder className="w-4 h-4" /> {folder}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Search assets by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-xl shadow-blue-500/25 active:scale-95"
            >
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>
        </header>

        {/* Analytics Bar */}
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Used</p>
              <p className="text-xl font-black dark:text-white tracking-tight">{usage ? formatBytes(usage.storage.usage) : '...'}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bandwidth</p>
              <p className="text-xl font-black dark:text-white tracking-tight">{usage ? formatBytes(usage.bandwidth.usage) : '...'}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</p>
              <p className="text-xl font-black dark:text-white tracking-tight">{usage ? usage.resources.usage : '...'}</p>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="px-6 py-2 flex items-center gap-2 text-sm text-slate-500 shrink-0">
          <button onClick={() => setCurrentFolder('')} className="hover:text-blue-600 transition-colors">Root</button>
          {currentFolder.split('/').filter(Boolean).map((part, i, arr) => (
            <React.Fragment key={part}>
              <ChevronRight className="w-3 h-3" />
              <button 
                onClick={() => setCurrentFolder(arr.slice(0, i + 1).join('/'))}
                className="hover:text-blue-600 transition-colors"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Asset Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p>Loading your media...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <ImageIcon className="w-10 h-10" />
              </div>
              <p>No assets found in this folder.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredAssets.map(asset => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={asset.public_id} 
                  className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {asset.resource_type === 'image' ? (
                      <img 
                        src={asset.secure_url.replace('/upload/', '/upload/w_300,c_fill,g_auto/')} 
                        alt={asset.public_id}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => copyUrl(asset.secure_url)} className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.open(asset.secure_url, '_blank')} className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={asset.public_id}>
                      {asset.public_id.split('/').pop()}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500">{formatBytes(asset.bytes)}</p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleRename(asset.public_id)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDelete(asset.public_id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Dimensions</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredAssets.map(asset => (
                    <tr key={asset.public_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                            {asset.resource_type === 'image' ? (
                              <img src={asset.secure_url.replace('/upload/', '/upload/w_100,c_thumb/')} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Video className="w-4 h-4 text-slate-400" /></div>
                            )}
                          </div>
                          <span className="text-sm font-medium dark:text-white truncate max-w-[200px]">{asset.public_id.split('/').pop()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatBytes(asset.bytes)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{asset.width} x {asset.height}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(asset.created_at), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => copyUrl(asset.secure_url)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Copy className="w-4 h-4" /></button>
                          <button onClick={() => handleRename(asset.public_id)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(asset.public_id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold dark:text-white">Upload Media</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div 
                  {...getRootProps()} 
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold dark:text-white">Drag & drop files here</p>
                    <p className="text-sm text-slate-500">or click to browse from your computer</p>
                  </div>
                </div>

                {uploadingFiles.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Uploading...</p>
                    {uploadingFiles.map(file => (
                      <div key={file.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-[200px] dark:text-white">{file.name}</span>
                          <span className="text-blue-600 font-medium">{file.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className="h-full bg-blue-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

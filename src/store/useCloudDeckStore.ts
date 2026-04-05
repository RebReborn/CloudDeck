import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

interface Asset {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  url: string;
  secure_url: string;
}

interface CloudDeckState {
  credentials: CloudinaryCredentials | null;
  assets: Asset[];
  folders: string[];
  currentFolder: string;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  searchQuery: string;
  resourceType: 'image' | 'video' | 'raw';
  usage: any | null;
  
  setCredentials: (creds: CloudinaryCredentials | null) => void;
  setAssets: (assets: Asset[]) => void;
  setFolders: (folders: string[]) => void;
  setCurrentFolder: (folder: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setIsLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setResourceType: (type: 'image' | 'video' | 'raw') => void;
  setUsage: (usage: any) => void;
  logout: () => void;
}

export const useCloudDeckStore = create<CloudDeckState>()(
  persist(
    (set) => ({
      credentials: null,
      assets: [],
      folders: [],
      currentFolder: '',
      viewMode: 'grid',
      isLoading: false,
      searchQuery: '',
      resourceType: 'image',
      usage: null,

      setCredentials: (credentials) => set({ credentials }),
      setAssets: (assets) => set({ assets }),
      setFolders: (folders) => set({ folders }),
      setCurrentFolder: (currentFolder) => set({ currentFolder }),
      setViewMode: (viewMode) => set({ viewMode }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setResourceType: (resourceType) => set({ resourceType }),
      setUsage: (usage) => set({ usage }),
      logout: () => set({ 
        credentials: null, 
        assets: [], 
        folders: [], 
        currentFolder: '', 
        usage: null 
      }),
    }),
    {
      name: 'clouddeck-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for "Remember for this session"
      partialize: (state) => ({ credentials: state.credentials }), // Only persist credentials
    }
  )
);

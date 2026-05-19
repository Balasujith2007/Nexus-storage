import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

export interface Node {
  id: string;
  name: string;
  ip: string;
  capacity: number; // in TB
  region: string;
  status: 'online' | 'offline' | 'syncing';
  replicationEnabled: boolean;
}

interface AppState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // Cluster State
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  addNode: (node: Node) => void;
  totalFiles: number;
  incrementFiles: (count: number) => void;
}

const initialNodes: Node[] = [];

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  
  nodes: initialNodes,
  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  totalFiles: 4200000,
  incrementFiles: (count) => set((state) => ({ totalFiles: state.totalFiles + count })),
}));

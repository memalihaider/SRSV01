import { create } from 'zustand';

export interface BranchSettings {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  trn: string; // Tax Registration Number
  invoiceTemplate: 'modern' | 'classic' | 'minimalist' | 'premium';
  logo?: string;
  website?: string;
}

export interface BranchStore {
  branches: BranchSettings[];
  selectedBranch: BranchSettings | null;
  addBranch: (branch: BranchSettings) => void;
  updateBranch: (id: string, branch: Partial<BranchSettings>) => void;
  deleteBranch: (id: string) => void;
  selectBranch: (id: string) => void;
  getBranch: (id: string) => BranchSettings | undefined;
  getBranchByName: (name: string) => BranchSettings | undefined;
  getAllBranches: () => BranchSettings[];
}

const defaultBranches: BranchSettings[] = [
  {
    id: '1',
    name: 'Downtown Premium',
    phone: '+971-4-123-4567',
    email: 'downtown@manofcave.com',
    address: '123 Sheikh Zayed Road',
    city: 'Dubai',
    postalCode: '12345',
    country: 'UAE',
    trn: 'AE123456789012345',
    invoiceTemplate: 'modern',
    website: 'www.manofcave.com'
  },
  {
    id: '2',
    name: 'Marina Branch',
    phone: '+971-4-987-6543',
    email: 'marina@manofcave.com',
    address: '456 Marina Mall',
    city: 'Dubai',
    postalCode: '54321',
    country: 'UAE',
    trn: 'AE123456789012346',
    invoiceTemplate: 'classic',
    website: 'www.manofcave.com'
  },
  {
    id: '3',
    name: 'JBR Beach Branch',
    phone: '+971-4-555-6666',
    email: 'jbr@manofcave.com',
    address: '789 Jumeirah Beach Road',
    city: 'Dubai',
    postalCode: '99999',
    country: 'UAE',
    trn: 'AE123456789012347',
    invoiceTemplate: 'minimalist',
    website: 'www.manofcave.com'
  }
];

export const useBranchStore = create<BranchStore>((set, get) => ({
  branches: defaultBranches,
  selectedBranch: defaultBranches[0],

  addBranch: (branch) =>
    set((state) => ({
      branches: [...state.branches, branch]
    })),

  updateBranch: (id, branch) =>
    set((state) => ({
      branches: state.branches.map((b) =>
        b.id === id ? { ...b, ...branch } : b
      ),
      selectedBranch:
        state.selectedBranch?.id === id
          ? { ...state.selectedBranch, ...branch }
          : state.selectedBranch
    })),

  deleteBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((b) => b.id !== id),
      selectedBranch:
        state.selectedBranch?.id === id ? state.branches[0] : state.selectedBranch
    })),

  selectBranch: (id) =>
    set((state) => ({
      selectedBranch: state.branches.find((b) => b.id === id) || state.selectedBranch
    })),

  getBranch: (id) => {
    const state = get();
    return state.branches.find((b) => b.id === id);
  },

  getBranchByName: (name) => {
    const state = get();
    return state.branches.find((b) => b.name === name);
  },

  getAllBranches: () => get().branches
}));

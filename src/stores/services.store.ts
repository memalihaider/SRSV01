import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Service {
  id: string;
  name: string;
  category?: string;
  duration?: number;
  price?: number;
  branches?: string[];
  staffIds?: string[];
  image?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

interface ServicesStore {
  services: Service[];
  getServicesByBranch: (branchId?: string) => Service[];
  addService: (service: Omit<Service, 'id'>) => void;
}

export const useServicesStore = create<ServicesStore>()(
  persist((set, get) => ({
    services: [
      { id: 'haircut', name: 'Classic Haircut', category: 'haircut', price: 35, duration: 30, branches: ['branch1', 'branch2', 'branch3'], staffIds: ['mike', 'david'], image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop', description: 'Professional classic haircut', status: 'active' },
      { id: 'beard', name: 'Beard Trim', category: 'beard', price: 25, duration: 20, branches: ['branch1', 'branch2'], staffIds: ['mike', 'alex'], image: 'https://images.unsplash.com/photo-1621605815841-2df4740b0795?q=80&w=2070&auto=format&fit=crop', description: 'Expert beard trimming', status: 'active' },
      { id: 'premium', name: 'Premium Package', category: 'packages', price: 85, duration: 90, branches: ['branch2', 'branch3'], staffIds: ['sarah'], image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop', description: 'All-in-one premium service', status: 'active' },
      { id: 'color', name: 'Hair Color', category: 'color', price: 70, duration: 90, branches: ['branch1', 'branch3'], staffIds: ['alex'], image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop', description: 'Professional hair coloring', status: 'active' },
      { id: 'shave', name: 'Hot Towel Shave', category: 'shaving', price: 45, duration: 30, branches: ['branch1'], staffIds: ['sarah'], image: 'https://images.unsplash.com/photo-1512690196252-741d2fd35ad0?q=80&w=2070&auto=format&fit=crop', description: 'Traditional hot towel shave', status: 'active' },
    ],
    getServicesByBranch: (branchId) => {
      if (!branchId) return get().services;
      return get().services.filter(s => !s.branches || s.branches.includes(branchId));
    },
    addService: (service) => {
      const newService: Service = { ...service, id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
      set(state => ({ services: [...state.services, newService] }));
    }
  }), { name: 'services-storage' })
);

export default useServicesStore;

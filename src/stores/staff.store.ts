import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Staff {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  image: string;
  specialties: string[];
  branchId: string;
  bio: string;
  socials?: {
    instagram?: string;
    twitter?: string;
  };
}

interface StaffStore {
  staff: Staff[];
  getStaffByBranch: (branchId: string) => Staff[];
  getStaffById: (id: string) => Staff | undefined;
}

export const useStaffStore = create<StaffStore>()(
  persist((set, get) => ({
    staff: [
      {
        id: 'mike',
        name: 'Mike Johnson',
        role: 'Master Barber',
        rating: 4.9,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
        specialties: ['Classic Haircuts', 'Fades', 'Beard Grooming'],
        branchId: 'downtown',
        bio: 'With over 10 years of experience, Mike is a master of classic styles and modern fades.',
        socials: { instagram: '@mike_barber' }
      },
      {
        id: 'alex',
        name: 'Alex Rodriguez',
        role: 'Senior Stylist',
        rating: 4.8,
        reviews: 95,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop',
        specialties: ['Hair Coloring', 'Long Hair Styling', 'Beard Styling'],
        branchId: 'midtown',
        bio: 'Alex specializes in creative coloring and modern styling for all hair lengths.',
        socials: { instagram: '@alex_styles' }
      },
      {
        id: 'sarah',
        name: 'Sarah Jenkins',
        role: 'Barber & Grooming Expert',
        rating: 4.9,
        reviews: 112,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
        specialties: ['Hot Towel Shaves', 'Skin Fades', 'Kids Haircuts'],
        branchId: 'uptown',
        bio: 'Sarah brings a meticulous eye for detail to every shave and skin fade.',
        socials: { instagram: '@sarah_grooming' }
      },
      {
        id: 'david',
        name: 'David Chen',
        role: 'Junior Barber',
        rating: 4.7,
        reviews: 64,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2070&auto=format&fit=crop',
        specialties: ['Classic Cuts', 'Beard Trims'],
        branchId: 'suburban',
        bio: 'David is a rising star in the barbering world, known for his precision and friendly service.',
        socials: { instagram: '@david_cuts' }
      }
    ],
    getStaffByBranch: (branchId) => {
      return get().staff.filter(s => s.branchId === branchId);
    },
    getStaffById: (id) => {
      return get().staff.find(s => s.id === id);
    }
  }), { name: 'staff-storage' })
);

export default useStaffStore;

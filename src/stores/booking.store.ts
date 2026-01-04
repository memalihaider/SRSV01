import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  image?: string;
}

export interface BookingItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: string;
  quantity: number;
  staffMember?: string;
}

export interface ConfirmedBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  services: BookingItem[];
  staffMember: string;
  date: string;
  time: string;
  totalPrice: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface BookingStore {
  // Cart items
  cartItems: BookingItem[];
  
  // Customer details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  
  // Booking details
  selectedStaff: string;
  selectedDate: string;
  selectedTime: string;
  
  // Confirmed bookings
  confirmedBookings: ConfirmedBooking[];
  
  // Cart actions
  addToCart: (service: BookingService) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartItemQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Customer info actions
  setCustomerName: (name: string) => void;
  setCustomerEmail: (email: string) => void;
  setCustomerPhone: (phone: string) => void;
  setSpecialRequests: (requests: string) => void;
  
  // Booking details actions
  setSelectedStaff: (staff: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  updateServiceStaff: (serviceId: string, staff: string) => void;
  
  // Booking confirmation
  confirmBooking: () => ConfirmedBooking | null;
  getConfirmedBookings: () => ConfirmedBooking[];
  getBookingsByDate: (date: string) => ConfirmedBooking[];
  getBookingsByStaff: (staff: string) => ConfirmedBooking[];
  cancelBooking: (bookingId: string) => void;
  
  // Cart summary
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getTotalDuration: () => string;
  
  // Reset
  resetBooking: () => void;

  // Stepper state (for BookingStepper component)
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  updateBookingData: (keyOrData: any, value?: any) => void;
  bookingData: any;
}

export const useBookingStore = create<BookingStore>()(
  persist((set, get) => ({
    cartItems: [],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
    selectedStaff: '',
    selectedDate: '',
    selectedTime: '',
    confirmedBookings: [],
    
    // Stepper state
    currentStep: 1,
    bookingData: {
      serviceId: '',
      barberId: '',
      date: '',
      time: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
    },

    nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
    prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    updateBookingData: (keyOrData, value) => {
      if (typeof keyOrData === 'string') {
        set((state) => ({
          bookingData: { ...state.bookingData, [keyOrData]: value }
        }));
      } else {
        set((state) => ({
          bookingData: { ...state.bookingData, ...keyOrData }
        }));
      }
    },
    
    addToCart: (service) => {
      const cartItems = get().cartItems;
      const existingItem = cartItems.find(item => item.serviceId === service.id);
      
      if (existingItem) {
        set(state => ({
          cartItems: state.cartItems.map(item =>
            item.serviceId === service.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }));
      } else {
        set(state => ({
          cartItems: [...state.cartItems, {
            serviceId: service.id,
            serviceName: service.name,
            price: service.price,
            duration: service.duration,
            quantity: 1
          }]
        }));
      }
    },
    
    removeFromCart: (serviceId) => {
      set(state => ({
        cartItems: state.cartItems.filter(item => item.serviceId !== serviceId)
      }));
    },
    
    updateCartItemQuantity: (serviceId, quantity) => {
      if (quantity <= 0) {
        get().removeFromCart(serviceId);
      } else {
        set(state => ({
          cartItems: state.cartItems.map(item =>
            item.serviceId === serviceId
              ? { ...item, quantity }
              : item
          )
        }));
      }
    },
    
    clearCart: () => {
      set({
        cartItems: [],
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        specialRequests: '',
        selectedStaff: '',
        selectedDate: '',
        selectedTime: ''
      });
    },
    
    setCustomerName: (name) => set({ customerName: name }),
    setCustomerEmail: (email) => set({ customerEmail: email }),
    setCustomerPhone: (phone) => set({ customerPhone: phone }),
    setSpecialRequests: (requests) => set({ specialRequests: requests }),
    
    setSelectedStaff: (staff) => set({ selectedStaff: staff }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedTime: (time) => set({ selectedTime: time }),
    
    updateServiceStaff: (serviceId, staff) => {
      set(state => ({
        cartItems: state.cartItems.map(item =>
          item.serviceId === serviceId
            ? { ...item, staffMember: staff }
            : item
        )
      }));
    },
    
    confirmBooking: () => {
      const state = get();
      
      // Validation
      if (!state.customerName || !state.customerEmail || !state.customerPhone) {
        alert('Please fill in all customer details');
        return null;
      }
      
      if (state.cartItems.length === 0) {
        alert('Please select at least one service');
        return null;
      }
      
      if (!state.selectedStaff) {
        alert('Please select a staff member');
        return null;
      }
      
      if (!state.selectedDate || !state.selectedTime) {
        alert('Please select a date and time');
        return null;
      }
      
      const totalPrice = state.getCartTotal();
      const newBooking: ConfirmedBooking = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerName: state.customerName,
        customerEmail: state.customerEmail,
        customerPhone: state.customerPhone,
        services: state.cartItems,
        staffMember: state.selectedStaff,
        date: state.selectedDate,
        time: state.selectedTime,
        totalPrice,
        specialRequests: state.specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        confirmedBookings: [...state.confirmedBookings, newBooking]
      }));
      
      // Reset booking form
      state.resetBooking();
      
      return newBooking;
    },
    
    getConfirmedBookings: () => get().confirmedBookings,
    
    getBookingsByDate: (date) => {
      return get().confirmedBookings.filter(booking => booking.date === date);
    },
    
    getBookingsByStaff: (staff) => {
      return get().confirmedBookings.filter(booking => booking.staffMember === staff);
    },
    
    cancelBooking: (bookingId) => {
      set(state => ({
        confirmedBookings: state.confirmedBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      }));
    },
    
    getCartTotal: () => {
      return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    getCartItemsCount: () => {
      return get().cartItems.reduce((count, item) => count + item.quantity, 0);
    },
    
    getTotalDuration: () => {
      const cartItems = get().cartItems;
      let totalMinutes = 0;
      
      cartItems.forEach(item => {
        const durationStr = item.duration || '0';
        const minutes = parseInt(durationStr.toString().split(' ')[0]);
        totalMinutes += minutes * item.quantity;
      });
      
      if (totalMinutes < 60) {
        return `${totalMinutes} min`;
      } else {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
    },
    
    resetBooking: () => {
      set({
        cartItems: [],
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        specialRequests: '',
        selectedStaff: '',
        selectedDate: '',
        selectedTime: ''
      });
    }
  }), { name: 'booking-storage' })
);

export default useBookingStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Customer Account Types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  preferredBranch?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Wallet & Loyalty Points
export interface CustomerWallet {
  id: string;
  customerId: string;
  balance: number; // wallet balance in dollars
  loyaltyPoints: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Types
export type TransactionType = 'service_booking' | 'product_purchase' | 'points_earned' | 'points_redeemed' | 'wallet_topup' | 'wallet_payment' | 'refund';

export interface WalletTransaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  pointsAmount?: number;
  description: string;
  referenceId?: string; // booking ID or order ID
  balanceBefore: number;
  balanceAfter: number;
  pointsBefore?: number;
  pointsAfter?: number;
  createdAt: Date;
}

// Booking History
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CustomerBooking {
  id: string;
  customerId: string;
  branchId?: string;
  branchName?: string;
  services: {
    serviceId: string;
    serviceName: string;
    price: number;
    duration: number;
    staffMember?: string;
  }[];
  date: string;
  time: string;
  totalAmount: number;
  pointsEarned: number;
  pointsUsed: number;
  walletAmountUsed: number;
  cashAmount: number;
  paymentMethod: 'cash' | 'wallet' | 'mixed';
  status: BookingStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Orders
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ProductOrder {
  id: string;
  customerId: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
  pointsEarned: number;
  pointsUsed: number;
  walletAmountUsed: number;
  cashAmount: number;
  paymentMethod: 'cash' | 'wallet' | 'mixed';
  status: OrderStatus;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Loyalty Points Settings (can be customized by admin/branch)
export interface LoyaltySettings {
  id: string;
  branchId?: string; // undefined for global settings
  pointsPerDollarSpent: number; // how many points customer gets per dollar spent
  pointsValueInDollars: number; // 1 point = X dollars (e.g., 0.01 means 100 points = $1)
  minimumPointsToRedeem: number;
  maximumPointsPerTransaction: number; // max points that can be redeemed per transaction
  bonusPointsFirstBooking: number;
  bonusPointsOnBirthday: number;
  pointsExpiryDays: number; // points expire after X days (0 = never)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerStore {
  // State
  customers: Customer[];
  wallets: CustomerWallet[];
  transactions: WalletTransaction[];
  bookings: CustomerBooking[];
  productOrders: ProductOrder[];
  loyaltySettings: LoyaltySettings[];
  currentCustomer: Customer | null;

  // Customer Actions
  registerCustomer: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerByEmail: (email: string) => Customer | undefined;
  getCustomerById: (id: string) => Customer | undefined;
  setCurrentCustomer: (customer: Customer | null) => void;
  loginCustomer: (email: string, password: string) => Customer | null;

  // Wallet Actions
  createWallet: (customerId: string) => CustomerWallet;
  getWalletByCustomerId: (customerId: string) => CustomerWallet | undefined;
  addPointsToWallet: (customerId: string, points: number, description: string, referenceId?: string) => void;
  redeemPoints: (customerId: string, points: number, description: string, referenceId?: string) => boolean;
  addToWalletBalance: (customerId: string, amount: number, description: string) => void;
  deductFromWalletBalance: (customerId: string, amount: number, description: string, referenceId?: string) => boolean;
  convertPointsToWallet: (customerId: string, points: number) => boolean;

  // Transaction Actions
  getTransactionsByCustomer: (customerId: string) => WalletTransaction[];

  // Booking Actions
  addBooking: (booking: Omit<CustomerBooking, 'id' | 'createdAt' | 'updatedAt'>) => CustomerBooking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  getBookingsByCustomer: (customerId: string) => CustomerBooking[];
  getBookingById: (id: string) => CustomerBooking | undefined;

  // Product Order Actions
  addProductOrder: (order: Omit<ProductOrder, 'id' | 'createdAt' | 'updatedAt'>) => ProductOrder;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrdersByCustomer: (customerId: string) => ProductOrder[];
  getOrderById: (id: string) => ProductOrder | undefined;

  // Loyalty Settings Actions
  addLoyaltySettings: (settings: Omit<LoyaltySettings, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLoyaltySettings: (id: string, updates: Partial<LoyaltySettings>) => void;
  deleteLoyaltySettings: (id: string) => void;
  getLoyaltySettingsByBranch: (branchId?: string) => LoyaltySettings | undefined;
  getActiveLoyaltySettings: (branchId?: string) => LoyaltySettings | undefined;

  // Utility
  calculatePointsForAmount: (amount: number, branchId?: string) => number;
  calculatePointsValue: (points: number, branchId?: string) => number;
}

// Default loyalty settings
const defaultLoyaltySettings: Omit<LoyaltySettings, 'id' | 'createdAt' | 'updatedAt'> = {
  pointsPerDollarSpent: 10, // 10 points per dollar
  pointsValueInDollars: 0.01, // 100 points = $1
  minimumPointsToRedeem: 100,
  maximumPointsPerTransaction: 5000,
  bonusPointsFirstBooking: 100,
  bonusPointsOnBirthday: 200,
  pointsExpiryDays: 365,
  isActive: true,
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      customers: [],
      wallets: [],
      transactions: [],
      bookings: [],
      productOrders: [],
      loyaltySettings: [{
        id: 'default-loyalty-settings',
        ...defaultLoyaltySettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      currentCustomer: null,

      // Customer Actions
      registerCustomer: (data) => {
        const newCustomer: Customer = {
          ...data,
          id: `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          customers: [...state.customers, newCustomer]
        }));

        // Create wallet for new customer
        get().createWallet(newCustomer.id);

        // Add bonus points for first registration
        const loyaltySettings = get().getActiveLoyaltySettings();
        if (loyaltySettings && loyaltySettings.bonusPointsFirstBooking > 0) {
          get().addPointsToWallet(
            newCustomer.id, 
            loyaltySettings.bonusPointsFirstBooking, 
            'Welcome bonus points!'
          );
        }

        return newCustomer;
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date() }
              : customer
          )
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter(customer => customer.id !== id)
        }));
      },

      getCustomerByEmail: (email) => {
        return get().customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      },

      getCustomerById: (id) => {
        return get().customers.find(c => c.id === id);
      },

      setCurrentCustomer: (customer) => {
        set({ currentCustomer: customer });
      },

      loginCustomer: (email, password) => {
        // In real app, this would validate against a backend
        const customer = get().getCustomerByEmail(email);
        if (customer) {
          set({ currentCustomer: customer });
          return customer;
        }
        return null;
      },

      // Wallet Actions
      createWallet: (customerId) => {
        const existingWallet = get().getWalletByCustomerId(customerId);
        if (existingWallet) return existingWallet;

        const newWallet: CustomerWallet = {
          id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId,
          balance: 0,
          loyaltyPoints: 0,
          totalPointsEarned: 0,
          totalPointsRedeemed: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          wallets: [...state.wallets, newWallet]
        }));

        return newWallet;
      },

      getWalletByCustomerId: (customerId) => {
        return get().wallets.find(w => w.customerId === customerId);
      },

      addPointsToWallet: (customerId, points, description, referenceId) => {
        const wallet = get().getWalletByCustomerId(customerId);
        if (!wallet) return;

        const transaction: WalletTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId,
          type: 'points_earned',
          amount: 0,
          pointsAmount: points,
          description,
          referenceId,
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance,
          pointsBefore: wallet.loyaltyPoints,
          pointsAfter: wallet.loyaltyPoints + points,
          createdAt: new Date(),
        };

        set((state) => ({
          wallets: state.wallets.map(w =>
            w.customerId === customerId
              ? {
                  ...w,
                  loyaltyPoints: w.loyaltyPoints + points,
                  totalPointsEarned: w.totalPointsEarned + points,
                  updatedAt: new Date(),
                }
              : w
          ),
          transactions: [...state.transactions, transaction],
        }));
      },

      redeemPoints: (customerId, points, description, referenceId) => {
        const wallet = get().getWalletByCustomerId(customerId);
        if (!wallet || wallet.loyaltyPoints < points) return false;

        const transaction: WalletTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId,
          type: 'points_redeemed',
          amount: 0,
          pointsAmount: -points,
          description,
          referenceId,
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance,
          pointsBefore: wallet.loyaltyPoints,
          pointsAfter: wallet.loyaltyPoints - points,
          createdAt: new Date(),
        };

        set((state) => ({
          wallets: state.wallets.map(w =>
            w.customerId === customerId
              ? {
                  ...w,
                  loyaltyPoints: w.loyaltyPoints - points,
                  totalPointsRedeemed: w.totalPointsRedeemed + points,
                  updatedAt: new Date(),
                }
              : w
          ),
          transactions: [...state.transactions, transaction],
        }));

        return true;
      },

      addToWalletBalance: (customerId, amount, description) => {
        const wallet = get().getWalletByCustomerId(customerId);
        if (!wallet) return;

        const transaction: WalletTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId,
          type: 'wallet_topup',
          amount,
          description,
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance + amount,
          createdAt: new Date(),
        };

        set((state) => ({
          wallets: state.wallets.map(w =>
            w.customerId === customerId
              ? { ...w, balance: w.balance + amount, updatedAt: new Date() }
              : w
          ),
          transactions: [...state.transactions, transaction],
        }));
      },

      deductFromWalletBalance: (customerId, amount, description, referenceId) => {
        const wallet = get().getWalletByCustomerId(customerId);
        if (!wallet || wallet.balance < amount) return false;

        const transaction: WalletTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          customerId,
          type: 'wallet_payment',
          amount: -amount,
          description,
          referenceId,
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance - amount,
          createdAt: new Date(),
        };

        set((state) => ({
          wallets: state.wallets.map(w =>
            w.customerId === customerId
              ? { ...w, balance: w.balance - amount, updatedAt: new Date() }
              : w
          ),
          transactions: [...state.transactions, transaction],
        }));

        return true;
      },

      convertPointsToWallet: (customerId, points) => {
        const wallet = get().getWalletByCustomerId(customerId);
        const loyaltySettings = get().getActiveLoyaltySettings();
        
        if (!wallet || !loyaltySettings || wallet.loyaltyPoints < points) return false;
        if (points < loyaltySettings.minimumPointsToRedeem) return false;

        const dollarValue = points * loyaltySettings.pointsValueInDollars;

        // First redeem the points
        get().redeemPoints(customerId, points, `Converted ${points} points to $${dollarValue.toFixed(2)} wallet balance`);
        
        // Then add to wallet balance
        get().addToWalletBalance(customerId, dollarValue, `Converted from ${points} loyalty points`);

        return true;
      },

      // Transaction Actions
      getTransactionsByCustomer: (customerId) => {
        return get().transactions.filter(t => t.customerId === customerId).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      // Booking Actions
      addBooking: (bookingData) => {
        const newBooking: CustomerBooking = {
          ...bookingData,
          id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking]
        }));

        // Award loyalty points for the booking
        if (newBooking.customerId && newBooking.pointsEarned > 0) {
          get().addPointsToWallet(
            newBooking.customerId,
            newBooking.pointsEarned,
            `Earned points for booking ${newBooking.id}`,
            newBooking.id
          );
        }

        return newBooking;
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map(booking =>
            booking.id === id
              ? { ...booking, status, updatedAt: new Date() }
              : booking
          )
        }));
      },

      getBookingsByCustomer: (customerId) => {
        return get().bookings.filter(b => b.customerId === customerId).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getBookingById: (id) => {
        return get().bookings.find(b => b.id === id);
      },

      // Product Order Actions
      addProductOrder: (orderData) => {
        const newOrder: ProductOrder = {
          ...orderData,
          id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          productOrders: [...state.productOrders, newOrder]
        }));

        // Award loyalty points for the order
        if (newOrder.customerId && newOrder.pointsEarned > 0) {
          get().addPointsToWallet(
            newOrder.customerId,
            newOrder.pointsEarned,
            `Earned points for order ${newOrder.id}`,
            newOrder.id
          );
        }

        return newOrder;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          productOrders: state.productOrders.map(order =>
            order.id === id
              ? { ...order, status, updatedAt: new Date() }
              : order
          )
        }));
      },

      getOrdersByCustomer: (customerId) => {
        return get().productOrders.filter(o => o.customerId === customerId).sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getOrderById: (id) => {
        return get().productOrders.find(o => o.id === id);
      },

      // Loyalty Settings Actions
      addLoyaltySettings: (settingsData) => {
        const newSettings: LoyaltySettings = {
          ...settingsData,
          id: `loyalty-settings-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          loyaltySettings: [...state.loyaltySettings, newSettings]
        }));
      },

      updateLoyaltySettings: (id, updates) => {
        set((state) => ({
          loyaltySettings: state.loyaltySettings.map(settings =>
            settings.id === id
              ? { ...settings, ...updates, updatedAt: new Date() }
              : settings
          )
        }));
      },

      deleteLoyaltySettings: (id) => {
        set((state) => ({
          loyaltySettings: state.loyaltySettings.filter(s => s.id !== id)
        }));
      },

      getLoyaltySettingsByBranch: (branchId) => {
        if (branchId) {
          return get().loyaltySettings.find(s => s.branchId === branchId);
        }
        return get().loyaltySettings.find(s => !s.branchId);
      },

      getActiveLoyaltySettings: (branchId) => {
        // First try to get branch-specific settings
        if (branchId) {
          const branchSettings = get().loyaltySettings.find(s => s.branchId === branchId && s.isActive);
          if (branchSettings) return branchSettings;
        }
        // Fall back to global settings
        return get().loyaltySettings.find(s => !s.branchId && s.isActive);
      },

      // Utility
      calculatePointsForAmount: (amount, branchId) => {
        const settings = get().getActiveLoyaltySettings(branchId);
        if (!settings) return 0;
        return Math.floor(amount * settings.pointsPerDollarSpent);
      },

      calculatePointsValue: (points, branchId) => {
        const settings = get().getActiveLoyaltySettings(branchId);
        if (!settings) return 0;
        return points * settings.pointsValueInDollars;
      },
    }),
    {
      name: 'customer-storage',
      partialize: (state) => ({
        customers: state.customers,
        wallets: state.wallets,
        transactions: state.transactions,
        bookings: state.bookings,
        productOrders: state.productOrders,
        loyaltySettings: state.loyaltySettings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.customers = state.customers.map(customer => ({
            ...customer,
            createdAt: new Date(customer.createdAt),
            updatedAt: new Date(customer.updatedAt),
          }));

          state.wallets = state.wallets.map(wallet => ({
            ...wallet,
            createdAt: new Date(wallet.createdAt),
            updatedAt: new Date(wallet.updatedAt),
          }));

          state.transactions = state.transactions.map(txn => ({
            ...txn,
            createdAt: new Date(txn.createdAt),
          }));

          state.bookings = state.bookings.map(booking => ({
            ...booking,
            createdAt: new Date(booking.createdAt),
            updatedAt: new Date(booking.updatedAt),
          }));

          state.productOrders = state.productOrders.map(order => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          }));

          state.loyaltySettings = state.loyaltySettings.map(settings => ({
            ...settings,
            createdAt: new Date(settings.createdAt),
            updatedAt: new Date(settings.updatedAt),
          }));
        }
      }
    }
  )
);

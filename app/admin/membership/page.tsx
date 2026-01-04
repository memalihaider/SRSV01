'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Tag,
  Star,
  DollarSign,
  Plus,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Upload,
  X,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Percent,
  Users,
  Award,
  CreditCard,
  TrendingUp,
  FileText,
  Building,
  Settings,
  Package,
  Info
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useServicesStore } from '@/stores/services.store';
import {
  useMembershipStore,
  type Offer,
  type PromoCode,
  type LoyaltyProgram,
  type CashbackProgram
} from "@/stores/membership.store";
import { useCustomerStore, type LoyaltySettings } from "@/stores/customer.store";

const getOfferTypeLabel = (type: string) => {
  switch (type) {
    case 'service': return 'Service';
    case 'product': return 'Product';
    case 'combo': return 'Combo';
    case 'birthday': return 'Birthday Special';
    case 'first_time_registration': return 'First Time Registration';
    case 'promotional_package': return 'Promotional Package';
    default: return type;
  }
};

export default function AdminMembership() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const {
    offers,
    promoCodes,
    loyaltyPrograms,
    cashbackPrograms,
    addOffer,
    updateOffer,
    deleteOffer,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    addLoyaltyProgram,
    updateLoyaltyProgram,
    deleteLoyaltyProgram,
    addCashbackProgram,
    updateCashbackProgram,
    deleteCashbackProgram,
    getOffersByBranch,
    getPromoCodesByBranch,
    getLoyaltyProgramsByBranch,
    getCashbackProgramsByBranch,
    getActiveOffers,
    getActivePromoCodes,
  } = useMembershipStore();

  // Customer store for loyalty settings
  const {
    loyaltySettings: allLoyaltySettings,
    addLoyaltySettings,
    updateLoyaltySettings,
    deleteLoyaltySettings,
    getActiveLoyaltySettings,
    getLoyaltySettingsByBranch,
  } = useCustomerStore();

  // Admin sees data for their branch (assuming branchId from user context)
  // For now, using a mock branch ID - in real app this would come from user context
  const adminBranchId = 'branch1'; // This should come from user.branchId

  const branchOffers = getOffersByBranch(adminBranchId);
  const branchPromoCodes = getPromoCodesByBranch(adminBranchId);
  const branchLoyaltyPrograms = getLoyaltyProgramsByBranch(adminBranchId);
  const branchCashbackPrograms = getCashbackProgramsByBranch(adminBranchId);
  
  // Get branch-specific or global loyalty settings
  const branchLoyaltySettings = getLoyaltySettingsByBranch(adminBranchId);
  const globalLoyaltySettings = getActiveLoyaltySettings();
  const currentLoyaltySettings = branchLoyaltySettings || globalLoyaltySettings;

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Dialog states
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [loyaltyDialogOpen, setLoyaltyDialogOpen] = useState(false);
  const [cashbackDialogOpen, setCashbackDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loyaltySettingsDialogOpen, setLoyaltySettingsDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { getServicesByBranch } = useServicesStore();
  const services = getServicesByBranch(adminBranchId);
  const [dialogType, setDialogType] = useState<'offer' | 'promo' | 'loyalty' | 'cashback'>('offer');

  // Form states
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    type: 'service' as 'service' | 'product' | 'combo' | 'birthday' | 'first_time_registration' | 'promotional_package',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    applicableItems: [] as string[],
    applicableServices: [] as string[],
    offerFor: 'single' as 'single' | 'series',
    image: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    isActive: true
  });

  const [promoForm, setPromoForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minimumPurchase: '',
    maximumDiscount: '',
    applicableCategories: [] as string[],
    validFrom: '',
    validTo: '',
    usageLimit: '',
    isActive: true
  });

  const [loyaltyForm, setLoyaltyForm] = useState({
    name: '',
    description: '',
    pointsPerDollar: 1,
    redemptionRate: 0.01,
    minimumPoints: 100,
    maximumPoints: '',
    expiryDays: 365,
    isActive: true
  });

  const [cashbackForm, setCashbackForm] = useState({
    name: '',
    description: '',
    cashbackType: 'percentage' as 'percentage' | 'fixed',
    cashbackValue: 0,
    minimumPurchase: '',
    applicableCategories: [] as string[],
    validFrom: '',
    validTo: '',
    isActive: true
  });

  // Loyalty Settings Form (for customer store settings)
  const [loyaltySettingsForm, setLoyaltySettingsForm] = useState({
    pointsPerDollarSpent: currentLoyaltySettings?.pointsPerDollarSpent || 10,
    pointsValueInDollars: currentLoyaltySettings?.pointsValueInDollars || 0.01,
    minimumPointsToRedeem: currentLoyaltySettings?.minimumPointsToRedeem || 100,
    maximumPointsPerTransaction: currentLoyaltySettings?.maximumPointsPerTransaction || 5000,
    bonusPointsFirstBooking: currentLoyaltySettings?.bonusPointsFirstBooking || 100,
    bonusPointsOnBirthday: currentLoyaltySettings?.bonusPointsOnBirthday || 200,
    pointsExpiryDays: currentLoyaltySettings?.pointsExpiryDays || 365,
    isActive: currentLoyaltySettings?.isActive ?? true,
  });

  // Update form when settings change
  useEffect(() => {
    if (currentLoyaltySettings) {
      setLoyaltySettingsForm({
        pointsPerDollarSpent: currentLoyaltySettings.pointsPerDollarSpent,
        pointsValueInDollars: currentLoyaltySettings.pointsValueInDollars,
        minimumPointsToRedeem: currentLoyaltySettings.minimumPointsToRedeem,
        maximumPointsPerTransaction: currentLoyaltySettings.maximumPointsPerTransaction,
        bonusPointsFirstBooking: currentLoyaltySettings.bonusPointsFirstBooking,
        bonusPointsOnBirthday: currentLoyaltySettings.bonusPointsOnBirthday,
        pointsExpiryDays: currentLoyaltySettings.pointsExpiryDays,
        isActive: currentLoyaltySettings.isActive,
      });
    }
  }, [currentLoyaltySettings]);

  const resetForms = () => {
    setOfferForm({
      title: '',
      description: '',
      type: 'service',
      discountType: 'percentage',
      discountValue: 0,
      applicableItems: [],
      applicableServices: [],
      offerFor: 'single',
      image: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      isActive: true
    });
    setPromoForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minimumPurchase: '',
      maximumDiscount: '',
      applicableCategories: [],
      validFrom: '',
      validTo: '',
      usageLimit: '',
      isActive: true
    });
    setLoyaltyForm({
      name: '',
      description: '',
      pointsPerDollar: 1,
      redemptionRate: 0.01,
      minimumPoints: 100,
      maximumPoints: '',
      expiryDays: 365,
      isActive: true
    });
    setCashbackForm({
      name: '',
      description: '',
      cashbackType: 'percentage',
      cashbackValue: 0,
      minimumPurchase: '',
      applicableCategories: [],
      validFrom: '',
      validTo: '',
      isActive: true
    });
  };

  // Filter functions
  const getFilteredOffers = () => {
    return branchOffers.filter(offer => {
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && offer.isActive) ||
                           (statusFilter === 'inactive' && !offer.isActive);
      return matchesStatus;
    });
  };

  const getFilteredPromoCodes = () => {
    return branchPromoCodes.filter(promo => {
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && promo.isActive) ||
                           (statusFilter === 'inactive' && !promo.isActive);
      return matchesStatus;
    });
  };

  const getFilteredLoyaltyPrograms = () => {
    return branchLoyaltyPrograms.filter(program => {
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && program.isActive) ||
                           (statusFilter === 'inactive' && !program.isActive);
      return matchesStatus;
    });
  };

  const getFilteredCashbackPrograms = () => {
    return branchCashbackPrograms.filter(program => {
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && program.isActive) ||
                           (statusFilter === 'inactive' && !program.isActive);
      return matchesStatus;
    });
  };

  // Initialize with sample data
  useEffect(() => {
    if (branchOffers.length === 0 && services.length > 0) {
      const mockOffers: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>[] = [
        {
          title: 'Birthday Special Offer',
          description: '25% off any service on your birthday',
          type: 'birthday',
          discountType: 'percentage',
          discountValue: 25,
          applicableItems: [],
          applicableServices: [],
          offerFor: 'single',
          image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
          validFrom: new Date(),
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          branchId: adminBranchId,
          isActive: true
        },
        {
          title: 'Welcome to Our Salon!',
          description: '30% off your first visit',
          type: 'first_time_registration',
          discountType: 'percentage',
          discountValue: 30,
          applicableItems: [],
          applicableServices: [],
          offerFor: 'single',
          image: 'https://images.unsplash.com/photo-1621605815841-aa887ad43639?q=80&w=2070&auto=format&fit=crop',
          validFrom: new Date(),
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          branchId: adminBranchId,
          isActive: true
        },
        {
          title: 'Complete Spa Package',
          description: 'Massage + Facial + Manicure package',
          type: 'promotional_package',
          discountType: 'percentage',
          discountValue: 15,
          applicableItems: [],
          applicableServices: services.slice(0, 3).map(s => s.id),
          offerFor: 'series',
          image: 'https://images.unsplash.com/photo-1599351431247-f5094021186d?q=80&w=2070&auto=format&fit=crop',
          validFrom: new Date(),
          validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          branchId: adminBranchId,
          isActive: true
        },
      ];

      mockOffers.forEach(offer => addOffer(offer));
    }

    if (branchPromoCodes.length === 0) {
      const mockPromos: Omit<PromoCode, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>[] = [
        {
          code: 'WELCOME30',
          description: '30% off first visit',
          discountType: 'percentage',
          discountValue: 30,
          minimumPurchase: 50,
          applicableCategories: [],
          validFrom: new Date(),
          validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          branchId: adminBranchId,
          isActive: true
        },
      ];

      mockPromos.forEach(promo => addPromoCode(promo));
    }

    if (branchLoyaltyPrograms.length === 0) {
      const mockLoyalty: Omit<LoyaltyProgram, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Downtown Rewards',
          description: 'Earn points on every purchase',
          pointsPerDollar: 1,
          redemptionRate: 0.01,
          minimumPoints: 100,
          expiryDays: 365,
          branchId: adminBranchId,
          isActive: true
        },
      ];

      mockLoyalty.forEach(program => addLoyaltyProgram(program));
    }

    if (branchCashbackPrograms.length === 0) {
      const mockCashback: Omit<CashbackProgram, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Cashback Rewards',
          description: 'Get cashback on purchases over $100',
          cashbackType: 'percentage',
          cashbackValue: 5,
          minimumPurchase: 100,
          applicableCategories: [],
          validFrom: new Date(),
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          branchId: adminBranchId,
          isActive: true
        },
      ];

      mockCashback.forEach(program => addCashbackProgram(program));
    }
  }, [branchOffers.length, branchPromoCodes.length, branchLoyaltyPrograms.length, branchCashbackPrograms.length, services.length]);

  const handleAddOffer = () => {
    if (!offerForm.title.trim()) return;

    const offerData = {
      ...offerForm,
      validFrom: new Date(offerForm.validFrom),
      validTo: new Date(offerForm.validTo),
      usageLimit: offerForm.usageLimit ? parseInt(offerForm.usageLimit) : undefined,
      branchId: adminBranchId,
    };

    if (selectedItem) {
      updateOffer(selectedItem.id, offerData);
    } else {
      addOffer(offerData);
    }

    setOfferDialogOpen(false);
    resetForms();
  };

  const handleAddPromoCode = () => {
    if (!promoForm.code.trim()) return;

    addPromoCode({
      ...promoForm,
      minimumPurchase: promoForm.minimumPurchase ? parseFloat(promoForm.minimumPurchase) : undefined,
      maximumDiscount: promoForm.maximumDiscount ? parseFloat(promoForm.maximumDiscount) : undefined,
      validFrom: new Date(promoForm.validFrom),
      validTo: new Date(promoForm.validTo),
      usageLimit: promoForm.usageLimit ? parseInt(promoForm.usageLimit) : undefined,
      branchId: adminBranchId,
    });

    setPromoDialogOpen(false);
    resetForms();
  };

  const handleAddLoyaltyProgram = () => {
    if (!loyaltyForm.name.trim()) return;

    addLoyaltyProgram({
      ...loyaltyForm,
      maximumPoints: loyaltyForm.maximumPoints ? parseInt(loyaltyForm.maximumPoints) : undefined,
      branchId: adminBranchId,
    });

    setLoyaltyDialogOpen(false);
    resetForms();
  };

  const handleAddCashbackProgram = () => {
    if (!cashbackForm.name.trim()) return;

    addCashbackProgram({
      ...cashbackForm,
      minimumPurchase: cashbackForm.minimumPurchase ? parseFloat(cashbackForm.minimumPurchase) : undefined,
      validFrom: new Date(cashbackForm.validFrom),
      validTo: new Date(cashbackForm.validTo),
      branchId: adminBranchId,
    });

    setCashbackDialogOpen(false);
    resetForms();
  };

  const handleSaveLoyaltySettings = () => {
    if (branchLoyaltySettings) {
      // Update existing branch settings
      updateLoyaltySettings(branchLoyaltySettings.id, {
        ...loyaltySettingsForm,
        branchId: adminBranchId,
      });
    } else {
      // Create new branch-specific settings
      addLoyaltySettings({
        ...loyaltySettingsForm,
        branchId: adminBranchId,
      });
    }
    setLoyaltySettingsDialogOpen(false);
  };

  const openEditDialog = (item: any, type: typeof dialogType) => {
    setSelectedItem(item);
    setDialogType(type);

    switch (type) {
      case 'offer':
        setOfferForm({
          title: item.title,
          description: item.description,
          type: item.type,
          discountType: item.discountType,
          discountValue: item.discountValue,
          applicableItems: item.applicableItems,
          applicableServices: item.applicableServices || [],
          offerFor: item.offerFor || 'single',
          image: item.image || '',
          validFrom: item.validFrom.toISOString().split('T')[0],
          validTo: item.validTo.toISOString().split('T')[0],
          usageLimit: item.usageLimit?.toString() || '',
          isActive: item.isActive
        });
        setOfferDialogOpen(true);
        break;
      case 'promo':
        setPromoForm({
          code: item.code,
          description: item.description,
          discountType: item.discountType,
          discountValue: item.discountValue,
          minimumPurchase: item.minimumPurchase?.toString() || '',
          maximumDiscount: item.maximumDiscount?.toString() || '',
          applicableCategories: item.applicableCategories,
          validFrom: item.validFrom.toISOString().split('T')[0],
          validTo: item.validTo.toISOString().split('T')[0],
          usageLimit: item.usageLimit?.toString() || '',
          isActive: item.isActive
        });
        setPromoDialogOpen(true);
        break;
    }
  };

  const openDeleteDialog = (item: any, type: typeof dialogType) => {
    setSelectedItem(item);
    setDialogType(type);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedItem) return;

    switch (dialogType) {
      case 'offer':
        deleteOffer(selectedItem.id);
        break;
      case 'promo':
        deletePromoCode(selectedItem.id);
        break;
      case 'loyalty':
        deleteLoyaltyProgram(selectedItem.id);
        break;
      case 'cashback':
        deleteCashbackProgram(selectedItem.id);
        break;
    }

    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <AdminSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Mobile Sidebar */}
        <AdminMobileSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <AdminMobileSidebar
                role="branch_admin"
                onLogout={handleLogout}
              />
              <h1 className="text-lg font-semibold text-gray-900">Membership & Offers</h1>
              <div className="w-8" />
            </div>
          </div>

          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>
                <p className="text-gray-600">Manage offers, promo codes, loyalty programs, and cashback for your branch</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <Tabs defaultValue="offers" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="offers" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Offers
                </TabsTrigger>
                <TabsTrigger value="promo-codes" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Promo Codes
                </TabsTrigger>
                <TabsTrigger value="loyalty" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Loyalty Points
                </TabsTrigger>
                <TabsTrigger value="cashback" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cashback
                </TabsTrigger>
                <TabsTrigger value="loyalty-settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Offers Tab */}
              <TabsContent value="offers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Special Offers</h2>
                    <p className="text-gray-600">Create and manage special offers for your customers</p>
                  </div>
                  <Button onClick={() => setOfferDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Offer
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredOffers().map((offer) => (
                    <Card key={offer.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-gray-100 group">
                      {/* Offer Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        {offer.image ? (
                          <Image
                            src={offer.image}
                            alt={offer.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-linear-to-br from-blue-50 to-indigo-50">
                            <Gift className="w-12 h-12 text-blue-200" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className={cn(
                            "shadow-sm border-2",
                            offer.isActive ? "bg-green-500 hover:bg-green-600 border-green-200" : "bg-gray-500 hover:bg-gray-600 border-gray-200"
                          )}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-blue-700 border-blue-100 shadow-sm">
                            {getOfferTypeLabel(offer.type)}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {offer.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              {offer.offerFor === 'series' && (
                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                  Series Offer
                                </Badge>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-full w-8 h-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => openEditDialog(offer, 'offer')} className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                                Edit Offer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateOffer(offer.id, { isActive: !offer.isActive })}
                                className="cursor-pointer"
                              >
                                {offer.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2 text-orange-600" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2 text-green-600" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(offer, 'offer')}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Offer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[40px]">
                          {offer.description}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Percent className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-600">Discount</span>
                            </div>
                            <span className="text-lg font-bold text-blue-700">
                              {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-3 h-3 text-orange-600" />
                                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Expires</span>
                              </div>
                              <p className="text-xs font-semibold text-orange-900">
                                {offer.validTo instanceof Date ? offer.validTo.toLocaleDateString() : new Date(offer.validTo).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-3 h-3 text-purple-600" />
                                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Usage</span>
                              </div>
                              <p className="text-xs font-semibold text-purple-900">
                                {offer.usedCount}{offer.usageLimit ? ` / ${offer.usageLimit}` : ' (Unlimited)'}
                              </p>
                            </div>
                          </div>

                          {offer.applicableServices && offer.applicableServices.length > 0 && (
                            <div className="pt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Check className="w-3 h-3 text-green-600" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Applicable Services</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {offer.applicableServices.slice(0, 3).map(id => (
                                  <Badge key={id} variant="outline" className="text-[10px] py-0 h-5 bg-white">
                                    {services.find(s => s.id === id)?.name || id}
                                  </Badge>
                                ))}
                                {offer.applicableServices.length > 3 && (
                                  <Badge variant="outline" className="text-[10px] py-0 h-5 bg-white">
                                    +{offer.applicableServices.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Promo Codes Tab */}
              <TabsContent value="promo-codes" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Promo Codes</h2>
                    <p className="text-gray-600">Create discount codes for your branch</p>
                  </div>
                  <Button onClick={() => setPromoDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Promo Code
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredPromoCodes().map((promo) => (
                    <Card key={promo.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-mono">{promo.code}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={promo.isActive ? 'default' : 'outline'}>
                                {promo.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(promo, 'promo')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updatePromoCode(promo.id, { isActive: !promo.isActive })}
                              >
                                {promo.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(promo, 'promo')}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-medium">
                              {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                            </span>
                          </div>
                          {promo.minimumPurchase && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Min. Purchase:</span>
                              <span className="font-medium">${promo.minimumPurchase}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valid until:</span>
                            <span className="font-medium">{promo.validTo.toLocaleDateString()}</span>
                          </div>
                          {promo.usageLimit && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Usage:</span>
                              <span className="font-medium">{promo.usedCount}/{promo.usageLimit}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Loyalty Tab */}
              <TabsContent value="loyalty" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Loyalty Programs</h2>
                    <p className="text-gray-600">Manage customer loyalty points programs</p>
                  </div>
                  <Button onClick={() => setLoyaltyDialogOpen(true)} className="bg-yellow-600 hover:bg-yellow-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Loyalty Program
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredLoyaltyPrograms().map((program) => (
                    <Card key={program.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{program.name}</CardTitle>
                            <Badge variant={program.isActive ? 'default' : 'outline'} className="mt-2">
                              {program.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(program, 'loyalty')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateLoyaltyProgram(program.id, { isActive: !program.isActive })}
                              >
                                {program.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(program, 'loyalty')}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Points per $:</span>
                            <span className="font-medium">{program.pointsPerDollar}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Redemption Rate:</span>
                            <span className="font-medium">${program.redemptionRate}/point</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Min. Points:</span>
                            <span className="font-medium">{program.minimumPoints}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expiry:</span>
                            <span className="font-medium">{program.expiryDays} days</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Cashback Tab */}
              <TabsContent value="cashback" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Cashback Programs</h2>
                    <p className="text-gray-600">Set up cashback rewards for customers</p>
                  </div>
                  <Button onClick={() => setCashbackDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Cashback Program
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredCashbackPrograms().map((program) => (
                    <Card key={program.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{program.name}</CardTitle>
                            <Badge variant={program.isActive ? 'default' : 'outline'} className="mt-2">
                              {program.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(program, 'cashback')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateCashbackProgram(program.id, { isActive: !program.isActive })}
                              >
                                {program.isActive ? (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(program, 'cashback')}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Cashback:</span>
                            <span className="font-medium">
                              {program.cashbackType === 'percentage' ? `${program.cashbackValue}%` : `$${program.cashbackValue}`}
                            </span>
                          </div>
                          {program.minimumPurchase && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Min. Purchase:</span>
                              <span className="font-medium">${program.minimumPurchase}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valid until:</span>
                            <span className="font-medium">{program.validTo.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Loyalty Settings Tab */}
              <TabsContent value="loyalty-settings" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Loyalty Points Settings</h2>
                    <p className="text-gray-600">Configure how customers earn and redeem loyalty points at your branch</p>
                  </div>
                  <Badge variant={currentLoyaltySettings?.isActive ? 'default' : 'secondary'}>
                    {branchLoyaltySettings ? 'Branch Settings' : 'Using Global Settings'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Settings Card */}
                  <Card className="border-2 border-yellow-200 bg-yellow-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        Current Active Settings
                      </CardTitle>
                      <CardDescription>
                        {branchLoyaltySettings 
                          ? 'Custom settings configured for your branch' 
                          : 'Using default global settings (customize below)'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Points per $1 Spent</p>
                          <p className="text-2xl font-bold text-yellow-600">{currentLoyaltySettings?.pointsPerDollarSpent || 10}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Point Value</p>
                          <p className="text-2xl font-bold text-green-600">${currentLoyaltySettings?.pointsValueInDollars || 0.01}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Min. to Redeem</p>
                          <p className="text-2xl font-bold text-blue-600">{currentLoyaltySettings?.minimumPointsToRedeem || 100}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Max per Transaction</p>
                          <p className="text-2xl font-bold text-purple-600">{currentLoyaltySettings?.maximumPointsPerTransaction || 5000}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">First Booking Bonus</p>
                          <p className="font-semibold text-green-600">+{currentLoyaltySettings?.bonusPointsFirstBooking || 100} pts</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Birthday Bonus</p>
                          <p className="font-semibold text-pink-600">+{currentLoyaltySettings?.bonusPointsOnBirthday || 200} pts</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Points Expiry</p>
                          <p className="font-semibold">{currentLoyaltySettings?.pointsExpiryDays || 365} days</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge variant={currentLoyaltySettings?.isActive ? 'default' : 'secondary'}>
                            {currentLoyaltySettings?.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setLoyaltySettingsDialogOpen(true)} 
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {branchLoyaltySettings ? 'Edit Branch Settings' : 'Create Branch Settings'}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* How It Works Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        How Loyalty Points Work
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="font-medium">Customers Earn Points</p>
                            <p className="text-sm text-gray-600">For every $1 spent, customers earn {currentLoyaltySettings?.pointsPerDollarSpent || 10} loyalty points</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="font-medium">Points Accumulate in Wallet</p>
                            <p className="text-sm text-gray-600">Points are stored in the customer&apos;s digital wallet and can be viewed in their portal</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="font-medium">Redeem for Discounts</p>
                            <p className="text-sm text-gray-600">{currentLoyaltySettings?.minimumPointsToRedeem || 100} points = ${((currentLoyaltySettings?.minimumPointsToRedeem || 100) * (currentLoyaltySettings?.pointsValueInDollars || 0.01)).toFixed(2)} off their next booking</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-yellow-600 font-bold text-sm">4</span>
                          </div>
                          <div>
                            <p className="font-medium">Bonus Points</p>
                            <p className="text-sm text-gray-600">New customers get {currentLoyaltySettings?.bonusPointsFirstBooking || 100} bonus points, plus {currentLoyaltySettings?.bonusPointsOnBirthday || 200} on birthdays!</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Example Calculations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-600 font-medium">$50 Haircut</p>
                          <p className="text-2xl font-bold text-blue-700">+{50 * (currentLoyaltySettings?.pointsPerDollarSpent || 10)} pts</p>
                          <p className="text-xs text-blue-600">Customer earns</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-600 font-medium">{currentLoyaltySettings?.minimumPointsToRedeem || 100} Points Redeemed</p>
                          <p className="text-2xl font-bold text-green-700">${((currentLoyaltySettings?.minimumPointsToRedeem || 100) * (currentLoyaltySettings?.pointsValueInDollars || 0.01)).toFixed(2)} off</p>
                          <p className="text-xs text-green-600">Customer saves</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-600 font-medium">To Earn $10 Credit</p>
                          <p className="text-2xl font-bold text-purple-700">${(10 / (currentLoyaltySettings?.pointsValueInDollars || 0.01) / (currentLoyaltySettings?.pointsPerDollarSpent || 10)).toFixed(0)} spent</p>
                          <p className="text-xs text-purple-600">Customer needs to spend</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Offer Dialog */}
        <Sheet open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700 flex items-end px-8 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-white">
                    {selectedItem ? 'Edit Special Offer' : 'Create New Offer'}
                  </SheetTitle>
                  <SheetDescription className="text-blue-100 text-sm">
                    Configure your promotional offer with custom rules and visuals
                  </SheetDescription>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-10">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Offer Visuals</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">Offer Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={offerForm.image}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setOfferForm(prev => ({ ...prev, image: '' }))}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      Provide a high-quality image URL to showcase this offer to your customers.
                    </p>
                  </div>

                  <div className="relative h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center group">
                    {offerForm.image ? (
                      <>
                        <Image
                          src={offerForm.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Image Preview</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-400 font-medium">No image selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="offer-title" className="text-sm font-semibold text-gray-700">Offer Title</Label>
                    <Input
                      id="offer-title"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Summer Haircut Special"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-description" className="text-sm font-semibold text-gray-700">Description</Label>
                    <Textarea
                      id="offer-description"
                      value={offerForm.description}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the offer and its benefits to attract customers..."
                      className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Offer Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Offer Configuration</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="offer-type" className="text-sm font-semibold text-gray-700">Offer Type</Label>
                    <Select
                      value={offerForm.type}
                      onValueChange={(value: 'service' | 'product' | 'combo' | 'birthday' | 'first_time_registration' | 'promotional_package') =>
                        setOfferForm(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service Discount</SelectItem>
                        <SelectItem value="product">Product Discount</SelectItem>
                        <SelectItem value="combo">Combo Deal</SelectItem>
                        <SelectItem value="birthday">Birthday Special</SelectItem>
                        <SelectItem value="first_time_registration">First Time Registration</SelectItem>
                        <SelectItem value="promotional_package">Promotional Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-discount-type" className="text-sm font-semibold text-gray-700">Discount Type</Label>
                    <Select
                      value={offerForm.discountType}
                      onValueChange={(value: 'percentage' | 'fixed') =>
                        setOfferForm(prev => ({ ...prev, discountType: value }))
                      }
                    >
                      <SelectTrigger className="h-11 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer-discount-value" className="text-sm font-semibold text-gray-700">
                    Discount Value
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                      {offerForm.discountType === 'percentage' ? '%' : '$'}
                    </div>
                    <Input
                      id="offer-discount-value"
                      type="number"
                      value={offerForm.discountValue}
                      onChange={(e) => setOfferForm(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                      placeholder={offerForm.discountType === 'percentage' ? "20" : "10.00"}
                      className="h-11 pl-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Check className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Applicable Services</h3>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Select Services</Label>
                  <div className="border-2 border-gray-100 rounded-2xl p-4 bg-gray-50/50 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {services.map((service) => (
                        <div 
                          key={service.id} 
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer border-2",
                            offerForm.applicableServices.includes(service.id) 
                              ? "bg-white border-blue-200 shadow-sm" 
                              : "bg-transparent border-transparent hover:bg-white/50"
                          )}
                          onClick={() => {
                            const serviceId = service.id;
                            setOfferForm(prev => ({
                              ...prev,
                              applicableServices: prev.applicableServices.includes(serviceId)
                                ? prev.applicableServices.filter(id => id !== serviceId)
                                : [...prev.applicableServices, serviceId]
                            }));
                          }}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                            offerForm.applicableServices.includes(service.id)
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          )}>
                            {offerForm.applicableServices.includes(service.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">${service.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {services.length === 0 && (
                      <div className="text-center py-10">
                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">No services found for this branch</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                      Select specific services this offer applies to. If none are selected, the offer will be applicable to all services by default.
                    </p>
                  </div>
                </div>
              </div>

              {/* Validity Period Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Validity Period</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="offer-valid-from" className="text-sm font-semibold text-gray-700">Valid From</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="offer-valid-from"
                        type="date"
                        value={offerForm.validFrom}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, validFrom: e.target.value }))}
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offer-valid-to" className="text-sm font-semibold text-gray-700">Valid To</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="offer-valid-to"
                        type="date"
                        value={offerForm.validTo}
                        onChange={(e) => setOfferForm(prev => ({ ...prev, validTo: e.target.value }))}
                        className="h-11 pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900">Offer Status</h4>
                    <p className="text-xs text-gray-500 font-medium">Enable or disable this offer for customers</p>
                  </div>
                  <div 
                    className={cn(
                      "w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300",
                      offerForm.isActive ? "bg-blue-600" : "bg-gray-300"
                    )}
                    onClick={() => setOfferForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                  >
                    <div className={cn(
                      "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
                      offerForm.isActive ? "translate-x-7" : "translate-x-0"
                    )} />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-6 border-t border-gray-100 flex justify-end space-x-3 z-10">
              <Button variant="outline" onClick={() => setOfferDialogOpen(false)} className="px-8 h-11 font-semibold border-2">
                Cancel
              </Button>
              <Button 
                onClick={handleAddOffer} 
                className="px-8 h-11 font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                {selectedItem ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Promo Code Dialog */}
        <Sheet open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="border-b border-gray-200 pb-6 mb-6">
              <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                Add Promo Code
              </SheetTitle>
              <SheetDescription className="text-gray-600">
                Create a new promotional code with custom discounts and usage limits.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="promo-code" className="text-sm font-medium text-gray-700">Promo Code</Label>
                    <Input
                      id="promo-code"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g., WELCOME20"
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="promo-description"
                      value={promoForm.description}
                      onChange={(e) => setPromoForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this promo code offers"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Discount Configuration</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="promo-discount-type" className="text-sm font-medium text-gray-700">Discount Type</Label>
                    <Select
                      value={promoForm.discountType}
                      onValueChange={(value: 'percentage' | 'fixed') =>
                        setPromoForm(prev => ({ ...prev, discountType: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="promo-discount-value" className="text-sm font-medium text-gray-700">
                      Discount Value ({promoForm.discountType === 'percentage' ? '%' : '$'})
                    </Label>
                    <Input
                      id="promo-discount-value"
                      type="number"
                      value={promoForm.discountValue}
                      onChange={(e) => setPromoForm(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                      placeholder={promoForm.discountType === 'percentage' ? "20" : "10.00"}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="promo-minimum-purchase" className="text-sm font-medium text-gray-700">Minimum Purchase ($)</Label>
                  <Input
                    id="promo-minimum-purchase"
                    type="number"
                    value={promoForm.minimumPurchase}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, minimumPurchase: e.target.value }))}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Usage Limits Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Users className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Usage Limits</h3>
                </div>
                <div>
                  <Label htmlFor="promo-max-uses" className="text-sm font-medium text-gray-700">Max Uses (Total)</Label>
                  <Input
                    id="promo-max-uses"
                    type="number"
                    value={promoForm.usageLimit}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="Unlimited"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of times this promo code can be used</p>
                </div>
              </div>

              {/* Validity Period Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Validity Period</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="promo-valid-from" className="text-sm font-medium text-gray-700">Valid From</Label>
                    <Input
                      id="promo-valid-from"
                      type="date"
                      value={promoForm.validFrom}
                      onChange={(e) => setPromoForm(prev => ({ ...prev, validFrom: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-valid-to" className="text-sm font-medium text-gray-700">Valid To</Label>
                    <Input
                      id="promo-valid-to"
                      type="date"
                      value={promoForm.validTo}
                      onChange={(e) => setPromoForm(prev => ({ ...prev, validTo: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="promo-active"
                    checked={promoForm.isActive}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <Label htmlFor="promo-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Activate this promo code immediately
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
              <Button variant="outline" onClick={() => setPromoDialogOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleAddPromoCode} className="px-6 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Promo Code
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Loyalty Dialog */}
        <Sheet open={loyaltyDialogOpen} onOpenChange={setLoyaltyDialogOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="border-b border-gray-200 pb-6 mb-6">
              <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Add Loyalty Program
              </SheetTitle>
              <SheetDescription className="text-gray-600">
                Create a loyalty points program to reward customer purchases and encourage repeat business.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="loyalty-name" className="text-sm font-medium text-gray-700">Program Name</Label>
                    <Input
                      id="loyalty-name"
                      value={loyaltyForm.name}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Premium Rewards"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loyalty-description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="loyalty-description"
                      value={loyaltyForm.description}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe how customers can earn and redeem points"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Points Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Points Configuration</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loyalty-points-per-dollar" className="text-sm font-medium text-gray-700">Points per Dollar</Label>
                    <Input
                      id="loyalty-points-per-dollar"
                      type="number"
                      value={loyaltyForm.pointsPerDollar}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, pointsPerDollar: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Points earned per $1 spent</p>
                  </div>
                  <div>
                    <Label htmlFor="loyalty-redemption-rate" className="text-sm font-medium text-gray-700">Redemption Rate</Label>
                    <Input
                      id="loyalty-redemption-rate"
                      type="number"
                      step="0.01"
                      value={loyaltyForm.redemptionRate}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, redemptionRate: parseFloat(e.target.value) || 0.01 }))}
                      placeholder="0.01"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">$ value per point redeemed</p>
                  </div>
                </div>
              </div>

              {/* Redemption Rules Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Award className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Redemption Rules</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loyalty-min-points" className="text-sm font-medium text-gray-700">Minimum Points for Redemption</Label>
                    <Input
                      id="loyalty-min-points"
                      type="number"
                      value={loyaltyForm.minimumPoints}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, minimumPoints: parseInt(e.target.value) || 100 }))}
                      placeholder="100"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum points required to redeem</p>
                  </div>
                  <div>
                    <Label htmlFor="loyalty-expiry" className="text-sm font-medium text-gray-700">Points Expiry (days)</Label>
                    <Input
                      id="loyalty-expiry"
                      type="number"
                      value={loyaltyForm.expiryDays}
                      onChange={(e) => setLoyaltyForm(prev => ({ ...prev, expiryDays: parseInt(e.target.value) || 365 }))}
                      placeholder="365"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days until points expire</p>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="loyalty-active"
                    checked={loyaltyForm.isActive}
                    onChange={(e) => setLoyaltyForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <Label htmlFor="loyalty-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Activate this loyalty program immediately
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
              <Button variant="outline" onClick={() => setLoyaltyDialogOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleAddLoyaltyProgram} className="px-6 bg-yellow-600 hover:bg-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Cashback Dialog */}
        <Sheet open={cashbackDialogOpen} onOpenChange={setCashbackDialogOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="border-b border-gray-200 pb-6 mb-6">
              <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Add Cashback Program
              </SheetTitle>
              <SheetDescription className="text-gray-600">
                Create a cashback rewards program to give customers money back on their purchases.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="cashback-name" className="text-sm font-medium text-gray-700">Program Name</Label>
                    <Input
                      id="cashback-name"
                      value={cashbackForm.name}
                      onChange={(e) => setCashbackForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Premium Cashback"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashback-description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="cashback-description"
                      value={cashbackForm.description}
                      onChange={(e) => setCashbackForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe how customers can earn cashback rewards"
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Cashback Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Cashback Configuration</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cashback-type" className="text-sm font-medium text-gray-700">Cashback Type</Label>
                    <Select
                      value={cashbackForm.cashbackType}
                      onValueChange={(value: 'percentage' | 'fixed') =>
                        setCashbackForm(prev => ({ ...prev, cashbackType: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage of Purchase</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cashback-value" className="text-sm font-medium text-gray-700">
                      Cashback Value ({cashbackForm.cashbackType === 'percentage' ? '%' : '$'})
                    </Label>
                    <Input
                      id="cashback-value"
                      type="number"
                      value={cashbackForm.cashbackValue}
                      onChange={(e) => setCashbackForm(prev => ({ ...prev, cashbackValue: parseFloat(e.target.value) || 0 }))}
                      placeholder={cashbackForm.cashbackType === 'percentage' ? "5" : "10.00"}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cashback-minimum-purchase" className="text-sm font-medium text-gray-700">Minimum Purchase ($)</Label>
                  <Input
                    id="cashback-minimum-purchase"
                    type="number"
                    value={cashbackForm.minimumPurchase}
                    onChange={(e) => setCashbackForm(prev => ({ ...prev, minimumPurchase: e.target.value }))}
                    placeholder="100.00"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum purchase amount required to earn cashback</p>
                </div>
              </div>

              {/* Validity Period Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Validity Period</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cashback-valid-from" className="text-sm font-medium text-gray-700">Valid From</Label>
                    <Input
                      id="cashback-valid-from"
                      type="date"
                      value={cashbackForm.validFrom}
                      onChange={(e) => setCashbackForm(prev => ({ ...prev, validFrom: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashback-valid-to" className="text-sm font-medium text-gray-700">Valid To</Label>
                    <Input
                      id="cashback-valid-to"
                      type="date"
                      value={cashbackForm.validTo}
                      onChange={(e) => setCashbackForm(prev => ({ ...prev, validTo: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cashback-active"
                    checked={cashbackForm.isActive}
                    onChange={(e) => setCashbackForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="cashback-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Activate this cashback program immediately
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
              <Button variant="outline" onClick={() => setCashbackDialogOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleAddCashbackProgram} className="px-6 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Program
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Delete Confirmation Dialog */}
        <Sheet open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Confirm Deletion</SheetTitle>
              <SheetDescription>
                Are you sure you want to delete this {dialogType}? This action cannot be undone.
              </SheetDescription>
            </SheetHeader>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Loyalty Settings Dialog */}
        <Sheet open={loyaltySettingsDialogOpen} onOpenChange={setLoyaltySettingsDialogOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="border-b border-gray-200 pb-6 mb-6">
              <SheetTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-yellow-600" />
                {branchLoyaltySettings ? 'Edit Loyalty Settings' : 'Create Branch Loyalty Settings'}
              </SheetTitle>
              <SheetDescription className="text-gray-600">
                Configure how customers earn and redeem loyalty points at your branch. These settings will override global settings.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-8">
              {/* Points Earning Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <h3 className="text-sm font-medium text-gray-900">Points Earning</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-points-per-dollar" className="text-sm font-medium text-gray-700">
                      Points per $1 Spent
                    </Label>
                    <Input
                      id="settings-points-per-dollar"
                      type="number"
                      value={loyaltySettingsForm.pointsPerDollarSpent}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        pointsPerDollarSpent: parseInt(e.target.value) || 1 
                      }))}
                      placeholder="10"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">How many points customers earn for each $1 spent</p>
                  </div>
                  <div>
                    <Label htmlFor="settings-point-value" className="text-sm font-medium text-gray-700">
                      Point Value ($)
                    </Label>
                    <Input
                      id="settings-point-value"
                      type="number"
                      step="0.001"
                      value={loyaltySettingsForm.pointsValueInDollars}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        pointsValueInDollars: parseFloat(e.target.value) || 0.01 
                      }))}
                      placeholder="0.01"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Dollar value of each point (e.g., 0.01 = 1¢ per point)</p>
                  </div>
                </div>
              </div>

              {/* Redemption Rules Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Award className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-900">Redemption Rules</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-min-redeem" className="text-sm font-medium text-gray-700">
                      Minimum Points to Redeem
                    </Label>
                    <Input
                      id="settings-min-redeem"
                      type="number"
                      value={loyaltySettingsForm.minimumPointsToRedeem}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        minimumPointsToRedeem: parseInt(e.target.value) || 100 
                      }))}
                      placeholder="100"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum points required before redemption</p>
                  </div>
                  <div>
                    <Label htmlFor="settings-max-per-txn" className="text-sm font-medium text-gray-700">
                      Maximum Points per Transaction
                    </Label>
                    <Input
                      id="settings-max-per-txn"
                      type="number"
                      value={loyaltySettingsForm.maximumPointsPerTransaction}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        maximumPointsPerTransaction: parseInt(e.target.value) || 5000 
                      }))}
                      placeholder="5000"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max points redeemable in a single transaction</p>
                  </div>
                </div>
              </div>

              {/* Bonus Points Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Gift className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-medium text-gray-900">Bonus Points</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-first-booking" className="text-sm font-medium text-gray-700">
                      First Booking Bonus
                    </Label>
                    <Input
                      id="settings-first-booking"
                      type="number"
                      value={loyaltySettingsForm.bonusPointsFirstBooking}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        bonusPointsFirstBooking: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="100"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Bonus points for new customer registration</p>
                  </div>
                  <div>
                    <Label htmlFor="settings-birthday" className="text-sm font-medium text-gray-700">
                      Birthday Bonus
                    </Label>
                    <Input
                      id="settings-birthday"
                      type="number"
                      value={loyaltySettingsForm.bonusPointsOnBirthday}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        bonusPointsOnBirthday: parseInt(e.target.value) || 0 
                      }))}
                      placeholder="200"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Bonus points awarded on customer&apos;s birthday</p>
                  </div>
                </div>
              </div>

              {/* Expiry & Status Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-medium text-gray-900">Expiry & Status</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="settings-expiry" className="text-sm font-medium text-gray-700">
                      Points Expiry (Days)
                    </Label>
                    <Input
                      id="settings-expiry"
                      type="number"
                      value={loyaltySettingsForm.pointsExpiryDays}
                      onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                        ...prev, 
                        pointsExpiryDays: parseInt(e.target.value) || 365 
                      }))}
                      placeholder="365"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Days until points expire (0 = never)</p>
                  </div>
                  <div className="flex items-end pb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="settings-active"
                        checked={loyaltySettingsForm.isActive}
                        onChange={(e) => setLoyaltySettingsForm(prev => ({ 
                          ...prev, 
                          isActive: e.target.checked 
                        }))}
                        className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <Label htmlFor="settings-active" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Enable loyalty points program
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Preview</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>• Customer spends $100 → Earns <strong>{100 * loyaltySettingsForm.pointsPerDollarSpent} points</strong></p>
                  <p>• {loyaltySettingsForm.minimumPointsToRedeem} points redeemed → <strong>${(loyaltySettingsForm.minimumPointsToRedeem * loyaltySettingsForm.pointsValueInDollars).toFixed(2)} discount</strong></p>
                  <p>• New customer bonus: <strong>{loyaltySettingsForm.bonusPointsFirstBooking} points</strong> (${(loyaltySettingsForm.bonusPointsFirstBooking * loyaltySettingsForm.pointsValueInDollars).toFixed(2)} value)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-8">
              <Button variant="outline" onClick={() => setLoyaltySettingsDialogOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleSaveLoyaltySettings} className="px-6 bg-yellow-600 hover:bg-yellow-700">
                <Check className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ProtectedRoute>
  );
}
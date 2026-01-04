'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  Package,
  Wallet,
  Star,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  ChevronRight,
  Gift,
  Award,
  CreditCard,
  History,
  User,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useCustomerStore, type Customer, type CustomerWallet } from '@/stores/customer.store';
import { formatDistanceToNow } from 'date-fns';

interface CustomerFeedback {
  id: string;
  serviceOrProduct: string;
  rating: number;
  comment: string;
  createdAt: Date;
  status: 'approved' | 'pending' | 'rejected';
  adminReply?: string;
}

export default function CustomerPortal() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [wallet, setWallet] = useState<CustomerWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackService, setFeedbackService] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const {
    getCustomerByEmail,
    getWalletByCustomerId,
    getBookingsByCustomer,
    getOrdersByCustomer,
    getTransactionsByCustomer,
    getActiveLoyaltySettings,
    calculatePointsValue,
  } = useCustomerStore();

  // Mock feedbacks
  useEffect(() => {
    const mockFeedbacks: CustomerFeedback[] = [
      {
        id: 'fb-1',
        serviceOrProduct: 'Hair Spa Treatment',
        rating: 5,
        comment: 'Excellent service! Very relaxing and professional staff.',
        createdAt: new Date('2025-12-01T10:00:00'),
        status: 'approved',
        adminReply: 'Thank you for your kind words! We look forward to seeing you again.'
      },
      {
        id: 'fb-2',
        serviceOrProduct: 'Premium Face Pack',
        rating: 4,
        comment: 'Great results, will definitely come back.',
        createdAt: new Date('2025-11-30T15:30:00'),
        status: 'approved'
      }
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('customerAuth');
      if (!authData) {
        router.push('/customer/login');
        return;
      }

      try {
        const { isAuthenticated, customer: customerData } = JSON.parse(authData);
        if (!isAuthenticated) {
          router.push('/customer/login');
          return;
        }

        // Get full customer data from store
        const fullCustomer = getCustomerByEmail(customerData.email);
        if (fullCustomer) {
          setCustomer(fullCustomer);
          const customerWallet = getWalletByCustomerId(fullCustomer.id);
          setWallet(customerWallet || null);
        } else {
          // Create a temporary customer object for display
          setCustomer({
            id: 'temp-' + customerData.email,
            email: customerData.email,
            name: customerData.name,
            phone: customerData.phone,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        router.push('/customer/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, getCustomerByEmail, getWalletByCustomerId]);

  const handleLogout = () => {
    localStorage.removeItem('customerAuth');
    router.push('/customer/login');
  };

  const handleAddFeedback = () => {
    if (!feedbackComment.trim() || !feedbackService.trim()) return;

    const newFeedback: CustomerFeedback = {
      id: 'fb-' + Date.now(),
      serviceOrProduct: feedbackService,
      rating: feedbackRating,
      comment: feedbackComment,
      createdAt: new Date(),
      status: 'pending'
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedbackComment('');
    setFeedbackService('');
    setFeedbackRating(5);
    setShowFeedbackForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  const bookings = customer.id ? getBookingsByCustomer(customer.id) : [];
  const orders = customer.id ? getOrdersByCustomer(customer.id) : [];
  const transactions = customer.id ? getTransactionsByCustomer(customer.id) : [];
  const loyaltySettings = getActiveLoyaltySettings();
  const walletPointsValue = wallet ? calculatePointsValue(wallet.loyaltyPoints) : 0;

  const recentBookings = bookings.slice(0, 3);
  const recentOrders = orders.slice(0, 3);
  const recentTransactions = transactions.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-secondary">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-secondary text-primary text-xl font-bold">
                    {customer.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white/60 text-sm font-medium">Welcome back,</p>
                  <h1 className="text-2xl font-serif font-bold">{customer.name}</h1>
                  <p className="text-white/60 text-sm">{customer.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/customer/portal/profile">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Wallet Balance</p>
                    <p className="text-3xl font-bold text-primary">${wallet?.balance?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Available to spend</p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Loyalty Points</p>
                    <p className="text-3xl font-bold text-secondary">{wallet?.loyaltyPoints?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Worth ${walletPointsValue.toFixed(2)}</p>
                  </div>
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                    <Star className="w-7 h-7 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-primary">{bookings.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{bookings.filter(b => b.status === 'completed').length} completed</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Product Orders</p>
                    <p className="text-3xl font-bold text-primary">{orders.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{orders.filter(o => o.status === 'delivered').length} delivered</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Bookings */}
              <Card className="border-none shadow-lg rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif">Recent Bookings</CardTitle>
                    <CardDescription>Your latest service appointments</CardDescription>
                  </div>
                  <Link href="/customer/portal/bookings">
                    <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Link href="/services">
                        <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
                          Book a Service
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{booking.services.map(s => s.serviceName).join(', ')}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {booking.date} at {booking.time}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                              {booking.status}
                            </Badge>
                            <p className="text-sm font-bold text-primary mt-1">${booking.totalAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="border-none shadow-lg rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
                    <CardDescription>Your latest product purchases</CardDescription>
                  </div>
                  <Link href="/customer/portal/orders">
                    <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Link href="/products">
                        <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
                          Shop Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{order.products.length} item(s)</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} capitalize`}>
                              {order.status}
                            </Badge>
                            <p className="text-sm font-bold text-primary mt-1">${order.totalAmount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Loyalty & Transactions */}
            <div className="space-y-6">
              {/* Loyalty Card */}
              <Card className="border-none shadow-lg rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-primary">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Loyalty Rewards</span>
                  </div>
                  <div className="mb-6">
                    <p className="text-4xl font-bold">{wallet?.loyaltyPoints?.toLocaleString() || '0'}</p>
                    <p className="text-sm opacity-80">Available Points</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-2xl font-bold">{wallet?.totalPointsEarned?.toLocaleString() || '0'}</p>
                      <p className="text-xs opacity-80">Total Earned</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-2xl font-bold">${walletPointsValue.toFixed(2)}</p>
                      <p className="text-xs opacity-80">Points Value</p>
                    </div>
                  </div>
                  <Link href="/customer/portal/loyalty">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
                      <Gift className="w-4 h-4 mr-2" />
                      Redeem Points
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-none shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-serif flex items-center gap-2">
                    <History className="w-5 h-5 text-secondary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              txn.type === 'points_earned' || txn.type === 'wallet_topup' 
                                ? 'bg-green-100' 
                                : 'bg-red-100'
                            }`}>
                              {txn.type === 'points_earned' || txn.type === 'wallet_topup' ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-600 rotate-180" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[150px]">{txn.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(txn.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {txn.pointsAmount && (
                              <p className={`text-sm font-bold ${txn.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.pointsAmount > 0 ? '+' : ''}{txn.pointsAmount} pts
                              </p>
                            )}
                            {txn.amount !== 0 && (
                              <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href="/customer/portal/transactions">
                    <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                      View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-none shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Link href="/services">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl hover:bg-secondary hover:text-primary hover:border-secondary">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs font-bold">Book Service</span>
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl hover:bg-secondary hover:text-primary hover:border-secondary">
                      <Package className="w-5 h-5" />
                      <span className="text-xs font-bold">Shop Products</span>
                    </Button>
                  </Link>
                  <Link href="/customer/portal/loyalty">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl hover:bg-secondary hover:text-primary hover:border-secondary">
                      <Gift className="w-5 h-5" />
                      <span className="text-xs font-bold">Redeem Points</span>
                    </Button>
                  </Link>
                  <Link href="/customer/portal/profile">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 rounded-xl hover:bg-secondary hover:text-primary hover:border-secondary">
                      <User className="w-5 h-5" />
                      <span className="text-xs font-bold">My Profile</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feedbacks Section */}
          <Card className="border-none shadow-lg rounded-2xl mt-8">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-lg font-serif">My Feedbacks & Reviews</CardTitle>
              </div>
              <Button
                size="sm"
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl"
              >
                + Submit Feedback
              </Button>
            </CardHeader>

            <CardContent>
              {showFeedbackForm && (
                <div className="mb-6 p-4 border rounded-xl bg-secondary/5 border-secondary/20">
                  <h3 className="font-bold mb-4">Share Your Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Service/Product Name *</label>
                      <Input
                        placeholder="What service or product did you use?"
                        value={feedbackService}
                        onChange={(e) => setFeedbackService(e.target.value)}
                        className="mt-1 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rating (1-5) *</label>
                      <div className="flex gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Button
                            key={num}
                            size="sm"
                            variant={feedbackRating === num ? 'default' : 'outline'}
                            onClick={() => setFeedbackRating(num)}
                            className="w-10 h-10 p-0 rounded-lg"
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Your Review *</label>
                      <Input
                        placeholder="Share your experience..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="mt-1 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddFeedback}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        Submit Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowFeedbackForm(false)}
                        className="rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-base">{feedback.serviceOrProduct}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedback.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{feedback.rating}/5</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`rounded-full ${
                            feedback.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : feedback.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-700 text-sm italic mb-2">"{feedback.comment}"</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(feedback.createdAt, { addSuffix: true })}
                      </p>

                      {feedback.adminReply && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs font-bold text-blue-900 mb-1">Admin Reply:</p>
                          <p className="text-sm text-blue-800">{feedback.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No feedbacks yet</p>
                  <p className="text-sm text-gray-500">Share your experience with services or products</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


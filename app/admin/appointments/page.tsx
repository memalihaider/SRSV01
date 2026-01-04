'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, User, Search, Filter, CheckCircle, XCircle, AlertCircle, Bell, Smartphone, Globe, Plus, Edit, Trash2, Phone, Mail, RefreshCw, FileText, Scissors, Package, DollarSign, Receipt, CheckCircle2, Eye, Play, Star, FileCheck, Download, Printer, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdvancedCalendar } from "@/components/ui/advanced-calendar";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";
import { useCurrencyStore } from "@/stores/currency.store";
import { useBookingStore } from "@/stores/booking.store";
import { useBranchStore } from "@/stores/branch.store";
import { cn } from "@/lib/utils";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { getTemplate, InvoiceData } from "@/components/invoice-templates";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminAppointments() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { formatCurrency } = useCurrencyStore();
  const { getConfirmedBookings } = useBookingStore();
  const { branches, getBranchByName } = useBranchStore();
  const { addNotification } = useNotifications();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'advanced-calendar' | 'list' | 'approvals' | 'product-orders'>('advanced-calendar');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedAppointmentForInvoice, setSelectedAppointmentForInvoice] = useState<any>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bookingData, setBookingData] = useState({
    customer: '',
    phone: '',
    email: '',
    service: '',
    barber: '',
    teamMembers: [] as Array<{name: string, tip: number}>,
    date: '',
    time: '',
    notes: '',
    products: [] as Array<{name: string, category: string, price: number, quantity: number}>,
    tax: 5,
    serviceCharges: 0,
    discount: 0,
    discountType: 'fixed' as 'fixed' | 'percentage',
    serviceTip: 0,
    paymentMethods: [] as Array<'cash' | 'card' | 'check' | 'digital'>,
    status: 'pending',
    generateInvoice: false
  });

  // Product Orders State
  const [productOrders, setProductOrders] = useState<any[]>([
    {
      id: 'PO-001',
      customer: 'John Doe',
      products: ['Premium Shampoo', 'Beard Oil'],
      quantity: 3,
      total: 42,
      status: 'completed',
      date: '2026-01-04',
      payment: 'card'
    },
    {
      id: 'PO-002',
      customer: 'Sarah Johnson',
      products: ['Hair Wax', 'Styling Gel'],
      quantity: 2,
      total: 18,
      status: 'completed',
      date: '2026-01-04',
      payment: 'cash'
    },
    {
      id: 'PO-003',
      customer: 'Mike Smith',
      products: ['Hair Clippers'],
      quantity: 1,
      total: 45,
      status: 'pending',
      date: '2026-01-03',
      payment: 'card'
    },
    {
      id: 'PO-004',
      customer: 'Emma Wilson',
      products: ['Face Mask', 'Aftershave'],
      quantity: 2,
      total: 38,
      status: 'pending',
      date: '2026-01-03',
      payment: 'digital'
    },
    {
      id: 'PO-005',
      customer: 'David Brown',
      products: ['Premium Shampoo', 'Hair Brush'],
      quantity: 2,
      total: 40,
      status: 'completed',
      date: '2026-01-02',
      payment: 'card'
    }
  ]);

  const [allowPendingOrders] = useState(true); // This would come from settings page

  // Product Order Actions
  const handleOrderStatusChange = (orderId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'delivered') => {
    if (newStatus === 'pending' && !allowPendingOrders) {
      addNotification({
        type: 'warning',
        title: 'Not Allowed',
        message: 'Pending status is disabled in settings'
      });
      return;
    }

    setProductOrders(productOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    const statusMessages: { [key: string]: string } = {
      pending: 'Order marked as pending',
      approved: 'Order approved successfully',
      rejected: 'Order rejected',
      delivered: 'Order marked as delivered'
    };

    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: statusMessages[newStatus]
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setProductOrders(productOrders.filter(order => order.id !== orderId));
    addNotification({
      type: 'success',
      title: 'Order Deleted',
      message: 'Product order has been removed'
    });
  };

  // Notification system
  const { notifications, markAsRead, dismiss } = useNotifications();

  // Mock products data
  const mockProducts = [
    { name: "Premium Shampoo", category: "Hair Care", price: 15 },
    { name: "Beard Oil", category: "Grooming", price: 12 },
    { name: "Hair Wax", category: "Styling", price: 8 },
    { name: "Face Mask", category: "Skincare", price: 20 },
    { name: "Hair Clippers", category: "Tools", price: 45 },
    { name: "Styling Gel", category: "Styling", price: 10 },
    { name: "Aftershave", category: "Grooming", price: 18 },
    { name: "Hair Brush", category: "Tools", price: 25 }
  ];

  // Helper functions for pricing
  const getServicePrice = (serviceName: string) => {
    const servicePrices: { [key: string]: number } = {
      "Classic Haircut": 35,
      "Beard Trim & Shape": 25,
      "Premium Package": 85,
      "Haircut & Style": 50,
      "Hair Coloring": 120,
      "Facial Treatment": 75
    };
    return servicePrices[serviceName] || 0;
  };

  const calculateTax = () => {
    const servicePrice = getServicePrice(bookingData.service);
    const productsTotal = bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    let subtotal = servicePrice + productsTotal + bookingData.serviceCharges;
    
    // Apply discount to subtotal
    if (bookingData.discount > 0) {
      if (bookingData.discountType === 'percentage') {
        subtotal = subtotal * (1 - bookingData.discount / 100);
      } else {
        subtotal = Math.max(0, subtotal - bookingData.discount);
      }
    }
    
    return ((subtotal * bookingData.tax) / 100).toFixed(2);
  };

  const calculateTotal = () => {
    const servicePrice = getServicePrice(bookingData.service);
    const productsTotal = bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    let subtotal = servicePrice + productsTotal + bookingData.serviceCharges;
    
    // Apply discount to subtotal
    let discountAmount = 0;
    if (bookingData.discount > 0) {
      if (bookingData.discountType === 'percentage') {
        discountAmount = subtotal * (bookingData.discount / 100);
        subtotal = subtotal * (1 - bookingData.discount / 100);
      } else {
        discountAmount = bookingData.discount;
        subtotal = Math.max(0, subtotal - bookingData.discount);
      }
    }
    
    // Calculate tax on discounted subtotal
    const taxAmount = (subtotal * bookingData.tax) / 100;
    
    // Add tips (not subject to tax)
    const totalTips = bookingData.serviceTip + bookingData.teamMembers.reduce((sum, tm) => sum + tm.tip, 0);
    
    return (subtotal + taxAmount + totalTips).toFixed(2);
  };

  // Mock appointments data with more comprehensive data
  const appointments = [
    {
      id: 1,
      customer: "John Doe",
      service: "Classic Haircut",
      barber: "Mike Johnson",
      date: "2026-01-03",
      time: "9:00 AM",
      duration: "30 min",
      price: 35,
      status: "completed",
      phone: "(555) 123-4567",
      email: "john.doe@email.com",
      notes: "Regular customer, prefers fade",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T08:00:00Z",
      updatedAt: "2026-01-03T09:30:00Z"
    },
    {
      id: 2,
      customer: "Jane Smith",
      service: "Beard Trim & Shape",
      barber: "Alex Rodriguez",
      date: "2026-01-03",
      time: "10:00 AM",
      duration: "20 min",
      price: 25,
      status: "in-progress",
      phone: "(555) 234-5678",
      email: "jane.smith@email.com",
      notes: "First time customer",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T14:30:00Z",
      updatedAt: "2026-01-03T10:00:00Z"
    },
    {
      id: 3,
      customer: "Bob Johnson",
      service: "Premium Package",
      barber: "Mike Johnson",
      date: "2026-01-03",
      time: "11:00 AM",
      duration: "60 min",
      price: 85,
      status: "scheduled",
      phone: "(555) 345-6789",
      email: "bob.johnson@email.com",
      notes: "VIP customer, prefers hot towel",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-01T16:45:00Z",
      updatedAt: "2026-01-01T16:45:00Z"
    },
    {
      id: 4,
      customer: "Alice Brown",
      service: "Haircut & Style",
      barber: "Sarah Chen",
      date: "2026-01-03",
      time: "2:00 PM",
      duration: "45 min",
      price: 55,
      status: "scheduled",
      phone: "(555) 456-7890",
      email: "alice.brown@email.com",
      notes: "Color treatment last visit",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T11:20:00Z",
      updatedAt: "2026-01-02T11:20:00Z"
    },
    {
      id: 5,
      customer: "Charlie Wilson",
      service: "Beard Grooming",
      barber: "Alex Rodriguez",
      date: "2026-01-03",
      time: "3:30 PM",
      duration: "25 min",
      price: 30,
      status: "cancelled",
      phone: "(555) 567-8901",
      email: "charlie.wilson@email.com",
      notes: "Emergency cancellation",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T09:15:00Z",
      updatedAt: "2026-01-03T15:00:00Z"
    },
    {
      id: 6,
      customer: "David Lee",
      service: "Classic Haircut",
      barber: "Mike Johnson",
      date: "2026-01-04",
      time: "9:30 AM",
      duration: "30 min",
      price: 35,
      status: "scheduled",
      phone: "(555) 678-9012",
      email: "david.lee@email.com",
      notes: "New customer referral",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T10:30:00Z",
      updatedAt: "2026-01-03T10:30:00Z"
    },
    {
      id: 7,
      customer: "Emma Davis",
      service: "Hair Color",
      barber: "Sarah Chen",
      date: "2026-01-04",
      time: "1:00 PM",
      duration: "90 min",
      price: 120,
      status: "scheduled",
      phone: "(555) 789-0123",
      email: "emma.davis@email.com",
      notes: "Full color treatment",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-01T13:45:00Z",
      updatedAt: "2026-01-01T13:45:00Z"
    },
    {
      id: 8,
      customer: "Frank Miller",
      service: "Beard Trim & Shape",
      barber: "Alex Rodriguez",
      date: "2026-01-04",
      time: "10:30 AM",
      duration: "20 min",
      price: 25,
      status: "scheduled",
      phone: "(555) 890-1234",
      email: "frank.miller@email.com",
      notes: "Weekly maintenance",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T08:15:00Z",
      updatedAt: "2026-01-03T08:15:00Z"
    },
    {
      id: 9,
      customer: "Grace Taylor",
      service: "Premium Package",
      barber: "Mike Johnson",
      date: "2026-01-04",
      time: "3:00 PM",
      duration: "60 min",
      price: 85,
      status: "scheduled",
      phone: "(555) 901-2345",
      email: "grace.taylor@email.com",
      notes: "Birthday special request",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T19:30:00Z",
      updatedAt: "2026-01-02T19:30:00Z"
    },
    {
      id: 10,
      customer: "Henry Wilson",
      service: "Classic Haircut",
      barber: "Sarah Chen",
      date: "2026-01-05",
      time: "11:00 AM",
      duration: "30 min",
      price: 35,
      status: "scheduled",
      phone: "(555) 012-3456",
      email: "henry.wilson@email.com",
      notes: "Student discount applied",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-04T14:20:00Z",
      updatedAt: "2026-01-04T14:20:00Z"
    },
    {
      id: 11,
      customer: "Isabella Garcia",
      service: "Haircut & Style",
      barber: "Mike Johnson",
      date: "2026-01-05",
      time: "2:30 PM",
      duration: "45 min",
      price: 55,
      status: "scheduled",
      phone: "(555) 123-4567",
      email: "isabella.garcia@email.com",
      notes: "Special occasion styling",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T16:45:00Z",
      updatedAt: "2026-01-03T16:45:00Z"
    },
    {
      id: 12,
      customer: "Jack Thompson",
      service: "Beard Grooming",
      barber: "Alex Rodriguez",
      date: "2026-01-05",
      time: "9:00 AM",
      duration: "25 min",
      price: 30,
      status: "scheduled",
      phone: "(555) 234-5678",
      email: "jack.thompson@email.com",
      notes: "Corporate client",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-04T11:10:00Z",
      updatedAt: "2026-01-04T11:10:00Z"
    },
    {
      id: 13,
      customer: "Karen Martinez",
      service: "Hair Color",
      barber: "Sarah Chen",
      date: "2026-01-06",
      time: "10:00 AM",
      duration: "90 min",
      price: 120,
      status: "scheduled",
      phone: "(555) 345-6789",
      email: "karen.martinez@email.com",
      notes: "Balayage technique",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-01T09:30:00Z",
      updatedAt: "2026-01-01T09:30:00Z"
    },
    {
      id: 14,
      customer: "Liam Anderson",
      service: "Premium Package",
      barber: "Mike Johnson",
      date: "2026-01-06",
      time: "1:30 PM",
      duration: "60 min",
      price: 85,
      status: "scheduled",
      phone: "(555) 456-7890",
      email: "liam.anderson@email.com",
      notes: "Executive grooming",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-05T13:15:00Z",
      updatedAt: "2026-01-05T13:15:00Z"
    },
    {
      id: 15,
      customer: "Maya Johnson",
      service: "Classic Haircut",
      barber: "Alex Rodriguez",
      date: "2026-01-06",
      time: "4:00 PM",
      duration: "30 min",
      price: 35,
      status: "scheduled",
      phone: "(555) 567-8901",
      email: "maya.johnson@email.com",
      notes: "Quick trim appointment",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-05T17:20:00Z",
      updatedAt: "2026-01-05T17:20:00Z"
    },
    {
      id: 16,
      customer: "Oliver Brown",
      service: "Full Service Package",
      barber: "Mike Johnson",
      date: "2026-01-03",
      time: "1:00 PM",
      duration: "90 min",
      price: 120,
      status: "scheduled",
      phone: "(555) 678-9012",
      email: "oliver.brown@email.com",
      notes: "Complete grooming session with multiple services",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T10:45:00Z",
      updatedAt: "2026-01-02T10:45:00Z"
    },
    {
      id: 17,
      customer: "Sophia Davis",
      service: "Hair Color & Cut",
      barber: "Sarah Chen",
      date: "2026-01-03",
      time: "2:30 PM",
      duration: "120 min",
      price: 150,
      status: "scheduled",
      phone: "(555) 789-0123",
      email: "sophia.davis@email.com",
      notes: "Full color treatment with haircut",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-01T14:20:00Z",
      updatedAt: "2026-01-01T14:20:00Z"
    },
    {
      id: 18,
      customer: "Ethan Wilson",
      service: "Executive Grooming",
      barber: "Mike Johnson",
      date: "2026-01-04",
      time: "9:00 AM",
      duration: "75 min",
      price: 95,
      status: "scheduled",
      phone: "(555) 890-1234",
      email: "ethan.wilson@email.com",
      notes: "VIP executive package",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T08:30:00Z",
      updatedAt: "2026-01-03T08:30:00Z"
    },
    {
      id: 19,
      customer: "Ava Martinez",
      service: "Bridal Package",
      barber: "Sarah Chen",
      date: "2026-01-04",
      time: "11:00 AM",
      duration: "150 min",
      price: 200,
      status: "scheduled",
      phone: "(555) 901-2345",
      email: "ava.martinez@email.com",
      notes: "Special bridal preparation",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T16:15:00Z",
      updatedAt: "2026-01-02T16:15:00Z"
    },
    {
      id: 20,
      customer: "Noah Garcia",
      service: "Beard Sculpting",
      barber: "Alex Rodriguez",
      date: "2026-01-04",
      time: "4:30 PM",
      duration: "45 min",
      price: 40,
      status: "scheduled",
      phone: "(555) 012-3456",
      email: "noah.garcia@email.com",
      notes: "Detailed beard sculpting session",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T15:45:00Z",
      updatedAt: "2026-01-03T15:45:00Z"
    },
    {
      id: 21,
      customer: "Isabella Rodriguez",
      service: "Hair Treatment",
      barber: "Sarah Chen",
      date: "2026-01-05",
      time: "10:00 AM",
      duration: "60 min",
      price: 80,
      status: "scheduled",
      phone: "(555) 123-4567",
      email: "isabella.rodriguez@email.com",
      notes: "Deep conditioning treatment",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-04T09:30:00Z",
      updatedAt: "2026-01-04T09:30:00Z"
    },
    {
      id: 22,
      customer: "Mason Lee",
      service: "Premium Shave",
      barber: "Mike Johnson",
      date: "2026-01-05",
      time: "3:00 PM",
      duration: "45 min",
      price: 50,
      status: "scheduled",
      phone: "(555) 234-5678",
      email: "mason.lee@email.com",
      notes: "Traditional hot towel shave",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-04T14:20:00Z",
      updatedAt: "2026-01-04T14:20:00Z"
    },
    {
      id: 23,
      customer: "Harper Taylor",
      service: "Color Correction",
      barber: "Sarah Chen",
      date: "2026-01-06",
      time: "9:30 AM",
      duration: "180 min",
      price: 250,
      status: "scheduled",
      phone: "(555) 345-6789",
      email: "harper.taylor@email.com",
      notes: "Complex color correction session",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-03T11:00:00Z",
      updatedAt: "2026-01-03T11:00:00Z"
    },
    {
      id: 24,
      customer: "Lucas Anderson",
      service: "Gentleman Package",
      barber: "Alex Rodriguez",
      date: "2026-01-06",
      time: "2:00 PM",
      duration: "90 min",
      price: 110,
      status: "scheduled",
      phone: "(555) 456-7890",
      email: "lucas.anderson@email.com",
      notes: "Complete gentleman grooming",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-05T13:45:00Z",
      updatedAt: "2026-01-05T13:45:00Z"
    },
    {
      id: 25,
      customer: "Ella Thompson",
      service: "Hair Extensions",
      barber: "Sarah Chen",
      date: "2026-01-07",
      time: "10:00 AM",
      duration: "120 min",
      price: 180,
      status: "scheduled",
      phone: "(555) 567-8901",
      email: "ella.thompson@email.com",
      notes: "Hair extension installation",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-04T16:30:00Z",
      updatedAt: "2026-01-04T16:30:00Z"
    },
    {
      id: 26,
      customer: "James Wilson",
      service: "Classic Haircut",
      barber: "Alex Rodriguez",
      date: "2026-01-03",
      time: "11:30 AM",
      duration: "30 min",
      price: 35,
      status: "scheduled",
      phone: "(555) 678-9012",
      email: "james.wilson@email.com",
      notes: "Regular trim",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T09:00:00Z",
      updatedAt: "2026-01-02T09:00:00Z"
    },
    {
      id: 27,
      customer: "William Taylor",
      service: "Beard Trim & Shape",
      barber: "Sarah Chen",
      date: "2026-01-03",
      time: "10:00 AM",
      duration: "30 min",
      price: 25,
      status: "scheduled",
      phone: "(555) 789-0123",
      email: "william.taylor@email.com",
      notes: "Beard shaping",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T10:30:00Z",
      updatedAt: "2026-01-02T10:30:00Z"
    },
    {
      id: 28,
      customer: "Benjamin Moore",
      service: "Premium Package",
      barber: "Alex Rodriguez",
      date: "2026-01-03",
      time: "1:00 PM",
      duration: "60 min",
      price: 85,
      status: "scheduled",
      phone: "(555) 890-1234",
      email: "benjamin.moore@email.com",
      notes: "Full package",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T11:00:00Z",
      updatedAt: "2026-01-02T11:00:00Z"
    },
    {
      id: 29,
      customer: "Lucas White",
      service: "Haircut & Style",
      barber: "Mike Johnson",
      date: "2026-01-03",
      time: "4:00 PM",
      duration: "45 min",
      price: 55,
      status: "scheduled",
      phone: "(555) 901-2345",
      email: "lucas.white@email.com",
      notes: "Style for event",
      source: "mobile",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T12:00:00Z",
      updatedAt: "2026-01-02T12:00:00Z"
    },
    {
      id: 30,
      customer: "Henry Harris",
      service: "Beard Grooming",
      barber: "Sarah Chen",
      date: "2026-01-03",
      time: "4:30 PM",
      duration: "30 min",
      price: 30,
      status: "scheduled",
      phone: "(555) 012-3456",
      email: "henry.harris@email.com",
      notes: "Quick groom",
      source: "website",
      branch: "Downtown Premium",
      createdAt: "2026-01-02T13:00:00Z",
      updatedAt: "2026-01-02T13:00:00Z"
    }
  ];

  // Mock notifications - in real app, this would come from API/websockets
  const mockNotifications = [
    {
      id: "1",
      type: "info" as const,
      title: "New Booking",
      message: "John Doe booked Classic Haircut for tomorrow",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "John Doe")!)
      }
    },
    {
      id: "2",
      type: "warning" as const,
      title: "Booking Cancelled",
      message: "Charlie Wilson cancelled Beard Grooming",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      action: {
        label: "View",
        onClick: () => handleAppointmentClick(appointments.find(a => a.customer === "Charlie Wilson")!)
      }
    },
    {
      id: "3",
      type: "info" as const,
      title: "Appointment Reminder",
      message: "Jane Smith appointment starts in 30 minutes",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: true
    }
  ];

  useEffect(() => {
    // Initialize with mock notifications
    mockNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "scheduled": return <Calendar className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "rescheduled": return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    return source === "mobile" ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />;
  };

  const getSourceColor = (source: string) => {
    return source === "mobile" ? "text-blue-600" : "text-green-600";
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  // Get confirmed bookings and combine with mock appointments
  const confirmedBookings = getConfirmedBookings();
  const convertedBookings = confirmedBookings.map((booking, index) => ({
    id: index + 1000,
    customer: booking.customerName,
    service: booking.services.map(s => s.serviceName).join(', '),
    barber: booking.staffMember,
    date: booking.date,
    time: booking.time,
    duration: booking.services.reduce((sum, s) => {
      const durationStr = s.duration || '0';
      const minutes = parseInt(durationStr.toString().split(' ')[0]);
      return sum + minutes;
    }, 0) + ' min',
    price: booking.totalPrice,
    status: 'scheduled' as const,
    phone: booking.customerPhone,
    email: booking.customerEmail,
    notes: booking.specialRequests || 'Booked via website',
    source: 'website' as const,
    branch: 'All Branches',
    createdAt: booking.createdAt,
    updatedAt: booking.createdAt
  }));

  // Combine mock and confirmed appointments
  const allAppointments = [...appointments, ...convertedBookings];

  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesSearch = appointment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.barber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || appointment.date === selectedDate.toISOString().split('T')[0];
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return allAppointments.filter(apt => apt.date === dateString);
  };

  const handleCreateBooking = (barber: string, date: string, time: string) => {
    setBookingData({
      customer: '',
      phone: '',
      email: '',
      service: '',
      barber: barber,
      teamMembers: [{name: barber, tip: 0}],
      date: date,
      time: time,
      notes: '',
      products: [],
      tax: 5,
      serviceCharges: 0,
      discount: 0,
      discountType: 'fixed',
      serviceTip: 0,
      paymentMethods: [],
      status: 'pending',
      generateInvoice: false
    });
    setShowBookingDialog(true);
  };

  const handleSubmitBooking = () => {
    // Validate required fields
    if (!bookingData.customer || !bookingData.service || !bookingData.barber || !bookingData.date || !bookingData.time) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    // In a real app, this would make an API call to create the booking
    console.log('Creating booking:', bookingData);

    // Add notification
    addNotification({
      type: 'success',
      title: 'Booking Created',
      message: `Appointment scheduled for ${bookingData.customer} with ${bookingData.barber} on ${bookingData.date} at ${bookingData.time}`,
    });

    // Close dialog and reset form
    setShowBookingDialog(false);
    setBookingData({
      customer: '',
      phone: '',
      email: '',
      service: '',
      barber: '',
      teamMembers: [],
      date: '',
      time: '',
      notes: '',
      products: [],
      tax: 5,
      serviceCharges: 0,
      discount: 0,
      discountType: 'fixed',
      serviceTip: 0,
      paymentMethods: [],
      status: 'pending',
      generateInvoice: false
    });
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    // In a real app, this would update the backend
    console.log(`Updating appointment ${appointmentId} to status ${newStatus}`);
    // Update local state
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: newStatus, updatedAt: new Date().toISOString() } : apt
    );
    // For demo purposes, we'll just log it
  };

  const handleGenerateInvoice = (appointment: any) => {
    const branch = getBranchByName(appointment.branch);
    if (!branch) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Branch details not found. Please configure branch in settings.'
      });
      return;
    }

    const newInvoiceNumber = generateInvoiceNumber();
    setInvoiceNumber(newInvoiceNumber);
    setSelectedAppointmentForInvoice(appointment);
    setShowInvoiceModal(true);
  };

  const handleApprove = (appointmentId: number) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'approved', updatedAt: new Date().toISOString() } : apt
    );
    addNotification({
      type: 'success',
      title: 'Booking Approved',
      message: 'Appointment has been approved and confirmed.'
    });
  };

  const handleReject = (appointmentId: number) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'rejected', updatedAt: new Date().toISOString() } : apt
    );
    addNotification({
      type: 'error',
      title: 'Booking Rejected',
      message: 'Appointment has been rejected.'
    });
  };

  const handleReschedule = (appointmentId: number) => {
    const appointment = allAppointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
    addNotification({
      type: 'info',
      title: 'Reschedule Mode',
      message: 'Please select a new date and time for this appointment.'
    });
  };

  // Filter pending appointments for approval view
  const pendingAppointments = allAppointments.filter(apt =>
    apt.status === 'pending' || apt.status === 'approved' || apt.status === 'rejected' || apt.status === 'rescheduled'
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0",
          sidebarOpen ? "lg:ml-0" : "lg:ml-1"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b shrink-0">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="branch_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
                  <p className="text-sm text-gray-600">Manage all bookings from website and mobile</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                {/* Notifications */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Notifications</SheetTitle>
                      <SheetDescription>
                        Recent appointment updates and reminders
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              notification.read
                                ? 'bg-muted/50 border-muted'
                                : 'bg-background border-border'
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 mt-1">
                                {getIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium truncate">
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                {notification.action && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="p-0 h-auto mt-2 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action?.onClick();
                                    }}
                                  >
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" onClick={() => router.push('/admin/booking-approvals')} className="hidden sm:flex mr-2">
                  Booking Approvals
                </Button>
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto min-h-0">
            <div className="h-full p-4 lg:p-8">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'calendar' | 'advanced-calendar' | 'list' | 'approvals' | 'product-orders')}>
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="advanced-calendar">Advanced Calendar</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="approvals">Booking Approvals</TabsTrigger>
                    <TabsTrigger value="product-orders">Product Orders</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-sm">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search appointments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="calendar" className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div></div>
                    <Button onClick={() => setShowBookingDialog(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4" />
                      Create Booking
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                      <Card className="border-2 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <Calendar className="w-6 h-6 text-primary" />
                            Booking Calendar
                          </CardTitle>
                          <CardDescription className="text-base">
                            Click on a date to view appointments. Appointments from both website and mobile are shown.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-lg border-2 shadow-sm w-full bg-white"
                            modifiers={{
                              hasAppointments: (date) => getAppointmentsForDate(date).length > 0
                            }}
                            modifiersStyles={{
                              hasAppointments: {
                                backgroundColor: 'rgb(59 130 246 / 0.15)',
                                color: 'rgb(59 130 246)',
                                fontWeight: '600',
                                borderRadius: '8px',
                                border: '2px solid rgb(59 130 246 / 0.3)'
                              },
                              today: {
                                backgroundColor: 'rgb(251 146 60 / 0.1)',
                                color: 'rgb(251 146 60)',
                                fontWeight: '600',
                                border: '2px solid rgb(251 146 60 / 0.3)'
                              }
                            }}
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-md transition-colors",
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day_outside: "text-muted-foreground opacity-50",
                              day_disabled: "text-muted-foreground opacity-50",
                              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                              day_hidden: "invisible",
                            }}
                          />
                          <div className="mt-4 flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500/20 border-2 border-blue-500/50 rounded"></div>
                              <span>Has Appointments</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-orange-500/20 border-2 border-orange-500/50 rounded"></div>
                              <span>Today</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Date Appointments Sidebar */}
                    <div className="lg:col-span-2">
                      <Card className="border-2 shadow-lg bg-white/50 backdrop-blur-sm h-fit sticky top-6">
                        <CardHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                          <CardTitle className="text-lg lg:text-xl flex items-center gap-3">
                            <Clock className="w-6 h-6 text-primary" />
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Select a date'}
                          </CardTitle>
                          <CardDescription className="text-base font-medium">
                            {selectedDate ? (
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                                  {getAppointmentsForDate(selectedDate).length} appointment(s)
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {getAppointmentsForDate(selectedDate).filter(apt => apt.status === 'completed').length} completed
                                </span>
                              </div>
                            ) : 'Choose a date from the calendar'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 px-6">
                          {selectedDate && (
                            <div className="space-y-4">
                              {getAppointmentsForDate(selectedDate).map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="group p-5 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                                  onClick={() => handleAppointmentClick(appointment)}
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <User className="w-6 h-6 text-primary" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors">{appointment.time}</span>
                                        <div className={`flex items-center gap-2 mt-1 ${getSourceColor(appointment.source)}`}>
                                          {getSourceIcon(appointment.source)}
                                          <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-current/10">{appointment.source}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <Badge className={`${getStatusColor(appointment.status)} border-2 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm`}>
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{appointment.customer}</p>
                                      <p className="text-gray-700 text-sm font-medium">{appointment.service}</p>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                      <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <Scissors className="w-4 h-4 text-secondary" />
                                        with {appointment.barber}
                                      </p>
                                      <span className="text-lg font-bold text-primary">{formatCurrency(appointment.price)}</span>
                                    </div>
                                    {appointment.notes && (
                                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                        <p className="text-xs text-gray-600 italic">"{appointment.notes}"</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {getAppointmentsForDate(selectedDate).length === 0 && (
                                <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-200">
                                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Calendar className="w-10 h-10 text-gray-400" />
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-600 mb-2">No appointments</h3>
                                  <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">No appointments scheduled for this date. Click "Create Booking" to add one.</p>
                                  <Button 
                                    onClick={() => setShowBookingDialog(true)}
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Booking
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                          {!selectedDate && (
                            <div className="text-center py-16 px-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border-2 border-dashed border-primary/20">
                              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Calendar className="w-10 h-10 text-primary" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-600 mb-2">Select a date</h3>
                              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Choose a date from the calendar to view appointments and manage bookings.</p>
                              <div className="text-xs text-muted-foreground">
                                💡 Tip: Dates with appointments are highlighted in blue
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced-calendar" className="space-y-6">
                  <AdvancedCalendar
                    appointments={appointments}
                    onAppointmentClick={handleAppointmentClick}
                    onStatusChange={handleStatusChange}
                    onCreateBooking={handleCreateBooking}
                  />
                </TabsContent>

                <TabsContent value="list" className="space-y-8">
                  {/* Appointments List */}
                  <div className="space-y-6">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <CardHeader className="pb-4 border-b bg-linear-to-r from-gray-50/50 to-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <User className="w-7 h-7 text-primary" />
                              </div>
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-primary flex items-center gap-3">
                                  {appointment.customer}
                                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getSourceColor(appointment.source)} bg-current/10`}>
                                    {getSourceIcon(appointment.source)}
                                    <span className="capitalize">{appointment.source}</span>
                                  </div>
                                </CardTitle>
                                <CardDescription className="flex items-center gap-3 text-base">
                                  <span className="font-medium text-gray-700">{appointment.service}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{appointment.barber}</span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600">{appointment.branch}</span>
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(appointment.status)} border-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold`}>
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">{appointment.status}</span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-blue-900">{appointment.date}</p>
                                <p className="text-xs text-blue-700">at {appointment.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <Clock className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-900">{appointment.duration}</p>
                                <p className="text-xs text-green-700">Duration</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <DollarSign className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-purple-900">{formatCurrency(appointment.price)}</p>
                                <p className="text-xs text-purple-700">Total Price</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                              <Phone className="w-5 h-5 text-orange-600" />
                              <div>
                                <p className="text-sm font-medium text-orange-900">{appointment.phone}</p>
                                <p className="text-xs text-orange-700">Contact</p>
                              </div>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-yellow-900 mb-1">Notes</p>
                                  <p className="text-sm text-yellow-800">{appointment.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Created: {new Date(appointment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Updated: {new Date(appointment.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                              {/* View Details Button - Available for all statuses */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAppointmentClick(appointment)}
                                className="flex items-center gap-2 border-2 hover:bg-primary hover:text-white transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>

                              {/* Status-based Action Buttons */}
                              {appointment.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'approved')}
                                    className="flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border-green-300 border-2 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'rejected')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </Button>
                                </>
                              )}

                              {(appointment.status === 'approved' || appointment.status === 'scheduled') && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'in-progress')}
                                    className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                  >
                                    <Play className="w-4 h-4" />
                                    Start Service
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'rescheduled')}
                                    className="flex items-center gap-2 text-yellow-600 hover:text-white hover:bg-yellow-600 border-yellow-300 border-2 transition-colors"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'in-progress' && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2 border-2 border-green-500 text-white shadow-sm"
                                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Mark Complete
                                </Button>
                              )}

                              {appointment.status === 'completed' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleGenerateInvoice(appointment)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                  >
                                    <Receipt className="w-4 h-4" />
                                    Generate Invoice
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-2 text-purple-600 hover:text-white hover:bg-purple-600 border-purple-300 border-2 transition-colors"
                                  >
                                    <Star className="w-4 h-4" />
                                    Add Review
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'rescheduled' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'approved')}
                                    className="flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border-green-300 border-2 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm New Time
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border-red-300 border-2 transition-colors"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {appointment.status === 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                  className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border-blue-300 border-2 transition-colors"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Rebook
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-16 px-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-600 mb-3">No appointments found</h3>
                      <p className="text-gray-500 text-lg">Try adjusting your filters or search query</p>
                    </div>
                  )}
                </TabsContent>

                {/* Booking Approvals Tab */}
                <TabsContent value="approvals" className="space-y-6">
                  <div className="space-y-4">
                    {pendingAppointments.length === 0 ? (
                      <div className="text-center py-16 px-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">All caught up!</h3>
                        <p className="text-gray-500 text-lg">No pending approvals at the moment</p>
                      </div>
                    ) : (
                      pendingAppointments.map((appointment) => (
                        <Card key={appointment.id} className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              {/* Customer & Service Info */}
                              <div className="md:col-span-3">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm">{appointment.customer}</p>
                                    <p className="text-xs text-gray-600 truncate">{appointment.service}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Date & Time */}
                              <div className="md:col-span-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-gray-900">{appointment.date}</p>
                                    <p className="text-xs text-gray-600">{appointment.time}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Duration */}
                              <div className="md:col-span-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-gray-900">{appointment.duration}</span>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="md:col-span-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="w-4 h-4 text-purple-600" />
                                  <span className="font-medium text-gray-900">{formatCurrency(appointment.price)}</span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className="md:col-span-2">
                                <Badge className={`${getStatusColor(appointment.status)} border flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold w-full`}>
                                  {getStatusIcon(appointment.status)}
                                  <span className="capitalize">{appointment.status}</span>
                                </Badge>
                              </div>

                              {/* Action Buttons */}
                              <div className="md:col-span-3 flex gap-2 flex-wrap">
                                {appointment.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs h-9 flex items-center justify-center gap-1"
                                      onClick={() => handleApprove(appointment.id)}
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white flex-1 text-xs h-9 flex items-center justify-center gap-1"
                                      onClick={() => handleReject(appointment.id)}
                                    >
                                      <XCircle className="w-3 h-3" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {appointment.status === 'approved' && (
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-xs h-9 flex items-center justify-center gap-1"
                                    onClick={() => handleReschedule(appointment.id)}
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Reschedule
                                  </Button>
                                )}
                                {appointment.status === 'rejected' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-2 border-red-300 text-red-600 flex-1 text-xs h-9 cursor-not-allowed opacity-60"
                                    disabled
                                  >
                                    Rejected
                                  </Button>
                                )}
                                {appointment.status === 'rescheduled' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white flex-1 text-xs h-9 flex items-center justify-center gap-1"
                                      onClick={() => handleApprove(appointment.id)}
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-red-600 hover:bg-red-700 text-white flex-1 text-xs h-9 flex items-center justify-center gap-1"
                                      onClick={() => handleReject(appointment.id)}
                                    >
                                      <XCircle className="w-3 h-3" />
                                      Deny
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-2 flex-1 text-xs h-9"
                                  onClick={() => handleAppointmentClick(appointment)}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Product Orders Tab */}
                <TabsContent value="product-orders" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Product Orders</h2>
                      <p className="text-gray-600 mt-1">Manage product sales and inventory</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Order
                    </Button>
                  </div>

                  {/* Product Orders Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(3240)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-gray-900">18</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-gray-900">6</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Product Orders Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Track all product orders and sales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {productOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                            <div className="flex-1">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{order.id}</p>
                                  <p className="text-sm text-gray-600">{order.customer}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="text-sm text-gray-600">Products</p>
                              <p className="font-semibold text-gray-900 text-sm">{order.products.join(', ')}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="text-sm text-gray-600">Qty</p>
                              <p className="font-semibold text-gray-900">{order.quantity}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="font-semibold text-lg text-gray-900">{formatCurrency(order.total)}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <Badge className={cn(
                                order.status === 'delivered' && 'bg-green-100 text-green-800',
                                order.status === 'approved' && 'bg-blue-100 text-blue-800',
                                order.status === 'rejected' && 'bg-red-100 text-red-800',
                                order.status === 'pending' && 'bg-yellow-100 text-yellow-800'
                              )}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {order.status !== 'delivered' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Mark as Delivered"
                                    onClick={() => handleOrderStatusChange(order.id, 'delivered')}
                                    className="hover:bg-green-100 hover:text-green-700"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Approve Order"
                                    onClick={() => handleOrderStatusChange(order.id, 'approved')}
                                    className="hover:bg-blue-100 hover:text-blue-700"
                                  >
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Reject Order"
                                    onClick={() => handleOrderStatusChange(order.id, 'rejected')}
                                    className="hover:bg-red-100 hover:text-red-700"
                                  >
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              {allowPendingOrders && order.status !== 'pending' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  title="Mark as Pending"
                                  onClick={() => handleOrderStatusChange(order.id, 'pending')}
                                  className="hover:bg-yellow-100 hover:text-yellow-700"
                                >
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Sheet */}
      <Sheet open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="border-b-2 pb-6 mb-8 bg-linear-to-r from-primary/5 to-secondary/5 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
            <SheetTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              Appointment Details
              {selectedAppointment && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getSourceColor(selectedAppointment.source)} bg-current/10`}>
                  {getSourceIcon(selectedAppointment.source)}
                  <span className="capitalize">{selectedAppointment.source}</span>
                </div>
              )}
            </SheetTitle>
            <SheetDescription className="text-base mt-2">
              Complete appointment information and management options
            </SheetDescription>
          </SheetHeader>

          {selectedAppointment && (
            <div className="space-y-8">
              {/* Status Overview */}
              <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Appointment Status
                  </h3>
                  <Badge className={`${getStatusColor(selectedAppointment.status)} border-2 px-4 py-2 text-sm font-semibold flex items-center gap-2`}>
                    {getStatusIcon(selectedAppointment.status)}
                    <span className="capitalize">{selectedAppointment.status}</span>
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Created: {new Date(selectedAppointment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Updated: {new Date(selectedAppointment.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.customer}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border break-all">{selectedAppointment.email}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-purple-600" />
                  </div>
                  Service Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Scissors className="w-4 h-4" />
                        Service Type
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">{selectedAppointment.service}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned Barber
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">{selectedAppointment.barber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.date}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Time
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.time}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </label>
                      <p className="text-base font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">{selectedAppointment.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Service Price
                    </label>
                    <p className="text-xl font-bold text-green-600 bg-green-50 px-4 py-3 rounded-lg border-2 border-green-200 text-center">{formatCurrency(selectedAppointment.price)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6 p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </div>
                  Additional Information
                </h3>
                <div className="space-y-6">
                  {selectedAppointment.notes && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Special Notes & Instructions
                      </label>
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                        <Textarea
                          value={selectedAppointment.notes}
                          readOnly
                          className="min-h-[100px] bg-transparent border-0 resize-none text-gray-800"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Branch Location
                    </label>
                    <p className="text-base font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">{selectedAppointment.branch}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(selectedAppointment.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedAppointment.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(selectedAppointment.updatedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedAppointment.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 p-6 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="h-12 flex items-center gap-3 border-2 hover:bg-primary hover:text-white transition-colors">
                    <Edit className="w-5 h-5" />
                    Edit Appointment Details
                  </Button>

                  {selectedAppointment.status === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 transition-colors">
                        <RefreshCw className="w-5 h-5" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 flex items-center gap-3 border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                        onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Appointment
                      </Button>
                    </div>
                  )}

                  {selectedAppointment.status === 'in-progress' && (
                    <Button
                      className="h-12 bg-green-600 hover:bg-green-700 flex items-center gap-3 border-2 border-green-500 text-white shadow-sm"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Completed
                    </Button>
                  )}

                  {selectedAppointment.status === 'completed' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors">
                        <Receipt className="w-5 h-5" />
                        Generate Invoice
                      </Button>
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors">
                        <Star className="w-5 h-5" />
                        Add Review
                      </Button>
                    </div>
                  )}

                  {selectedAppointment.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-green-300 text-green-700 hover:bg-green-50 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </Button>
                      <Button variant="outline" className="h-12 flex items-center gap-3 border-2 border-red-300 text-red-700 hover:bg-red-50 transition-colors">
                        <XCircle className="w-5 h-5" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Booking Creation Dialog */}
      <Sheet open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <SheetContent className="sm:max-w-[900px] w-full z-[60] overflow-y-auto">
          <SheetHeader className="border-b pb-4 mb-6">
            <SheetTitle className="text-xl font-semibold">Create New Booking</SheetTitle>
            <SheetDescription className="text-base">
              Schedule a new appointment for a customer.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 pb-6">
            {/* Customer Information */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Customer Name *</label>
                  <Input
                    placeholder="Enter customer name"
                    value={bookingData.customer}
                    onChange={(e) => setBookingData({...bookingData, customer: e.target.value})}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input
                      placeholder="(555) 123-4567"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      placeholder="customer@email.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                Service Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service *</label>
                  <Select value={bookingData.service} onValueChange={(value) => setBookingData({...bookingData, service: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Classic Haircut">Classic Haircut - $35</SelectItem>
                      <SelectItem value="Beard Trim & Shape">Beard Trim & Shape - $25</SelectItem>
                      <SelectItem value="Premium Package">Premium Package - $85</SelectItem>
                      <SelectItem value="Haircut & Style">Haircut & Style - $50</SelectItem>
                      <SelectItem value="Hair Coloring">Hair Coloring - $120</SelectItem>
                      <SelectItem value="Facial Treatment">Facial Treatment - $75</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Primary Team Member *</label>
                  <Select value={bookingData.barber} onValueChange={(value) => {
                    setBookingData({...bookingData, barber: value});
                    // Add to team members if not already there
                    if (!bookingData.teamMembers.some(tm => tm.name === value)) {
                      setBookingData(prev => ({
                        ...prev,
                        teamMembers: [...prev.teamMembers, {name: value, tip: 0}]
                      }));
                    }
                  }}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mike Johnson">
                        <div className="flex flex-col">
                          <span className="font-medium">Mike Johnson</span>
                          <span className="text-xs text-gray-500">Senior Barber • Haircuts & Styling • 8 years exp • ⭐ 4.8</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Alex Rodriguez">
                        <div className="flex flex-col">
                          <span className="font-medium">Alex Rodriguez</span>
                          <span className="text-xs text-gray-500">Beard Specialist • Grooming Expert • 6 years exp • ⭐ 4.9</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Sarah Chen">
                        <div className="flex flex-col">
                          <span className="font-medium">Sarah Chen</span>
                          <span className="text-xs text-gray-500">Color Specialist • Premium Services • 7 years exp • ⭐ 4.7</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="David Kim">
                        <div className="flex flex-col">
                          <span className="font-medium">David Kim</span>
                          <span className="text-xs text-gray-500">All Services • Master Barber • 10 years exp • ⭐ 4.9</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {bookingData.barber && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm">
                        <div className="font-medium text-blue-900 mb-1">Employee Details</div>
                        {bookingData.barber === 'Mike Johnson' && (
                          <div className="text-blue-800 space-y-1">
                            <div><strong>Specialization:</strong> Haircuts & Men's Styling</div>
                            <div><strong>Experience:</strong> 8 years</div>
                            <div><strong>Rating:</strong> ⭐ 4.8/5 (127 reviews)</div>
                            <div><strong>Working Hours:</strong> Mon-Fri 9AM-7PM, Sat 8AM-5PM</div>
                          </div>
                        )}
                        {bookingData.barber === 'Alex Rodriguez' && (
                          <div className="text-blue-800 space-y-1">
                            <div><strong>Specialization:</strong> Beard Grooming & Facial Treatments</div>
                            <div><strong>Experience:</strong> 6 years</div>
                            <div><strong>Rating:</strong> ⭐ 4.9/5 (98 reviews)</div>
                            <div><strong>Working Hours:</strong> Tue-Sat 10AM-8PM, Sun 12PM-6PM</div>
                          </div>
                        )}
                        {bookingData.barber === 'Sarah Chen' && (
                          <div className="text-blue-800 space-y-1">
                            <div><strong>Specialization:</strong> Hair Coloring & Premium Treatments</div>
                            <div><strong>Experience:</strong> 7 years</div>
                            <div><strong>Rating:</strong> ⭐ 4.7/5 (89 reviews)</div>
                            <div><strong>Working Hours:</strong> Mon-Wed 9AM-6PM, Thu-Fri 9AM-8PM</div>
                          </div>
                        )}
                        {bookingData.barber === 'David Kim' && (
                          <div className="text-blue-800 space-y-1">
                            <div><strong>Specialization:</strong> All Services & Complex Styling</div>
                            <div><strong>Experience:</strong> 10 years</div>
                            <div><strong>Rating:</strong> ⭐ 4.9/5 (156 reviews)</div>
                            <div><strong>Working Hours:</strong> Mon-Sat 9AM-7PM</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Team Members */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Additional Team Members</label>
                  <Select onValueChange={(value) => {
                    if (value && !bookingData.teamMembers.some(tm => tm.name === value)) {
                      setBookingData(prev => ({
                        ...prev,
                        teamMembers: [...prev.teamMembers, {name: value, tip: 0}]
                      }));
                    }
                  }}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Add more team members" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="David Kim">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Members List with Tips */}
                {bookingData.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Team Members & Their Tips</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {bookingData.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-white rounded border">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="flex-1 text-sm font-medium">{member.name}</span>
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600">Tip:</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={member.tip}
                              onChange={(e) => {
                                const newMembers = [...bookingData.teamMembers];
                                newMembers[index].tip = parseFloat(e.target.value) || 0;
                                setBookingData({...bookingData, teamMembers: newMembers});
                              }}
                              placeholder="$0.00"
                              className="h-9 w-24 text-right"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setBookingData(prev => ({
                                ...prev,
                                teamMembers: prev.teamMembers.filter((_, i) => i !== index),
                                barber: index === 0 && prev.teamMembers.length > 1 ? prev.teamMembers[1].name : prev.barber
                              }));
                            }}
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Products
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product</label>
                    <Select onValueChange={(value) => {
                      const product = mockProducts.find(p => p.name === value);
                      if (product) {
                        setBookingData(prev => ({
                          ...prev,
                          products: [...prev.products, { ...product, quantity: 1 }]
                        }));
                      }
                    }}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Add product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name} - {product.category} - {formatCurrency(product.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="h-11"
                      onChange={(e) => {
                        // This would update the last added product's quantity
                        // For simplicity, we'll handle this in a more complete implementation
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full"
                      onClick={() => {
                        // Add product logic would go here
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Products List */}
                {bookingData.products.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Selected Products</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bookingData.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{formatCurrency(product.price)}</span>
                            <span className="text-sm text-gray-500">x{product.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setBookingData(prev => ({
                                  ...prev,
                                  products: prev.products.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing & Charges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Discount Amount</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={bookingData.discount}
                      onChange={(e) => setBookingData({...bookingData, discount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                      className="h-11 flex-1"
                    />
                    <Select value={bookingData.discountType} onValueChange={(value) => setBookingData({...bookingData, discountType: value as 'fixed' | 'percentage'})}>
                      <SelectTrigger className="h-11 w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">$ Fixed</SelectItem>
                        <SelectItem value="percentage">% Percent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Tips ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={bookingData.serviceTip}
                    onChange={(e) => setBookingData({...bookingData, serviceTip: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tax (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={bookingData.tax}
                    onChange={(e) => setBookingData({...bookingData, tax: parseFloat(e.target.value) || 0})}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Charges ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={bookingData.serviceCharges}
                    onChange={(e) => setBookingData({...bookingData, serviceCharges: parseFloat(e.target.value) || 0})}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Payment Methods</label>
                <div className="grid grid-cols-2 gap-3">
                  {['cash', 'card', 'check', 'digital'].map((method) => (
                    <div key={method} className="flex items-center space-x-2 p-2 rounded border cursor-pointer hover:bg-blue-50" onClick={() => {
                      setBookingData(prev => ({
                        ...prev,
                        paymentMethods: prev.paymentMethods.includes(method as any)
                          ? prev.paymentMethods.filter(m => m !== method)
                          : [...prev.paymentMethods, method as any]
                      }));
                    }}>
                      <input
                        type="checkbox"
                        id={`method-${method}`}
                        checked={bookingData.paymentMethods.includes(method as any)}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`method-${method}`} className="text-sm font-medium cursor-pointer capitalize">
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
                {bookingData.paymentMethods.length > 0 && (
                  <div className="text-xs text-gray-600 mt-2">
                    Selected: {bookingData.paymentMethods.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')}
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{formatCurrency(getServicePrice(bookingData.service))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Products:</span>
                    <span>{formatCurrency(bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charges:</span>
                    <span>{formatCurrency(bookingData.serviceCharges)}</span>
                  </div>
                  
                  {/* Discount Line */}
                  {bookingData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({bookingData.discountType === 'percentage' ? bookingData.discount + '%' : 'Fixed'}):</span>
                      <span>-{formatCurrency(bookingData.discountType === 'percentage' 
                        ? (getServicePrice(bookingData.service) + bookingData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)) * (bookingData.discount / 100)
                        : bookingData.discount)}</span>
                    </div>
                  )}

                  {/* Tips Line */}
                  {(bookingData.serviceTip > 0 || bookingData.teamMembers.some(tm => tm.tip > 0)) && (
                    <div className="flex justify-between text-blue-600">
                      <span>Tips (Service + Team):</span>
                      <span>{formatCurrency(bookingData.serviceTip + bookingData.teamMembers.reduce((sum, tm) => sum + tm.tip, 0))}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Tax ({bookingData.tax}%):</span>
                    <span>{formatCurrency(parseFloat(calculateTax()))}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(parseFloat(calculateTotal()))}</span>
                  </div>

                  {/* Payment Methods Display */}
                  {bookingData.paymentMethods.length > 0 && (
                    <div className="border-t pt-2 mt-3">
                      <div className="text-xs font-medium text-gray-600 mb-2">Payment Methods:</div>
                      <div className="flex flex-wrap gap-2">
                        {bookingData.paymentMethods.map(method => (
                          <span key={method} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Booking Status
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={bookingData.status} onValueChange={(value) => setBookingData(prev => ({
                  ...prev,
                  status: value,
                  generateInvoice: value === 'completed' ? prev.generateInvoice : false
                }))}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Date & Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Time *</label>
                  <Input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Generation */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Invoice Options
              </h3>

              <div className="space-y-4">
                {bookingData.status === 'completed' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <label htmlFor="generateInvoice" className="text-sm font-medium text-gray-700">
                        Generate invoice automatically after booking
                      </label>
                      <Switch
                        id="generateInvoice"
                        checked={bookingData.generateInvoice}
                        onCheckedChange={(checked) => setBookingData({...bookingData, generateInvoice: checked})}
                      />
                    </div>

                    {bookingData.generateInvoice && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Receipt className="w-4 h-4" />
                          <span className="text-sm font-medium">Invoice will be generated with:</span>
                        </div>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Customer details and booking information</li>
                          <li>• Itemized services and products</li>
                          <li>• Tax calculation and total amount</li>
                          <li>• Payment terms and due date</li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Invoice generation is only available for completed services</span>
                    </div>
                    <p className="mt-2 text-sm text-yellow-700">
                      Set the booking status to "Completed" to enable invoice generation options.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-6 p-6 bg-gray-50/50 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Additional Notes
              </h3>

              <div className="space-y-2">
                <Textarea
                  placeholder="Any special requests or notes..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t bg-white px-6 py-4 -mx-6 -mb-6">
            <Button variant="outline" onClick={() => setShowBookingDialog(false)} className="px-6 h-11">
              Cancel
            </Button>
            <Button onClick={handleSubmitBooking} className="px-6 h-11 bg-primary hover:bg-primary/90">
              Create Booking
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Invoice Generation Modal */}
      <Sheet open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Generate Invoice</SheetTitle>
            <SheetDescription>
              Preview and generate invoice for appointment
            </SheetDescription>
          </SheetHeader>

          {selectedAppointmentForInvoice && (
            <div className="space-y-6 mt-6">
              {/* Invoice Preview */}
              {getBranchByName(selectedAppointmentForInvoice.branch) && (
                <div className="border rounded-lg overflow-hidden">
                  <div id="invoice-container">
                    {(() => {
                      const TemplateComponent = getTemplate(
                        getBranchByName(selectedAppointmentForInvoice.branch)?.invoiceTemplate || 'modern'
                      );
                      const invoiceData: InvoiceData = {
                        id: selectedAppointmentForInvoice.id,
                        invoiceNumber,
                        customer: selectedAppointmentForInvoice.customer,
                        email: selectedAppointmentForInvoice.email,
                        phone: selectedAppointmentForInvoice.phone,
                        service: selectedAppointmentForInvoice.service,
                        date: selectedAppointmentForInvoice.date,
                        time: selectedAppointmentForInvoice.time,
                        duration: selectedAppointmentForInvoice.duration,
                        price: selectedAppointmentForInvoice.price,
                        status: selectedAppointmentForInvoice.status,
                        barber: selectedAppointmentForInvoice.barber,
                        notes: selectedAppointmentForInvoice.notes,
                        tax: selectedAppointmentForInvoice.tax || 5,
                        discount: selectedAppointmentForInvoice.discount || 0
                      };

                      return (
                        <TemplateComponent
                          invoice={invoiceData}
                          branch={getBranchByName(selectedAppointmentForInvoice.branch)!}
                        />
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowInvoiceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    window.print();
                    addNotification({
                      type: 'success',
                      title: 'Print Dialog Opened',
                      message: 'Use your browser print function to save as PDF'
                    });
                  }}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ProtectedRoute>
  );
}
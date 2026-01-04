'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertCircle, Plus, Trash2, Edit, TrendingUp, TrendingDown, DollarSign, Target, Filter, Download, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

interface MonthlyMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

const EXPENSE_CATEGORIES = [
  'Staff Salaries',
  'Rent',
  'Utilities',
  'Supplies',
  'Equipment',
  'Marketing',
  'Maintenance',
  'Other'
];

export default function AdminExpensesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'Staff Salaries',
      description: 'Monthly payroll for 5 staff members',
      amount: 8500,
      date: '2026-01-02',
      status: 'approved',
      notes: 'Regular monthly salaries'
    },
    {
      id: '2',
      category: 'Rent',
      description: 'Shop rent for January',
      amount: 3000,
      date: '2026-01-01',
      status: 'approved',
      notes: 'Monthly rent payment'
    },
    {
      id: '3',
      category: 'Supplies',
      description: 'Hair products and towels',
      amount: 450,
      date: '2026-01-03',
      status: 'pending',
      notes: 'Bulk supply purchase'
    }
  ]);

  const [monthlyRevenue, setMonthlyRevenue] = useState(15000);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newExpense, setNewExpense] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculate metrics
  const totalExpenses = expenses
    .filter(e => e.status !== 'rejected')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const profit = monthlyRevenue - totalExpenses;
  const profitMargin = monthlyRevenue > 0 ? ((profit / monthlyRevenue) * 100).toFixed(2) : '0';
  
  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const approvedExpenses = expenses.filter(e => e.status === 'approved');
  const rejectedExpenses = expenses.filter(e => e.status === 'rejected');

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const statusMatch = filterStatus === 'all' || expense.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || expense.category === filterCategory;
    const searchMatch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && categoryMatch && searchMatch;
  });

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount) {
      return;
    }

    if (editingId) {
      setExpenses(expenses.map(e => 
        e.id === editingId 
          ? {
              ...e,
              category: newExpense.category,
              description: newExpense.description,
              amount: parseFloat(newExpense.amount),
              date: newExpense.date,
              notes: newExpense.notes
            }
          : e
      ));
      setEditingId(null);
    } else {
      const id = Date.now().toString();
      setExpenses([...expenses, {
        id,
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date,
        status: 'pending',
        notes: newExpense.notes
      }]);
    }

    setNewExpense({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleEditExpense = (expense: Expense) => {
    setNewExpense({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      notes: expense.notes
    });
    setEditingId(expense.id);
  };

  const handleApproveExpense = (id: string) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, status: 'approved' } : e
    ));
  };

  const handleRejectExpense = (id: string) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, status: 'rejected' } : e
    ));
  };

  const handleReconciliation = () => {
    // Mark all pending as approved
    setExpenses(expenses.map(e => 
      e.status === 'pending' ? { ...e, status: 'approved' } : e
    ));
  };

  const downloadReport = () => {
    const report = `
EXPENSE REPORT - JANUARY 2026

SUMMARY
Revenue: $${monthlyRevenue.toLocaleString()}
Total Expenses: $${totalExpenses.toLocaleString()}
Profit: $${profit.toLocaleString()}
Profit Margin: ${profitMargin}%

EXPENSES BY CATEGORY
${EXPENSE_CATEGORIES.map(cat => {
  const catTotal = expenses
    .filter(e => e.category === cat && e.status !== 'rejected')
    .reduce((sum, e) => sum + e.amount, 0);
  return catTotal > 0 ? `${cat}: $${catTotal.toLocaleString()}` : '';
}).filter(Boolean).join('\n')}

DETAILED EXPENSES
${filteredExpenses.map(e => 
  `${e.date} | ${e.category} | ${e.description} | $${e.amount} | ${e.status.toUpperCase()}`
).join('\n')}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', 'expense-report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ProtectedRoute requiredRole="branch_admin">
      <div className="flex h-screen bg-[#f8f9fa]">
        {/* Sidebar */}
        <AdminSidebar
          role="branch_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="branch_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-serif font-bold text-primary">Expense Manager</h1>
                  <p className="text-sm text-muted-foreground">Track and manage all business expenses</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-none shadow-sm rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Monthly Revenue</p>
                        <p className="text-3xl font-serif font-bold text-primary">${monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-secondary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl border-l-4 border-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Expenses</p>
                        <p className="text-3xl font-serif font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                      </div>
                      <TrendingDown className="w-12 h-12 text-red-500/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn(
                  "border-none shadow-sm rounded-xl",
                  profit >= 0 ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Net Profit</p>
                        <p className={cn(
                          "text-3xl font-serif font-bold",
                          profit >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          ${profit.toLocaleString()}
                        </p>
                      </div>
                      <TrendingUp className={cn("w-12 h-12", profit >= 0 ? "text-green-500/20" : "text-red-500/20")} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Profit Margin</p>
                        <p className="text-3xl font-serif font-bold text-primary">{profitMargin}%</p>
                      </div>
                      <Target className="w-12 h-12 text-secondary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Expense Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="border-none shadow-sm rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-1">Pending Approval</p>
                        <p className="text-2xl font-serif font-bold text-yellow-600">${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{pendingExpenses.length} expense(s)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">Approved</p>
                        <p className="text-2xl font-serif font-bold text-green-600">${approvedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{approvedExpenses.length} expense(s)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-1">Rejected</p>
                        <p className="text-2xl font-serif font-bold text-red-600">${rejectedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{rejectedExpenses.length} expense(s)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-lg border-gray-200"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40 rounded-lg border-gray-200">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 rounded-lg border-gray-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleReconciliation}
                    variant="outline"
                    className="border-gray-200 rounded-lg flex items-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" /> Reconcile
                  </Button>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    className="border-gray-200 rounded-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Report
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-lg flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Expense
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>{editingId ? 'Edit Expense' : 'Add New Expense'}</SheetTitle>
                        <SheetDescription>
                          {editingId ? 'Update expense details' : 'Create a new expense record'}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div>
                          <Label className="text-xs font-bold uppercase">Category</Label>
                          <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                            <SelectTrigger className="mt-1 rounded-lg">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase">Description</Label>
                          <Input
                            placeholder="Expense description"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                            className="mt-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase">Amount</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                            className="mt-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase">Date</Label>
                          <Input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                            className="mt-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase">Notes</Label>
                          <Textarea
                            placeholder="Additional notes..."
                            value={newExpense.notes}
                            onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                            className="mt-1 rounded-lg"
                          />
                        </div>
                        <Button
                          onClick={handleAddExpense}
                          className="w-full bg-secondary hover:bg-secondary/90 text-primary rounded-lg font-bold"
                        >
                          {editingId ? 'Update Expense' : 'Add Expense'}
                        </Button>
                        {editingId && (
                          <Button
                            onClick={() => {
                              setEditingId(null);
                              setNewExpense({
                                category: '',
                                description: '',
                                amount: '',
                                date: new Date().toISOString().split('T')[0],
                                notes: ''
                              });
                            }}
                            variant="outline"
                            className="w-full rounded-lg"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Expenses Table */}
              <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-lg font-serif">Expense Records ({filteredExpenses.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Description</th>
                          <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-widest text-gray-600">Amount</th>
                          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-gray-600">Status</th>
                          <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredExpenses.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                              No expenses found
                            </td>
                          </tr>
                        ) : (
                          filteredExpenses.map(expense => (
                            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-semibold">{expense.date}</td>
                              <td className="px-6 py-4 text-sm">{expense.category}</td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-semibold">{expense.description}</p>
                                  {expense.notes && <p className="text-xs text-muted-foreground">{expense.notes}</p>}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                                ${expense.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <Badge variant={
                                  expense.status === 'approved' ? 'default' :
                                  expense.status === 'pending' ? 'secondary' :
                                  'destructive'
                                } className="rounded-full">
                                  {expense.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {expense.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApproveExpense(expense.id)}
                                        className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRejectExpense(expense.id)}
                                        className="border-red-200 text-red-700 hover:bg-red-50 rounded-lg"
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditExpense(expense)}
                                    className="text-secondary hover:bg-secondary/10 rounded-lg"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Breakdown by Category */}
              <Card className="border-none shadow-sm rounded-xl mt-8">
                <CardHeader className="border-b border-gray-100 bg-gray-50">
                  <CardTitle className="text-lg font-serif">Expense Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {EXPENSE_CATEGORIES.map(category => {
                      const categoryExpenses = expenses.filter(e => e.category === category && e.status !== 'rejected');
                      const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                      const percentage = monthlyRevenue > 0 ? ((categoryTotal / monthlyRevenue) * 100).toFixed(1) : '0';
                      
                      if (categoryTotal === 0) return null;
                      
                      return (
                        <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-sm">{category}</p>
                            <p className="text-xs text-muted-foreground">{categoryExpenses.length} expense(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-red-600">${categoryTotal.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{percentage}% of revenue</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

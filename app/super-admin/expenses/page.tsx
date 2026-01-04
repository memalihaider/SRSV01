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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, TrendingUp, TrendingDown, DollarSign, Target, Filter, Download, RotateCw, Building2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface BranchExpense {
  id: string;
  branchId: string;
  branchName: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

interface BranchMetrics {
  branchId: string;
  branchName: string;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
}

const BRANCHES = [
  { id: 'branch1', name: 'Downtown' },
  { id: 'branch2', name: 'Uptown' },
  { id: 'branch3', name: 'Mall' }
];

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

export default function SuperAdminExpensesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  const [expenses, setExpenses] = useState<BranchExpense[]>([
    {
      id: '1',
      branchId: 'branch1',
      branchName: 'Downtown',
      category: 'Staff Salaries',
      description: 'Monthly payroll',
      amount: 8500,
      date: '2026-01-02',
      status: 'approved',
      notes: 'Regular monthly'
    },
    {
      id: '2',
      branchId: 'branch2',
      branchName: 'Uptown',
      category: 'Rent',
      description: 'Monthly rent',
      amount: 2500,
      date: '2026-01-01',
      status: 'approved',
      notes: 'Monthly rent'
    },
    {
      id: '3',
      branchId: 'branch3',
      branchName: 'Mall',
      category: 'Supplies',
      description: 'Hair products',
      amount: 450,
      date: '2026-01-03',
      status: 'pending',
      notes: 'Bulk supply'
    }
  ]);

  const [selectedBranch, setSelectedBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [newExpense, setNewExpense] = useState({
    branchId: '',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Calculate metrics by branch
  const branchMetrics = BRANCHES.map(branch => {
    const branchExpenses = expenses
      .filter(e => e.branchId === branch.id && e.status !== 'rejected')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const revenue = 15000; // Mock revenue per branch
    const profit = revenue - branchExpenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    return {
      branchId: branch.id,
      branchName: branch.name,
      revenue,
      expenses: branchExpenses,
      profit,
      profitMargin
    };
  });

  // Overall metrics
  const totalRevenue = branchMetrics.reduce((sum, b) => sum + b.revenue, 0);
  const totalExpenses = branchMetrics.reduce((sum, b) => sum + b.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const overallMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0';

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const branchMatch = selectedBranch === 'all' || expense.branchId === selectedBranch;
    const statusMatch = filterStatus === 'all' || expense.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || expense.category === filterCategory;
    const searchMatch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.branchName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return branchMatch && statusMatch && categoryMatch && searchMatch;
  });

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

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleAddExpense = () => {
    if (!newExpense.branchId || !newExpense.category || !newExpense.description || !newExpense.amount) return;
    
    const branch = BRANCHES.find(b => b.id === newExpense.branchId);
    const newExpenseItem: BranchExpense = {
      id: Date.now().toString(),
      branchId: newExpense.branchId,
      branchName: branch?.name || '',
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      status: 'pending',
      notes: newExpense.notes
    };
    
    setExpenses([...expenses, newExpenseItem]);
    setNewExpense({
      branchId: '',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleEditExpense = (expense: BranchExpense) => {
    // For now, just log the expense to edit
    console.log('Edit expense:', expense);
  };

  const handleReconciliation = () => {
    setExpenses(expenses.map(e => 
      e.status === 'pending' ? { ...e, status: 'approved' } : e
    ));
  };

  const downloadComprehensiveReport = () => {
    let report = `
COMPREHENSIVE EXPENSE REPORT - ALL BRANCHES
Generated: ${new Date().toLocaleDateString()}

OVERALL SUMMARY
Total Revenue: $${totalRevenue.toLocaleString()}
Total Expenses: $${totalExpenses.toLocaleString()}
Total Profit: $${totalProfit.toLocaleString()}
Overall Profit Margin: ${overallMargin}%

BRANCH BREAKDOWN
`;

    branchMetrics.forEach(branch => {
      report += `
${branch.branchName.toUpperCase()}
Revenue: $${branch.revenue.toLocaleString()}
Expenses: $${branch.expenses.toLocaleString()}
Profit: $${branch.profit.toLocaleString()}
Profit Margin: ${branch.profitMargin.toFixed(2)}%
---`;
    });

    report += `

DETAILED EXPENSES
${filteredExpenses.map(e => 
  `${e.date} | ${e.branchName} | ${e.category} | ${e.description} | $${e.amount} | ${e.status.toUpperCase()}`
).join('\n')}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', 'comprehensive-expense-report.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-[#f8f9fa]">
        {/* Sidebar */}
        <AdminSidebar
          role="super_admin"
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
                  role="super_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-serif font-bold text-primary">Branch Expense Management</h1>
                  <p className="text-sm text-muted-foreground">Monitor and reconcile expenses across all locations</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 rounded-lg">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Detailed View</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Overall KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-none shadow-sm rounded-xl">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Revenue</p>
                            <p className="text-3xl font-serif font-bold text-primary">${branchMetrics.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}</p>
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
                            <p className="text-3xl font-serif font-bold text-red-600">${branchMetrics.reduce((sum, m) => sum + m.expenses, 0).toLocaleString()}</p>
                          </div>
                          <TrendingDown className="w-12 h-12 text-red-500/20" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={cn(
                      "border-none shadow-sm rounded-xl",
                      branchMetrics.reduce((sum, m) => sum + m.profit, 0) >= 0 ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                    )}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Net Profit</p>
                            <p className={cn(
                              "text-3xl font-serif font-bold",
                              branchMetrics.reduce((sum, m) => sum + m.profit, 0) >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              ${branchMetrics.reduce((sum, m) => sum + m.profit, 0).toLocaleString()}
                            </p>
                          </div>
                          <TrendingUp className={cn("w-12 h-12", branchMetrics.reduce((sum, m) => sum + m.profit, 0) >= 0 ? "text-green-500/20" : "text-red-500/20")} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-xl">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Profit Margin</p>
                            <p className="text-3xl font-serif font-bold text-primary">{(branchMetrics.reduce((sum, m) => sum + m.profitMargin, 0) / branchMetrics.length).toFixed(2)}%</p>
                          </div>
                          <Target className="w-12 h-12 text-secondary/20" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Branch Performance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branchMetrics.map(metric => (
                      <Card key={metric.branchId} className="border-none shadow-sm rounded-xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-serif flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-secondary" />
                            {metric.branchName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Revenue</span>
                              <span className="font-bold text-primary">${metric.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Expenses</span>
                              <span className="font-bold text-red-600">${metric.expenses.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Profit</span>
                              <span className={cn(
                                "font-bold",
                                metric.profit >= 0 ? "text-green-600" : "text-red-600"
                              )}>
                                ${metric.profit.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Margin</span>
                              <span className="font-bold text-primary">{metric.profitMargin.toFixed(2)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  {/* Actions and Filters */}
                  <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Search expenses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-lg border-gray-200"
                      />
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-40 rounded-lg border-gray-200">
                          <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branches</SelectItem>
                          {BRANCHES.map(branch => (
                            <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        onClick={downloadComprehensiveReport}
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
                            <SheetTitle>Add New Expense</SheetTitle>
                            <SheetDescription>
                              Create a new expense record for a branch
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 mt-6">
                            <div>
                              <Label className="text-xs font-bold uppercase">Branch</Label>
                              <Select value={newExpense.branchId} onValueChange={(value) => setNewExpense({...newExpense, branchId: value})}>
                                <SelectTrigger className="mt-1 rounded-lg">
                                  <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                  {BRANCHES.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
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
                              Add Expense
                            </Button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>

                  {/* Expenses Table */}
                  <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 bg-gray-50">
                      <CardTitle className="text-lg font-serif">All Branch Expenses ({filteredExpenses.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Branch</th>
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
                                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                  No expenses found
                                </td>
                              </tr>
                            ) : (
                              filteredExpenses.map(expense => (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-sm font-semibold">{expense.branchName}</td>
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
                                            className="border-green-200 text-green-700 hover:bg-red-50 rounded-lg"
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
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Plus, Edit, Trash2, Mail, Phone, MapPin, FileText } from "lucide-react";
import { useBranchStore, BranchSettings } from "@/stores/branch.store";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { NotificationSystem, useNotifications } from "@/components/ui/notification-system";

export default function SuperAdminBranches() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { branches, updateBranch, addBranch, deleteBranch } = useBranchStore();
  const { notifications, addNotification, markAsRead, dismiss } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchSettings | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BranchSettings>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'UAE',
    trn: '',
    invoiceTemplate: 'modern',
    website: ''
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleEdit = (branch: BranchSettings) => {
    setEditingBranch(branch);
    setFormData(branch);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingBranch) {
      updateBranch(editingBranch.id, formData);
      addNotification({
        type: 'success',
        title: 'Branch Updated',
        message: 'Branch details have been updated successfully'
      });
    } else {
      addBranch({
        id: Date.now().toString(),
        ...formData
      } as BranchSettings);
      addNotification({
        type: 'success',
        title: 'Branch Added',
        message: 'New branch has been added successfully'
      });
    }
    setIsOpen(false);
    setEditingBranch(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'UAE',
      trn: '',
      invoiceTemplate: 'modern',
      website: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      deleteBranch(id);
      addNotification({
        type: 'success',
        title: 'Branch Deleted',
        message: 'Branch has been deleted successfully'
      });
    }
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar 
          role="super_admin" 
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <AdminMobileSidebar 
          role="super_admin" 
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Branch Management</h1>
              <p className="text-sm text-gray-500">Manage branch details and invoice settings</p>
            </div>
            <div className="flex items-center gap-4">
              <CurrencySwitcher />
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Add Branch Button */}
              <div className="flex justify-end">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button onClick={() => {
                      setEditingBranch(null);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        city: '',
                        postalCode: '',
                        country: 'UAE',
                        trn: '',
                        invoiceTemplate: 'modern',
                        website: ''
                      });
                    }} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Branch
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</SheetTitle>
                      <SheetDescription>
                        {editingBranch ? 'Update branch details and invoice settings' : 'Create a new branch with contact and invoice details'}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 mt-6">
                      {/* Basic Info */}
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Branch Name *</Label>
                        <Input
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Downtown Premium"
                        />
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-primary">Contact Information</h3>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Phone Number *</Label>
                          <Input
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+971-4-123-4567"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Email Address *</Label>
                          <Input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="branch@manofcave.com"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Website</Label>
                          <Input
                            value={formData.website || ''}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            placeholder="www.manofcave.com"
                          />
                        </div>
                      </div>

                      {/* Address Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-primary">Location Address</h3>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Street Address *</Label>
                          <Textarea
                            value={formData.address || ''}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Sheikh Zayed Road"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">City *</Label>
                            <Input
                              value={formData.city || ''}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="Dubai"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-semibold mb-2 block">Postal Code</Label>
                            <Input
                              value={formData.postalCode || ''}
                              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                              placeholder="12345"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Country *</Label>
                          <Select value={formData.country} onValueChange={(val) => setFormData({ ...formData, country: val })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UAE">United Arab Emirates</SelectItem>
                              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                              <SelectItem value="Kuwait">Kuwait</SelectItem>
                              <SelectItem value="Qatar">Qatar</SelectItem>
                              <SelectItem value="Bahrain">Bahrain</SelectItem>
                              <SelectItem value="Oman">Oman</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Tax Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-primary">Tax & Compliance</h3>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">TRN (Tax Registration Number) *</Label>
                          <Input
                            value={formData.trn || ''}
                            onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                            placeholder="AE123456789012345"
                          />
                          <p className="text-xs text-gray-500 mt-1">This will appear on all invoices for this branch</p>
                        </div>
                      </div>

                      {/* Invoice Template */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-primary">Invoice Settings</h3>
                        <div>
                          <Label className="text-sm font-semibold mb-2 block">Invoice Template</Label>
                          <Select value={formData.invoiceTemplate} onValueChange={(val: any) => setFormData({ ...formData, invoiceTemplate: val })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">Modern Template</SelectItem>
                              <SelectItem value="classic">Classic Template</SelectItem>
                              <SelectItem value="minimalist">Minimalist Template</SelectItem>
                              <SelectItem value="premium">Premium Template</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">Select the default template for invoice generation</p>
                        </div>
                      </div>

                      {/* Save Button */}
                      <Button onClick={handleSave} className="w-full mt-6">
                        {editingBranch ? 'Update Branch' : 'Add Branch'}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Branches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary/10 p-2 rounded-lg">
                            <Building2 className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{branch.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {branch.city}, {branch.country}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(branch)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(branch.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-secondary" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-secondary" />
                          <span className="truncate">{branch.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span className="truncate">{branch.address}</span>
                        </div>
                      </div>

                      {/* TRN and Template */}
                      <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">TRN:</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {branch.trn}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Invoice Template:</span>
                          <Badge variant="secondary" className="capitalize">
                            {branch.invoiceTemplate}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {branches.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center">No branches found. Add your first branch to get started.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>

        <NotificationSystem notifications={notifications} onDismiss={dismiss} onMarkAsRead={markAsRead} />
      </div>
    </ProtectedRoute>
  );
}

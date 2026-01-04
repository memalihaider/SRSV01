'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Phone, Users, DollarSign, TrendingUp, Plus, Search, Filter, Star } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminBranches() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock branches data
  const branches = [
    {
      id: 1,
      name: "Downtown Premium",
      location: "123 Main St, Downtown",
      manager: "Sarah Johnson",
      phone: "(555) 123-4567",
      employees: 8,
      revenue: 8920,
      customers: 234,
      rating: 4.9,
      status: "active",
      performance: "excellent",
      image: "https://images.unsplash.com/photo-1596728147529-4acd9626f52e?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Midtown Elite",
      location: "456 Oak Ave, Midtown",
      manager: "Mike Chen",
      phone: "(555) 234-5678",
      employees: 6,
      revenue: 7650,
      customers: 198,
      rating: 4.8,
      status: "active",
      performance: "good",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Uptown Luxury",
      location: "789 Pine Rd, Uptown",
      manager: "Alex Rodriguez",
      phone: "(555) 345-6789",
      employees: 10,
      revenue: 9230,
      customers: 256,
      rating: 4.9,
      status: "active",
      performance: "excellent",
      image: "https://images.unsplash.com/photo-1441716844725-09a46eceedbf?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Suburban Comfort",
      location: "321 Elm St, Suburb",
      manager: "Emma Davis",
      phone: "(555) 456-7890",
      employees: 5,
      revenue: 6780,
      customers: 167,
      rating: 4.6,
      status: "active",
      performance: "good",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Westside Modern",
      location: "654 Cedar Ln, Westside",
      manager: "John Smith",
      phone: "(555) 567-8901",
      employees: 7,
      revenue: 5420,
      customers: 142,
      rating: 4.5,
      status: "active",
      performance: "average",
      image: "https://images.unsplash.com/photo-1596728147529-4acd9626f52e?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Eastside Classic",
      location: "987 Maple Dr, Eastside",
      manager: "Lisa Brown",
      phone: "(555) 678-9012",
      employees: 6,
      revenue: 4980,
      customers: 128,
      rating: 4.4,
      status: "active",
      performance: "average",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Northgate Plaza",
      location: "147 Birch Ave, Northgate",
      manager: "Tom Wilson",
      phone: "(555) 789-0123",
      employees: 4,
      revenue: 3870,
      customers: 98,
      rating: 4.3,
      status: "active",
      performance: "needs_attention",
      image: "https://images.unsplash.com/photo-1596728147529-4acd9626f52e?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Southpoint Mall",
      location: "258 Spruce St, Southpoint",
      manager: "Maria Garcia",
      phone: "(555) 890-1234",
      employees: 3,
      revenue: 2830,
      customers: 74,
      rating: 4.2,
      status: "inactive",
      performance: "needs_attention",
      image: "https://images.unsplash.com/photo-1441716844725-09a46eceedbf?q=80&w=500&auto=format&fit=crop"
    }
  ];

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent": return "bg-blue-100 text-blue-800";
      case "good": return "bg-green-100 text-green-800";
      case "average": return "bg-yellow-100 text-yellow-800";
      case "needs_attention": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                  <p className="text-sm text-gray-600">Manage all your locations</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button className="bg-secondary hover:bg-secondary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Branch
                </Button>
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{branches.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {branches.filter(b => b.status === 'active').length} active locations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${branches.reduce((acc, branch) => acc + branch.revenue, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monthly revenue
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {branches.reduce((acc, branch) => acc + branch.employees, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across all branches
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(branches.reduce((acc, branch) => acc + branch.rating, 0) / branches.length).toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Customer satisfaction
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search branches..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Branches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches.map((branch) => (
                  <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <img
                        src={branch.image}
                        alt={branch.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={getStatusColor(branch.status)}>
                          {branch.status}
                        </Badge>
                        <Badge className={getPerformanceColor(branch.performance)}>
                          {branch.performance.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{branch.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {branch.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Manager:</span>
                            <p className="font-medium">{branch.manager}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Staff:</span>
                            <p className="font-medium">{branch.employees} members</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{branch.phone}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">${branch.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">{branch.customers}</div>
                            <div className="text-xs text-gray-500">Customers</div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 fill-secondary text-secondary" />
                              <span className="text-lg font-bold">{branch.rating}</span>
                            </div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBranches.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, TrendingUp, Building, BarChart3, Settings, UserPlus, LogOut, ChevronRight, MessageCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock data - in real app, this would come from API
  const overallStats = {
    totalBranches: 8,
    totalRevenue: 45680,
    totalCustomers: 1247,
    avgRating: 4.7,
    monthlyGrowth: 12.5,
  };

  const branchPerformance = [
    { name: "Downtown Premium", revenue: 8920, customers: 234, rating: 4.9, status: "excellent" },
    { name: "Midtown Elite", revenue: 7650, customers: 198, rating: 4.8, status: "good" },
    { name: "Uptown Luxury", revenue: 9230, customers: 256, rating: 4.9, status: "excellent" },
    { name: "Suburban Comfort", revenue: 6780, customers: 167, rating: 4.6, status: "good" },
    { name: "Westside Modern", revenue: 5420, customers: 142, rating: 4.5, status: "average" },
    { name: "Eastside Classic", revenue: 4980, customers: 128, rating: 4.4, status: "average" },
    { name: "Northgate Plaza", revenue: 3870, customers: 98, rating: 4.3, status: "needs_attention" },
    { name: "Southpoint Mall", revenue: 2830, customers: 74, rating: 4.2, status: "needs_attention" },
  ];

  const recentActivities = [
    { type: "new_booking", message: "New booking at Downtown Premium", time: "2 min ago" },
    { type: "staff_hired", message: "New barber hired at Midtown Elite", time: "15 min ago" },
    { type: "branch_update", message: "Uptown Luxury updated operating hours", time: "1 hour ago" },
    { type: "revenue_milestone", message: "Monthly revenue target achieved", time: "2 hours ago" },
    { type: "customer_feedback", message: "New 5-star review at Suburban Comfort", time: "3 hours ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "average": return "bg-yellow-100 text-yellow-800";
      case "needs_attention": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0",
          sidebarOpen ? "lg:ml-0" : "lg:ml-1"
        )}>
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
                  <h1 className="text-2xl font-serif font-bold text-primary">Super Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Multi-Branch Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex border-primary/10 text-primary hover:bg-primary/5">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto min-h-0 bg-[#f8f9fa]">
            <div className="h-full p-4 lg:p-8">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Branches</CardTitle>
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Building className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{overallStats.totalBranches}</div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      All locations active
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly Revenue</CardTitle>
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">${overallStats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +{overallStats.monthlyGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Customers</CardTitle>
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{overallStats.totalCustomers.toLocaleString()}</div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Average Rating</CardTitle>
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-secondary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{overallStats.avgRating}</div>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      +0.2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">
                      Peak hours utilization
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branch Performance */}
                <div className="lg:col-span-2">
                  <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-serif">
                        <Building className="w-5 h-5 text-secondary" />
                        Branch Performance Overview
                      </CardTitle>
                      <CardDescription>
                        Revenue, customers, and ratings across all locations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {branchPerformance.map((branch) => (
                          <div key={branch.name} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-secondary/30 hover:shadow-sm transition-all group">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-primary">{branch.name}</h3>
                                <Badge className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-none",
                                  branch.status === "excellent" ? "bg-green-100 text-green-700" :
                                  branch.status === "good" ? "bg-blue-100 text-blue-700" :
                                  branch.status === "average" ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                )}>
                                  {branch.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6 mt-2 text-sm">
                                <span className="text-muted-foreground">Revenue: <span className="text-primary font-semibold">${branch.revenue.toLocaleString()}</span></span>
                                <span className="text-muted-foreground">Customers: <span className="text-primary font-semibold">{branch.customers}</span></span>
                                <span className="text-muted-foreground">Rating: <span className="text-secondary font-bold">⭐ {branch.rating}</span></span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/5 font-bold text-xs uppercase tracking-widest">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Activities */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-gray-50">
                      <CardTitle className="text-lg font-serif">Quick Actions</CardTitle>
                      <CardDescription>
                        System-wide administrative tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <Button className="w-full justify-between h-12 px-4 rounded-xl border-gray-100 hover:border-secondary/30 hover:bg-secondary/5 hover:text-primary transition-all group" variant="outline">
                        <div className="flex items-center gap-3">
                          <UserPlus className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">Add New Branch</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                      </Button>
                      <Button className="w-full justify-between h-12 px-4 rounded-xl border-gray-100 hover:border-secondary/30 hover:bg-secondary/5 hover:text-primary transition-all group" variant="outline">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">Manage Staff</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                      </Button>
                      <Button className="w-full justify-between h-12 px-4 rounded-xl border-gray-100 hover:border-secondary/30 hover:bg-secondary/5 hover:text-primary transition-all group" variant="outline">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">Generate Reports</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                      </Button>
                      <Button className="w-full justify-between h-12 px-4 rounded-xl border-gray-100 hover:border-secondary/30 hover:bg-secondary/5 hover:text-primary transition-all group" variant="outline">
                        <div className="flex items-center gap-3">
                          <Settings className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">System Settings</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-gray-50">
                      <CardTitle className="text-lg font-serif">Recent Activities</CardTitle>
                      <CardDescription>
                        Latest updates across all branches
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-primary">{activity.message}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Performance Charts Placeholder */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>
                    Monthly revenue across all branches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Revenue chart visualization</p>
                      <p className="text-sm text-gray-400">Chart component would be implemented here</p>
                    </div>
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
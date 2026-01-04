'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/shared/Header';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

export default function CustomerLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Mock customer credentials
  const mockCustomers = [
    { email: 'john@example.com', password: 'john123', name: 'John Doe', phone: '(555) 123-4567' },
    { email: 'mike@example.com', password: 'mike123', name: 'Mike Smith', phone: '(555) 234-5678' },
    { email: 'customer@manofcave.com', password: 'customer123', name: 'Demo Customer', phone: '(555) 000-0000' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const customer = mockCustomers.find(
      c => c.email === loginData.email && c.password === loginData.password
    );

    if (customer) {
      // Store customer data in localStorage
      localStorage.setItem('customerAuth', JSON.stringify({
        isAuthenticated: true,
        customer: {
          email: customer.email,
          name: customer.name,
          phone: customer.phone
        }
      }));
      router.push('/customer/portal');
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store new customer data
    localStorage.setItem('customerAuth', JSON.stringify({
      isAuthenticated: true,
      customer: {
        email: registerData.email,
        name: registerData.name,
        phone: registerData.phone
      }
    }));
    router.push('/customer/portal');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />
      
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-black tracking-[0.2em] uppercase text-[10px]">Customer Portal</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">
              Welcome to <span className="text-secondary">Man of Cave</span>
            </h1>
            <p className="text-muted-foreground font-light">
              Sign in to manage your bookings, orders, and profile
            </p>
          </div>

          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-none">
                <TabsTrigger value="login" className="rounded-xl font-bold text-xs tracking-widest uppercase">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="rounded-xl font-bold text-xs tracking-widest uppercase">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="p-0">
                <CardHeader className="pb-4 pt-8 px-8">
                  <CardTitle className="text-xl font-serif">Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="pl-11 pr-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-muted-foreground">Remember me</span>
                      </label>
                      <a href="#" className="text-secondary hover:underline font-medium">Forgot password?</a>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-primary hover:bg-secondary hover:text-primary font-black tracking-[0.2em] text-xs rounded-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs font-bold text-blue-800 mb-2">Demo Credentials:</p>
                    <p className="text-xs text-blue-700">Email: customer@manofcave.com</p>
                    <p className="text-xs text-blue-700">Password: customer123</p>
                  </div>
                </CardContent>
              </TabsContent>
              
              {/* Register Tab */}
              <TabsContent value="register" className="p-0">
                <CardHeader className="pb-4 pt-8 px-8">
                  <CardTitle className="text-xl font-serif">Create Account</CardTitle>
                  <CardDescription>Join Man of Cave and start your journey</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={registerData.name}
                          onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-widest">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="you@example.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-widest">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-widest">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          className="pl-11 h-12 rounded-xl border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-secondary hover:bg-primary text-primary hover:text-white font-black tracking-[0.2em] text-xs rounded-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Admin Login Link */}
          <div className="text-center mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm font-medium text-primary"
            >
              <Lock className="w-4 h-4" />
              Admin Login
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-primary text-sm font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

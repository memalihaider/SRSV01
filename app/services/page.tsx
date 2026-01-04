'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Scissors, Star, Clock, Search, Filter, Check, ShoppingCart, ChevronRight, Sparkles, Plus, X } from 'lucide-react';
import { useBookingStore } from '@/stores/booking.store';
import { useServicesStore } from '@/stores/services.store';
import { useStaffStore } from '@/stores/staff.store';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const router = useRouter();
  const { addToCart, cartItems } = useBookingStore();
  const { services } = useServicesStore();
  const { staff } = useStaffStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedService, setAddedService] = useState<string | null>(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [showMultiSelectSheet, setShowMultiSelectSheet] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'haircut', name: 'Haircuts' },
    { id: 'beard', name: 'Beard Care' },
    { id: 'facial', name: 'Facial' },
    { id: 'package', name: 'Packages' },
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || (service.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ?? false);
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStaff = selectedStaff === 'all' || (service.staffIds && service.staffIds.includes(selectedStaff));
    return matchesCategory && matchesSearch && matchesStaff;
  });

  const handleAddToCart = (service: any) => {
    // Check if user is authenticated
    const authData = localStorage.getItem('customerAuth');
    const isAuthenticated = authData ? JSON.parse(authData).isAuthenticated : false;

    if (!isAuthenticated) {
      // Redirect to login
      router.push('/customer/login?redirect=/services');
      return;
    }

    addToCart(service);
    setAddedService(service.id);
    setTimeout(() => setAddedService(null), 2000);
  };

  const toggleServiceSelection = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const handleAddSelectedServices = () => {
    // Check if user is authenticated
    const authData = localStorage.getItem('customerAuth');
    const isAuthenticated = authData ? JSON.parse(authData).isAuthenticated : false;

    if (!isAuthenticated) {
      // Redirect to login
      router.push('/customer/login?redirect=/services');
      return;
    }

    selectedServices.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        addToCart({
          id: service.id,
          name: service.name,
          category: service.category || 'Service',
          duration: service.duration?.toString() || '0',
          price: service.price || 0,
          description: service.description || '',
          image: service.image,
          rating: 5,
          reviews: 0
        });
      }
    });
    setSelectedServices(new Set());
    setShowMultiSelectSheet(false);
    setMultiSelectMode(false);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      {/* Premium Hero */}
      <section className="relative py-32 px-4 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block bg-secondary/20 px-3 py-1 rounded-full mb-6 border border-secondary/30">
            <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">The Menu</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Our <span className="text-secondary italic">Services</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Experience the pinnacle of grooming. Each service is a bespoke ritual designed for the modern gentleman.
          </p>
        </div>
      </section>

      {/* Filters - Premium Glassmorphism */}
      <section className="sticky top-16 z-30 bg-white/60 backdrop-blur-2xl border-b border-gray-100 py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input 
                placeholder="Search services..." 
                className="pl-11 rounded-2xl border-gray-100 bg-gray-50/50 text-sm h-12 focus:ring-secondary focus:border-secondary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Sheet open={showMultiSelectSheet} onOpenChange={setShowMultiSelectSheet}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline"
                    className={cn(
                      "rounded-2xl border-2 font-black tracking-widest text-[10px] uppercase px-6 py-2.5 transition-all gap-2 h-12",
                      selectedServices.size > 0
                        ? "bg-secondary border-secondary text-primary hover:bg-secondary/90"
                        : "border-secondary text-secondary hover:bg-secondary/10"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    MULTI-SELECT
                    {selectedServices.size > 0 && (
                      <Badge className="bg-primary text-white border-none ml-1">{selectedServices.size}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader className="border-b pb-4 mb-6">
                    <SheetTitle className="text-2xl font-serif font-bold">Select Multiple Services</SheetTitle>
                    <SheetDescription>
                      Choose multiple services to add to your booking at once
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pb-6">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => toggleServiceSelection(service.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                          selectedServices.has(service.id)
                            ? "border-secondary bg-secondary/10"
                            : "border-gray-100 bg-white hover:border-secondary"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                            selectedServices.has(service.id)
                              ? "bg-secondary border-secondary"
                              : "border-gray-300"
                          )}>
                            {selectedServices.has(service.id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <h3 className="font-bold text-primary">{service.name}</h3>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-secondary" />
                                <span className="text-xs font-bold text-secondary">{service.duration}m</span>
                                <span className="font-bold text-primary">${service.price}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{service.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedServices.size > 0 && (
                    <div className="sticky bottom-0 bg-white border-t pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Selected:</span>
                        <span className="text-lg font-bold text-secondary">{selectedServices.size} services</span>
                      </div>
                      <Button 
                        onClick={handleAddSelectedServices}
                        className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-6 rounded-2xl tracking-[0.2em] text-sm"
                      >
                        ADD {selectedServices.size} SERVICE{selectedServices.size !== 1 ? 'S' : ''} TO BOOKING
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedServices(new Set())}
                        className="w-full border-secondary text-secondary rounded-2xl font-bold tracking-widest text-[10px]"
                      >
                        CLEAR SELECTION
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "whitespace-nowrap px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all border rounded-2xl",
                    selectedCategory === cat.id 
                      ? "bg-primary text-white border-primary shadow-xl scale-105" 
                      : "bg-white text-primary border-gray-100 hover:border-secondary hover:text-secondary"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Filter - Premium */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 border-t border-gray-50">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="w-3 h-3 text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Master Artisans:</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedStaff('all')}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  selectedStaff === 'all' ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-gray-50 text-muted-foreground hover:bg-gray-100"
                )}
              >
                All Barbers
              </button>
              {staff.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaff(member.id)}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-3 border",
                    selectedStaff === member.id 
                      ? "bg-secondary/20 text-secondary border-secondary/30 shadow-sm" 
                      : "bg-gray-50 text-muted-foreground border-transparent hover:border-gray-200"
                  )}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 border border-white shadow-sm">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  {member.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Premium Cards */}
      <section className="py-20 px-4 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredServices.map((service) => (
              <Card key={service.id} className="group border-none bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={service.image || "https://images.unsplash.com/photo-1599351431247-f5094021186d?q=80&w=2070&auto=format&fit=crop"} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md text-primary border-none px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                      ${service.price}
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Badge className="bg-secondary text-primary border-none px-3 py-1 font-black text-[9px] tracking-widest uppercase">
                      PREMIUM RITUAL
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pt-8 pb-4 px-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-black">{service.category}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{service.duration} MIN</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-serif font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm font-light leading-relaxed line-clamp-3 mb-8">
                    {service.description}
                  </p>
                  <div className="mt-auto flex gap-3">
                    <Button 
                      onClick={() => handleAddToCart(service)}
                      className={cn(
                        "flex-1 h-14 rounded-2xl font-black tracking-[0.2em] text-[10px] transition-all duration-500 shadow-lg",
                        addedService === service.id 
                          ? "bg-green-600 hover:bg-green-600 text-white scale-95" 
                          : "bg-primary hover:bg-secondary hover:text-primary text-white"
                      )}
                    >
                      {addedService === service.id ? (
                        <><Check className="w-4 h-4 mr-2" /> ADDED TO RITUAL</>
                      ) : (
                        <><ShoppingCart className="w-4 h-4 mr-2" /> ADD TO BOOKING</>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                      className="w-14 h-14 rounded-2xl border-gray-100 text-primary hover:border-secondary hover:text-secondary transition-all duration-500 shadow-sm"
                    >
                      <Link href="/booking"><ChevronRight className="w-5 h-5" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary mb-2">No services found</h3>
              <p className="text-muted-foreground font-light mb-8">Try adjusting your search or filters to find your perfect ritual.</p>
              <Button 
                variant="outline" 
                onClick={() => {setSelectedCategory('all'); setSearchQuery('');}}
                className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary hover:text-primary font-black tracking-widest text-[10px]"
              >
                RESET ALL FILTERS
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

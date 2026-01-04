'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/Header";
import { MapPin, Star, Clock, Phone, Search, Filter, CheckCircle2, ArrowRight, Sparkles, Award, Users, Zap, Crown, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const branches = [
  {
    id: "downtown",
    name: "Downtown Premium",
    address: "123 Main Street, Downtown",
    phone: "(555) 123-4567",
    rating: 4.9,
    reviews: 247,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
    services: ["Haircuts", "Beard Grooming", "Premium Packages"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["VIP Lounge", "Free WiFi", "Beverages"],
  },
  {
    id: "midtown",
    name: "Midtown Elite",
    address: "456 Oak Avenue, Midtown",
    phone: "(555) 234-5678",
    rating: 4.8,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1621605815841-aa887ad43639?q=80&w=2070&auto=format&fit=crop",
    services: ["Haircuts", "Beard Grooming", "Color Services"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Private Rooms", "Premium Products", "Parking"],
  },
  {
    id: "uptown",
    name: "Uptown Luxury",
    address: "789 Pine Road, Uptown",
    phone: "(555) 345-6789",
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1599351431247-f5094021186d?q=80&w=2070&auto=format&fit=crop",
    services: ["Haircuts", "Beard Grooming", "Premium Packages", "Color"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Spa Services", "VIP Treatment", "Valet Parking"],
  },
  {
    id: "suburban",
    name: "Suburban Comfort",
    address: "321 Elm Street, Suburbs",
    phone: "(555) 456-7890",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop",
    services: ["Haircuts", "Beard Grooming", "Family Services"],
    hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    features: ["Family Friendly", "Ample Parking", "Quick Service"],
  },
];

export default function Branches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("All");

  const allServices = ["All", ...Array.from(new Set(branches.flatMap(b => b.services)))];

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         branch.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedService === "All" || branch.services.includes(selectedService);
    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      {/* Premium Hero */}
      <section className="relative py-32 px-4 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-white/10 blur-[80px] animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 animate-bounce delay-500">
            <Crown className="w-8 h-8 text-secondary/30" />
          </div>
          <div className="absolute top-40 right-20 animate-bounce delay-1000">
            <Award className="w-6 h-6 text-secondary/20" />
          </div>
          <div className="absolute bottom-32 left-20 animate-bounce delay-1500">
            <Shield className="w-7 h-7 text-secondary/25" />
          </div>
          <div className="absolute bottom-20 right-10 animate-bounce delay-2000">
            <Zap className="w-5 h-5 text-secondary/20" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6 border border-secondary/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">Our Presence</span>
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Premium <span className="text-secondary italic relative">Locations
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-secondary/50 rounded-full"></div>
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed mb-12">
            Experience luxury grooming at any of our strategically located branches. Each location is a sanctuary of style and sophistication.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-serif font-bold text-secondary mb-2">4</div>
              <div className="text-white/70 text-xs font-black uppercase tracking-widest">Premium Locations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-serif font-bold text-secondary mb-2">750+</div>
              <div className="text-white/70 text-xs font-black uppercase tracking-widest">Happy Clients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-serif font-bold text-secondary mb-2">4.8</div>
              <div className="text-white/70 text-xs font-black uppercase tracking-widest">Average Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-serif font-bold text-secondary mb-2">24/7</div>
              <div className="text-white/70 text-xs font-black uppercase tracking-widest">Premium Service</div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20 px-4 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Filters - Premium Glassmorphism */}
          <div className="flex flex-col md:flex-row gap-8 mb-16 p-8 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
            
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input 
                placeholder="Search by name or address..." 
                className="pl-11 h-14 rounded-2xl border-gray-100 bg-white/50 focus:border-secondary focus:ring-secondary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2 shrink-0 mr-2">
                <Filter className="w-3 h-3 text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Filter:</span>
              </div>
              {allServices.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border relative group",
                    selectedService === service 
                      ? "bg-primary text-white border-primary shadow-xl scale-105" 
                      : "bg-white text-primary border-gray-100 hover:border-secondary hover:text-secondary hover:shadow-lg"
                  )}
                >
                  {service}
                  {selectedService === service && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredBranches.map((branch) => (
              <Card key={branch.id} className="group overflow-hidden border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] bg-white rounded-[3rem] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 relative">
                {/* Premium Badge */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-secondary/90 backdrop-blur-md text-primary border-none px-3 py-1.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-1.5 animate-pulse">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                  <div className="md:col-span-2 relative overflow-hidden">
                    <img 
                      src={branch.image} 
                      alt={branch.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Rating Overlay */}
                    <div className="absolute top-6 left-6 z-10">
                      <div className="bg-white/90 backdrop-blur-md text-primary border-none px-3 py-1.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        {branch.rating}
                        <span className="text-muted-foreground text-[10px] font-medium">({branch.reviews})</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="flex gap-3">
                        <Button size="sm" variant="secondary" className="flex-1 bg-white/90 backdrop-blur-md text-primary hover:bg-white rounded-xl">
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="secondary" className="flex-1 bg-white/90 backdrop-blur-md text-primary hover:bg-white rounded-xl">
                          <MapPin className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-10 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <div className="inline-flex items-center gap-2 border border-secondary/30 text-secondary text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full mb-3">
                          <Award className="w-2.5 h-2.5" />
                          FLAGSHIP STUDIO
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-primary group-hover:text-secondary transition-colors duration-300">{branch.name}</h3>
                        <p className="text-sm text-muted-foreground font-light flex items-center gap-2 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-secondary" />
                          {branch.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <Clock className="w-4 h-4 text-secondary" />
                            <div>
                              <div className="font-black text-primary">Mon-Sat</div>
                              <div>9AM-7PM</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <Phone className="w-4 h-4 text-secondary" />
                            <div>
                              <div className="font-black text-primary">Direct</div>
                              <div>{branch.phone}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Services</div>
                          <div className="flex flex-wrap gap-1">
                            {branch.services.slice(0, 2).map((service, i) => (
                              <span key={i} className="text-[9px] font-black uppercase tracking-widest text-primary/70 bg-gray-50 px-2 py-1 rounded-md">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {branch.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary/70 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-secondary/10 transition-colors">
                            <CheckCircle2 className="w-2.5 h-2.5 text-secondary" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10 flex items-center justify-between border-t border-gray-50 mt-8">
                      <Button variant="link" asChild className="p-0 h-auto text-primary font-black text-[10px] tracking-[0.2em] group/btn uppercase border-b border-transparent hover:border-secondary pb-1 transition-all">
                        <Link href={`/branches/${branch.id}`} className="flex items-center gap-2">
                          VIEW DETAILS <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                      </Button>
                      <div className="flex gap-3">
                        <Button size="sm" asChild className="bg-gray-100 hover:bg-gray-200 text-primary font-black rounded-2xl px-6 h-12 transition-all duration-300">
                          <Link href={`tel:${branch.phone}`}>
                            <Phone className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" asChild className="bg-primary hover:bg-secondary hover:text-primary text-white font-black rounded-2xl px-6 h-12 transition-all duration-500 shadow-lg">
                          <Link href="/booking">BOOK NOW</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredBranches.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary mb-2">No branches found</h3>
                <p className="text-muted-foreground font-light mb-8 max-w-md mx-auto">Try adjusting your search or filters to find your nearest sanctuary.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full px-8 border-secondary text-secondary hover:bg-secondary hover:text-primary font-black tracking-widest text-[10px]"
                    onClick={() => { setSearchQuery(""); setSelectedService("All"); }}
                  >
                    RESET ALL FILTERS
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-white font-black tracking-widest text-[10px]"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    BROWSE ALL LOCATIONS
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

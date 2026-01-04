'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scissors, MapPin, Star, Clock, Phone, Mail, Award, Users, 
  Calendar, ChevronRight, ShoppingBag, Ticket, ArrowRight,
  Quote, Instagram, CheckCircle2, ShieldCheck, Zap, Building
} from "lucide-react";
import { Header } from "@/components/shared/Header";
import Link from "next/link";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useServicesStore } from "@/stores/services.store";
import { useProductsStore } from "@/stores/products.store";
import { useStaffStore } from "@/stores/staff.store";
import { cn } from "@/lib/utils";

export default function Home() {
  const { services } = useServicesStore();
  const { products } = useProductsStore();
  const { staff } = useStaffStore();

  const coupons = [
    { code: "WELCOME20", discount: "20% OFF", description: "On your first visit", color: "bg-secondary" },
    { code: "LUXURY50", discount: "$50 OFF", description: "On Premium Packages", color: "bg-primary" },
    { code: "STYLE10", discount: "10% OFF", description: "On all hair products", color: "bg-accent" },
    { code: "GROOMED", discount: "FREE SHAVE", description: "With any signature cut", color: "bg-secondary" },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      {/* Hero Section - Enhanced */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden mt-[3.5rem]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-slow-zoom"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black/70 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-secondary">For The Modern Caveman</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 leading-[1.1] tracking-tight drop-shadow-2xl">
            Unleash Your <br />
            <span className="text-secondary italic">Raw</span> Potential
          </h1>
          
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light text-gray-300 leading-relaxed drop-shadow-lg">
            Primal grooming for the modern man. Embrace your inner strength with bold, authentic style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-primary font-bold px-10 py-7 text-base rounded-xl transition-all duration-500 shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] hover:scale-105 active:scale-95">
              <Link href="/booking">RESERVE YOUR CHAIR</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-primary hover:bg-white hover:text-primary px-10 py-7 text-base rounded-xl transition-all duration-500 backdrop-blur-sm hover:scale-105 active:scale-95">
              <Link href="/services">VIEW OUR MENU</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-secondary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Enhanced */}
      <section className="py-10 border-b border-gray-100 bg-white relative z-20 -mt-10 mx-4 md:mx-10 rounded-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, label: "Master Barbers", value: "15+", desc: "Expertly Trained" },
              { icon: Users, label: "Happy Clients", value: "50k+", desc: "Loyal Community" },
              { icon: MapPin, label: "Luxury Studios", value: "8", desc: "Prime Locations" },
              { icon: Star, label: "Average Rating", value: "4.9", desc: "Client Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                  <stat.icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                </div>
                <span className="text-2xl font-serif font-bold text-primary mb-0.5">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-1">{stat.label}</span>
                <span className="text-[9px] text-muted-foreground font-medium">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-12 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8 font-bold">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['GQ', 'VOGUE', 'ESQUIRE', 'FORBES', 'MEN\'S HEALTH'].map((brand) => (
              <span key={brand} className="text-2xl md:text-3xl font-serif font-black tracking-tighter text-primary">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Coupon Slider Section - Enhanced */}
      <section className="py-20 px-4 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Exclusive Privileges</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">Member Rewards</h2>
            </div>
            <p className="text-muted-foreground max-w-md text-sm font-light">
              Unlock premium benefits and exclusive savings designed for our most loyal patrons.
            </p>
          </div>
          
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-6">
              {coupons.map((coupon, i) => (
                <CarouselItem key={i} className="pl-6 md:basis-1/2 lg:basis-1/4">
                  <div className={cn(
                    "p-8 rounded-3xl text-white relative overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2",
                    coupon.color
                  )}>
                    <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-125 group-hover:rotate-45 transition-all duration-700">
                      <Ticket className="w-32 h-32 rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-widest opacity-70 uppercase block mb-1">{coupon.description}</span>
                        <h4 className="text-4xl font-serif font-bold">{coupon.discount}</h4>
                      </div>
                      <div className="pt-4 flex items-center justify-between border-t border-white/20">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-widest opacity-60">Use Code</span>
                          <code className="bg-white/20 px-3 py-1 rounded-lg text-sm font-mono font-bold tracking-wider block">{coupon.code}</code>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white">
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0 border-primary/10 hover:bg-primary hover:text-white transition-all" />
              <CarouselNext className="static translate-y-0 border-primary/10 hover:bg-primary hover:text-white transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Services Slider Section - Enhanced */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Our Signature Menu</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">Bespoke Services</h2>
            </div>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-6 font-bold tracking-widest group transition-all duration-500">
              <Link href="/services" className="flex items-center">
                EXPLORE FULL MENU <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-6">
              {services.map((service) => (
                <CarouselItem key={service.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <Card className="group border-none bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden rounded-[2rem] transition-all duration-500">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={service.image || "https://images.unsplash.com/photo-1599351431247-f5094021186d?q=80&w=2070&auto=format&fit=crop"} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md text-primary border-none px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                          ${service.price}
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary font-black rounded-xl py-6 shadow-2xl">
                          <Link href="/booking">BOOK THIS SERVICE</Link>
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="px-8 pt-8 pb-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-black">{service.category}</span>
                        <div className="flex items-center gap-2 text-muted-foreground bg-gray-50 px-3 py-1 rounded-full">
                          <Clock className="w-3 h-3 text-secondary" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">{service.duration} MIN</span>
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-serif font-bold text-primary group-hover:text-secondary transition-colors duration-300">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 font-light">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center gap-4 mt-12">
              <CarouselPrevious className="static translate-y-0 border-primary/10 hover:bg-primary hover:text-white transition-all" />
              <CarouselNext className="static translate-y-0 border-primary/10 hover:bg-primary hover:text-white transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Products Slider Section - Enhanced */}
      <section className="py-24 px-4 bg-[#0f0f0f] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <div className="inline-block bg-secondary/20 px-3 py-1 rounded-full border border-secondary/30">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Premium Apothecary</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Grooming Essentials</h2>
            </div>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white hover:text-primary rounded-full px-8 py-6 font-bold tracking-widest group transition-all duration-500">
              <Link href="/products" className="flex items-center">
                SHOP ALL PRODUCTS <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-6">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-6 md:basis-1/2 lg:basis-1/4">
                  <div className="group cursor-pointer bg-white/[0.03] p-6 border border-white/10 rounded-[2.5rem] hover:bg-white/[0.07] hover:border-secondary/50 transition-all duration-500">
                    <div className="relative aspect-square overflow-hidden mb-6 rounded-[2rem] bg-white/5">
                      <img 
                        src={product.image || "https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop"} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      {product.status === 'low-stock' && (
                        <div className="absolute top-4 left-4 bg-secondary text-primary px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-2xl">
                          LIMITED EDITION
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <Button className="bg-white text-primary hover:bg-secondary hover:text-primary rounded-full w-12 h-12 p-0 shadow-2xl">
                          <ShoppingBag className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black">{product.category}</span>
                        <span className="text-secondary font-black text-lg">${product.price}</span>
                      </div>
                      <h4 className="text-xl font-serif font-bold group-hover:text-secondary transition-colors duration-300 truncate">{product.name}</h4>
                      <div className="flex items-center gap-1.5 pt-1">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-2.5 h-2.5", s <= Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-gray-700")} />)}
                        </div>
                        <span className="text-[10px] font-black text-gray-400">{product.rating}</span>
                      </div>
                      <Button className="w-full mt-6 bg-white/10 hover:bg-secondary hover:text-primary text-white rounded-2xl py-6 text-[10px] font-black tracking-[0.2em] transition-all duration-500 border border-white/5 hover:border-secondary">
                        ADD TO COLLECTION
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end gap-3 mt-12">
              <CarouselPrevious className="static translate-y-0 border-white/10 text-white hover:bg-white/10 transition-all" />
              <CarouselNext className="static translate-y-0 border-white/10 text-white hover:bg-white/10 transition-all" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* The Experience Section - Enhanced */}
      <section className="py-32 px-4 overflow-hidden bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                  alt="Luxury Barber Shop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square bg-secondary/5 rounded-full -z-0 animate-pulse"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 -z-0"></div>
              
              <div className="absolute bottom-10 left-10 right-10 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Est. 2015</h4>
                    <p className="text-white/60 text-xs uppercase tracking-widest">Legacy of Excellence</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm font-light leading-relaxed italic">
                  "We don't just cut hair; we sculpt confidence. Every stroke is a testament to our commitment to the craft."
                </p>
              </div>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full">
                  <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">The Man Of Cave Philosophy</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-[1.1]">
                  More Than A Cut. <br />
                  <span className="text-secondary italic">A Masterpiece.</span>
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                At Man of Cave, we believe that grooming is the ultimate form of self-expression. Our master barbers combine centuries-old traditions with modern precision to ensure you leave not just looking your best, but feeling your absolute best.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Premium Spirits", desc: "Complimentary top-shelf drinks" },
                  { title: "Hot Towel Ritual", desc: "Traditional steam treatment" },
                  { title: "Style Consultation", desc: "Bespoke grooming advice" },
                  { title: "Luxury Products", desc: "Exclusive apothecary range" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Button variant="link" className="text-primary font-black tracking-[0.2em] p-0 h-auto group text-xs uppercase border-b-2 border-secondary pb-2 hover:text-secondary transition-all">
                  DISCOVER OUR STORY <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Slider Section - Enhanced */}
      <section className="py-32 px-4 bg-gray-50/50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full mb-4">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">The Artisans</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6">Meet The Masters</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
              Our barbers are more than just stylists; they are highly trained artisans dedicated to the perfection of their craft.
            </p>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-8">
              {staff.map((member) => (
                <CarouselItem key={member.id} className="pl-8 basis-1/4">
                  <Card className="group overflow-hidden border-none shadow-none bg-transparent">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-8 shadow-2xl">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                        <div className="flex gap-4 mb-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                          <a href="#" className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:scale-110 transition-all shadow-xl">
                            <Instagram className="w-5 h-5" />
                          </a>
                          <Button className="bg-white text-primary hover:bg-secondary hover:text-primary rounded-2xl px-6 font-black text-[10px] tracking-widest shadow-xl">
                            BOOK NOW
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <div className="inline-block border border-secondary/30 text-secondary text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-4">
                        {member.role}
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">{member.name}</h3>
                      <p className="text-sm text-muted-foreground font-light line-clamp-2 mb-6 leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-secondary text-secondary" />)}
                        </div>
                        <span className="text-xs font-black text-primary">{member.rating}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">({member.reviews} REVIEWS)</span>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-6 mt-16">
              <CarouselPrevious className="static translate-y-0 w-14 h-14 border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg" />
              <CarouselNext className="static translate-y-0 w-14 h-14 border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Branches Section - Enhanced */}
      <section className="py-32 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full">
                  <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Our Global Presence</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-[1.1]">Luxury Grooming, <br /><span className="text-secondary italic">Everywhere.</span></h2>
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
                  With 8 flagship studios across the city's most prestigious districts, we bring the ultimate grooming experience closer to you. Each location is a sanctuary of style.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { name: "Downtown Premium", area: "Financial District", icon: Building },
                  { name: "Midtown Elite", area: "Shopping District", icon: ShoppingBag },
                  { name: "Uptown Luxury", area: "Residential Area", icon: Star },
                  { name: "Suburban Comfort", area: "West Side", icon: MapPin },
                ].map((branch, i) => (
                  <div key={i} className="flex items-start gap-6 p-6 rounded-[2rem] bg-gray-50 border border-transparent hover:border-secondary/30 hover:bg-white hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-1">{branch.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{branch.area}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-10 py-8 rounded-2xl group shadow-2xl transition-all duration-500 hover:scale-105">
                  <Link href="/branches" className="flex items-center gap-3 font-black tracking-[0.2em] text-xs">
                    EXPLORE ALL BRANCHES <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                  alt="Luxury Interior" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-12 -left-12 bg-secondary p-10 rounded-[3rem] shadow-2xl z-20 max-w-sm hidden md:block transform group-hover:-translate-y-4 transition-transform duration-700">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-primary font-serif text-2xl font-bold mb-4 italic leading-tight">"The attention to detail is simply unmatched. A true sanctuary."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-primary/20"></div>
                  <p className="text-primary/60 text-[10px] uppercase tracking-[0.3em] font-black">James Wilson, CEO</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/5 rounded-full -z-0 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className="py-32 px-4 bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-block bg-secondary/20 px-3 py-1 rounded-full mb-4 border border-secondary/30">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Client Voices</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">The Man of Cave Experience</h2>
            <div className="w-24 h-1 bg-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "James Wilson",
                role: "Business Executive",
                content: "The attention to detail here is unmatched. I've been to many high-end barbers, but the experience at Man of Cave is truly on another level of sophistication.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
                textColor: "white"
              },
              {
                name: "Michael Chen",
                role: "Creative Director",
                content: "Found my forever barber. The atmosphere is sophisticated yet welcoming, and the service is consistently perfect every single time. A true ritual.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
                textColor: "white"
              },
              {
                name: "David Thompson",
                role: "Professional Athlete",
                content: "Luxury at its finest. From the moment you walk in, you're treated like royalty. The beard trim and facial are highly recommended for any gentleman.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
                textColor: "white"
              }
            ].map((testimonial, i) => (
              <Card key={i} className={`p-10 border rounded-[3rem] relative group transition-all duration-700 hover:-translate-y-4 shadow-2xl bg-primary border-primary text-white hover:bg-secondary`}>
                <div className="absolute -top-5 left-10 w-12 h-12 bg-secondary flex items-center justify-center rounded-2xl text-primary shadow-xl group-hover:bg-white transition-colors">
                  <Quote className="w-6 h-6" />
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-1 text-white group-hover:text-primary transition-colors">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xl font-light italic leading-relaxed opacity-80 group-hover:opacity-100 text-white">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-5 pt-6 border-t border-white/5 group-hover:border-primary/10 transition-colors">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest text-white">{testimonial.name}</h4>
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 group-hover:opacity-70 text-white/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Enhanced */}
      <section className="py-32 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-block bg-secondary/10 px-3 py-1 rounded-full">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-[10px]">Visual Narrative</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary">The Art of Grooming</h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                A curated glimpse into our world of precision, style, and luxury. Every cut is a masterpiece, every client a canvas for our artisans.
              </p>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-10 py-7 font-black tracking-widest text-xs transition-all duration-500 shadow-xl">
              FOLLOW OUR JOURNEY
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1621605815841-aa887ad43639?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1599351431247-f5094021186d?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1593702295094-272a67d9963c?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1622286332618-f28020997e3a?q=80&w=2070&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070&auto=format&fit=crop"
            ].map((img, i) => (
              <div key={i} className={cn(
                "relative overflow-hidden rounded-[2.5rem] group aspect-square shadow-xl",
                i === 1 || i === 6 ? "md:row-span-2 md:aspect-auto" : ""
              )}>
                <img 
                  src={img} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Instagram className="text-white w-8 h-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-32 px-4 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary blur-[150px] animate-pulse"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-secondary/20 px-4 py-1.5 rounded-full mb-8 border border-secondary/30">
            <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">The Inner Circle</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-10 leading-tight">Join The <span className="text-secondary italic">Elite</span></h2>
          <p className="text-xl text-gray-400 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
            Subscribe to receive exclusive invitations, grooming insights, and priority access to our most sought-after events.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 max-w-3xl mx-auto bg-white/5 p-3 rounded-[2.5rem] border border-white/10 backdrop-blur-xl shadow-2xl">
            <input 
              placeholder="Your prestigious email address" 
              className="h-16 bg-transparent text-white rounded-2xl px-8 focus:outline-none transition-all w-full font-light text-lg"
            />
            <Button size="lg" className="h-16 bg-secondary text-primary hover:bg-white hover:scale-105 transition-all font-black px-12 rounded-[1.8rem] shrink-0 tracking-[0.2em] text-xs">
              SUBSCRIBE NOW
            </Button>
          </div>
          <p className="text-[10px] text-gray-500 mt-10 uppercase tracking-[0.3em] font-bold">
            Privacy is our priority. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="relative py-40 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-primary/95 via-primary/80 to-primary/95"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white space-y-12">
          <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] tracking-tight">
            Your Chair <br />
            <span className="text-secondary italic">Awaits.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Step into a world where time slows down and style takes center stage. Experience the pinnacle of luxury grooming today.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
            <Button size="lg" asChild className="bg-secondary hover:bg-white text-primary font-black px-14 py-10 text-sm rounded-2xl shadow-[0_20px_50px_rgba(197,160,89,0.3)] transition-all duration-500 hover:scale-110 tracking-[0.2em]">
              <Link href="/booking">BOOK APPOINTMENT</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-primary hover:bg-white hover:text-primary px-14 py-10 text-sm rounded-2xl backdrop-blur-md transition-all duration-500 hover:scale-110 tracking-[0.2em]">
              <Link href="/login">JOIN THE CLUB</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-[#050505] text-white py-32 px-4 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
            <div className="space-y-10">
              <Link href="/" className="inline-block">
                <h3 className="text-3xl font-serif font-bold tracking-tighter">PREMIUM<span className="text-secondary">CUTS</span></h3>
              </Link>
              <p className="text-gray-500 text-base leading-relaxed font-light max-w-xs">
                The city's premier destination for luxury grooming and traditional barbering since 2015. We combine heritage techniques with modern sophistication.
              </p>
              <div className="flex gap-6">
                {[Instagram, Phone, Mail].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all duration-500 cursor-pointer group shadow-xl">
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-secondary">Navigation</h4>
              <ul className="space-y-5 text-gray-400 text-sm font-medium">
                {['Our Services', 'Locations', 'Book Appointment', 'Shop Products', 'Our Barbers'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-secondary transition-colors flex items-center group">
                      <div className="w-0 group-hover:w-4 h-[1px] bg-secondary transition-all duration-300 mr-0 group-hover:mr-3"></div>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-secondary">Studio Hours</h4>
              <ul className="space-y-6 text-gray-400 text-sm font-medium">
                {[
                  { day: 'Monday - Friday', time: '9am - 8pm' },
                  { day: 'Saturday', time: '10am - 6pm' },
                  { day: 'Sunday', time: '11am - 4pm' }
                ].map((item) => (
                  <li key={item.day} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="font-light">{item.day}</span>
                    <span className="text-white font-bold">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-10 uppercase tracking-[0.3em] text-[10px] text-secondary">Concierge</h4>
              <ul className="space-y-8 text-gray-400 text-sm font-medium">
                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="font-light leading-relaxed">123 Luxury Way, Suite 100<br />Financial District, NY 10004</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-light">+1 (555) 000-1234</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-light">concierge@manofcave.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 text-[9px] tracking-[0.4em] font-black uppercase">
            <p>&copy; 2026 MAN OF CAVE LUXURY GROOMING. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

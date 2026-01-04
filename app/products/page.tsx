'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Star, ShoppingCart, Filter, Package, Check, Sparkles, ChevronRight } from 'lucide-react';
import { useProductsStore } from '@/stores/products.store';
import { useStaffStore } from '@/stores/staff.store';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
  const { products } = useProductsStore();
  const { staff } = useStaffStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProduct, setAddedProduct] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'hair', name: 'Hair Care' },
    { id: 'beard', name: 'Beard Care' },
    { id: 'skin', name: 'Skin Care' },
    { id: 'styling', name: 'Styling' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStaff = selectedStaff === 'all' || (product.staffIds && product.staffIds.includes(selectedStaff));
    return matchesCategory && matchesSearch && matchesStaff;
  });

  const handleAddToCart = (id: number) => {
    setAddedProduct(id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      {/* Premium Hero */}
      <section className="relative py-32 px-4 overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-[120px] animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block bg-secondary/20 px-3 py-1 rounded-full mb-6 border border-secondary/30">
            <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">The Apothecary</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Grooming <span className="text-secondary italic">Collection</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Professional-grade essentials for the modern gentleman. Curated by our master barbers for exceptional results.
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
                placeholder="Search products..." 
                className="pl-11 rounded-2xl border-gray-100 bg-gray-50/50 text-sm h-12 focus:ring-secondary focus:border-secondary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Recommended by:</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedStaff('all')}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                  selectedStaff === 'all' ? "bg-secondary/20 text-secondary border border-secondary/30" : "bg-gray-50 text-muted-foreground hover:bg-gray-200"
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

      {/* Products Grid - Premium Cards */}
      <section className="py-20 px-4 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white border border-gray-100 hover:border-secondary/30 transition-all duration-500 p-6 rounded-[2.5rem] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
                <div className="relative aspect-square overflow-hidden mb-6 bg-gray-50 rounded-[2rem]">
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop"} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {product.status === 'low-stock' && (
                    <Badge className="absolute top-4 left-4 bg-secondary text-primary border-none px-3 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase shadow-lg">
                      LIMITED EDITION
                    </Badge>
                  )}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-xl font-black text-xs shadow-xl">
                      ${product.price}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-secondary font-black">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-secondary text-secondary" />
                      <span className="text-[10px] font-black">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors duration-300 truncate">{product.name}</h4>
                  <p className="text-muted-foreground text-xs font-light leading-relaxed line-clamp-2 mt-2">
                    {product.description}
                  </p>
                </div>

                <Button 
                  onClick={() => handleAddToCart(product.id)}
                  className={cn(
                    "w-full mt-6 h-14 rounded-2xl font-black tracking-[0.2em] text-[10px] transition-all duration-500 shadow-lg",
                    addedProduct === product.id 
                      ? "bg-green-600 hover:bg-green-600 text-white scale-95" 
                      : "bg-primary hover:bg-secondary hover:text-primary text-white"
                  )}
                >
                  {addedProduct === product.id ? (
                    <><Check className="w-4 h-4 mr-2" /> ADDED TO CART</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4 mr-2" /> ADD TO CART</>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-primary mb-2">No products found</h3>
              <p className="text-muted-foreground font-light mb-8">Try adjusting your search or filters to find your grooming essentials.</p>
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

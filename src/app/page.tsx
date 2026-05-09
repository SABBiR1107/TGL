'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { OrderModal } from '@/components/OrderModal';
import { Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ChevronRight, Truck, ShieldCheck, Clock, PhoneCall } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchProducts() {
      if (!supabase) {
        console.warn('Supabase not configured');
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  if (!mounted) return null;

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-premium border border-amber-200 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
          <p className="text-secondary-text mb-6">
            Please fill in your Supabase credentials in <strong>.env.local</strong> to start the application.
          </p>
          <div className="bg-secondary/50 p-4 rounded-xl text-left text-xs font-mono break-all">
            NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
          </div>
        </div>
      </div>
    );
  }

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Toaster position="bottom-center" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-accent/5 rounded-bl-[60px] sm:rounded-bl-[100px]" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-accent/10 text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full mb-4 sm:mb-6">
                Bangladesh&apos;s First Dumbbell Accessories Brand
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-4 sm:mb-6">
                TGL <span className="text-secondary-text text-2xl sm:text-4xl block mt-2 font-bold">brings you gym accessories at the most affordable prices.</span>
              </h1>
              <p className="text-sm sm:text-lg text-secondary-text mb-6 sm:mb-10 max-w-xl font-medium border-l-4 border-accent pl-4">
                Built for Athletes | Engineered for Strength <br />
                Train Hard • Lift Smart • Stay Elite
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href="#products" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black/90 transition-all transform active:scale-95 text-sm sm:text-base">
                  Shop Now <ChevronRight className="w-5 h-5" />
                </a>
                <a href="#how-to-order" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white border border-border rounded-xl font-bold hover:bg-secondary transition-all text-center text-sm sm:text-base">
                  How it Works
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Featured Products</h2>
              <p className="text-secondary-text text-sm sm:text-base">Curated essentials for your daily lifestyle.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
              <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium whitespace-nowrap">All</span>
              <span className="px-4 py-2 hover:bg-secondary rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">iron dumbell</span>
              <span className="px-4 py-2 hover:bg-secondary rounded-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">mossaic dumbell</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-secondary aspect-[4/5] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onOrder={handleOrder} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to Order */}
      <section id="how-to-order" className="py-12 sm:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Simple Ordering Process</h2>
            <p className="text-secondary-text text-sm sm:text-base">Get your favorite products delivered to your doorstep in 4 easy steps.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[
              { icon: ShieldCheck, title: 'Choose Product', desc: 'Select your favorite item, size and quantity.' },
              { icon: PhoneCall, title: 'Enter Details', desc: 'Provide your shipping address and phone number.' },
              { icon: Truck, title: 'Fast Delivery', desc: 'We deliver within 2-3 business days nationwide.' },
              { icon: Clock, title: 'Pay on Receipt', desc: 'Pay cash when you receive your package.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-soft border border-border/50 text-center relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent text-white rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-6">
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold mb-1 sm:mb-2 text-xs sm:text-base">{step.title}</h3>
                <p className="text-[10px] sm:text-sm text-secondary-text">{step.desc}</p>
                {idx < 3 && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-border"><ChevronRight /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </main>
  );
}

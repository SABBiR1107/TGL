'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrderModal } from '@/components/OrderModal';
import { Product } from '@/types';
import { formatPrice, cn, mapSize } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Star, ShieldCheck, Truck, RefreshCw, Loader2, ArrowLeft, Video } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          router.push('/');
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  const media = product ? [
    ...(product.image_urls?.length ? product.image_urls : [product.image_url]),
    ...(product.video_url ? [product.video_url] : [])
  ] : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-10 sm:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-text mb-4 sm:mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-primary font-bold">{product.category}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-3 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-secondary border border-border shadow-xl sm:shadow-2xl"
              >
                {media[currentMedia]?.endsWith('.mp4') || media[currentMedia]?.includes('video') ? (
                  <video
                    src={media[currentMedia]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={media[currentMedia] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
                {product.stock_status !== 'In Stock' && (
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-destructive shadow-xl">
                    Out of Stock
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              {media.length > 1 && (
                <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {media.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMedia(idx)}
                      className={cn(
                        "relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0",
                        currentMedia === idx ? "border-accent scale-105" : "border-border hover:border-accent/50"
                      )}
                    >
                      {item.endsWith('.mp4') || item.includes('video') ? (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Video className="w-6 h-6 text-accent" />
                        </div>
                      ) : (
                        <Image src={item} alt="Thumbnail" fill className="object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Feature Tags */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { icon: ShieldCheck, label: 'Quality Assured' },
                  { icon: Truck, label: 'Fast Delivery' },
                  { icon: RefreshCw, label: '7 Days Return' }
                ].map((tag, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-2.5 sm:p-4 bg-secondary/30 rounded-xl sm:rounded-2xl border border-border text-center">
                    <tag.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent mb-1 sm:mb-2" />
                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter text-primary">{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full justify-center space-y-5 sm:space-y-8">
              <div className="space-y-2 sm:space-y-4">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block px-3 sm:px-4 py-1 bg-accent/10 text-accent rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                >
                  {product.category}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary"
                >
                  {product.name}
                </motion.h1>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />)}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-secondary-text">4.9 (120+ Reviews)</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-2xl sm:text-3xl font-black text-accent">{formatPrice(product.price)}</p>
                <div className="bg-secondary/30 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border">
                  <p className="text-secondary-text leading-relaxed font-medium text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">Available Sizes / Weights</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {Array.from(new Set(product.available_sizes.map(mapSize))).map((size) => (
                      <span key={size} className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white border-2 border-border text-xs sm:text-sm font-bold text-primary">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    disabled={product.stock_status !== 'In Stock'}
                    className="flex-1 h-12 sm:h-16 bg-black text-white rounded-xl sm:rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-2 sm:gap-3 shadow-xl disabled:opacity-50 text-sm sm:text-base"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                    {product.stock_status === 'In Stock' ? 'Order Now' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="h-12 sm:h-16 px-6 sm:px-8 bg-secondary rounded-xl sm:rounded-2xl font-bold text-primary hover:bg-border transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
                  </button>
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">Key Specifications</h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-secondary/20 rounded-xl sm:rounded-2xl">
                    <p className="text-[10px] font-bold text-secondary-text uppercase mb-1">Status</p>
                    <p className="font-bold text-green-600 text-sm sm:text-base">{product.stock_status}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-secondary/20 rounded-xl sm:rounded-2xl">
                    <p className="text-[10px] font-bold text-secondary-text uppercase mb-1">Delivery</p>
                    <p className="font-bold text-sm sm:text-base">24-48 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isOrderModalOpen && (
        <OrderModal
          product={product}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}

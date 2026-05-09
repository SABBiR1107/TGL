'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn, mapSize } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOrder }) => {
  const [currentMedia, setCurrentMedia] = React.useState(0);

  const media = [
    ...(product.image_urls?.length ? product.image_urls : [product.image_url]),
    ...(product.video_url ? [product.video_url] : [])
  ];

  const nextMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMedia((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMedia((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-300 border border-transparent hover:border-border"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-secondary">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
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
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </Link>

        {/* Carousel Controls */}
        {media.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 z-10">
            {media.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentMedia ? "bg-white w-4" : "bg-white/50"
                )} 
              />
            ))}
          </div>
        )}

        {media.length > 1 && (
          <>
            <button 
              onClick={prevMedia}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white/90 backdrop-blur-md rounded-full text-primary opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextMedia}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 hover:bg-white/90 backdrop-blur-md rounded-full text-primary opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {product.stock_status !== 'In Stock' && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-wider uppercase text-destructive z-10">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-secondary-text">
            {product.category}
          </p>
          <p className="font-bold text-lg">{formatPrice(product.price)}</p>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-secondary-text line-clamp-2 mb-4 h-10">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-5">
          {Array.from(new Set(product.available_sizes.map(mapSize))).map((size) => (
            <span key={size} className="text-[10px] px-2 py-0.5 rounded border border-border bg-background">
              {size}
            </span>
          ))}
        </div>

        <button
          onClick={() => onOrder(product)}
          disabled={product.stock_status !== 'In Stock'}
          className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm tracking-wide transform active:scale-95 transition-all duration-200 hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock_status === 'In Stock' ? 'Order Now' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

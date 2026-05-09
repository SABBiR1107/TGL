'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled ? 'bg-white/80 backdrop-blur-md border-border py-3' : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter text-primary ml-[10px]">
          TGL
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-bold hover:text-accent transition-colors">HOME</Link>
          <Link href="/track-order" className="text-sm font-bold hover:text-accent transition-colors text-accent">TRACK ORDER</Link>
          <div className="h-4 w-px bg-border mx-2" />
          <Link href="/#products" className="text-sm font-medium hover:text-secondary-text transition-colors">Products</Link>
          <Link href="/#how-to-order" className="text-sm font-medium hover:text-secondary-text transition-colors">How to Order</Link>
        </div>

        <div className="flex items-center space-x-4 mr-[10px]">
          <button className="p-2 relative">
            <ShoppingBag className="w-6 h-6" />
          </button>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-4 animate-in slide-in-from-top-5 duration-300 shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2 px-3 rounded-xl hover:bg-secondary transition-colors">Home</Link>
            <Link href="/track-order" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2 px-3 rounded-xl hover:bg-secondary transition-colors text-accent">Track Order</Link>
            <Link href="/#products" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2 px-3 rounded-xl hover:bg-secondary transition-colors">Products</Link>
            <Link href="/#how-to-order" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2 px-3 rounded-xl hover:bg-secondary transition-colors">How to Order</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

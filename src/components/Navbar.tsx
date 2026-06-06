'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Plus, Minus, Trash2 } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { OrderModal } from '@/components/OrderModal';
import { Product } from '@/types';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout states for cart item
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutSize, setCheckoutSize] = useState<string>('');
  const [checkoutQty, setCheckoutQty] = useState<number>(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);

  const { cart, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckoutItem = (product: Product, size: string, quantity: number) => {
    setCheckoutProduct(product);
    setCheckoutSize(size);
    setCheckoutQty(quantity);
    setIsOrderModalOpen(true);
    setIsCartOpen(false);
  };

  return (
    <>
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

          <div className="flex items-center space-x-4 mr-[10px] relative" ref={cartRef}>
            <button 
              className="p-2 relative hover:bg-secondary rounded-full transition-colors cursor-pointer"
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6 text-primary-text" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div 
                className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white border border-border rounded-2xl shadow-premium p-4 z-[100] max-h-[70vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-border">
                  <h3 className="font-bold text-base text-primary-text">Your Cart ({cartCount})</h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 hover:bg-secondary rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-secondary-text" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-secondary-text text-sm font-medium">
                    Your cart is empty.
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto divide-y divide-border pr-1 scrollbar-hide">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border">
                            <Image 
                              src={item.product.image_url || '/placeholder.jpg'} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-primary-text truncate">{item.product.name}</h4>
                              <p className="text-[10px] text-secondary-text mt-0.5 font-medium uppercase tracking-wider">Size: <span className="font-bold text-primary-text">{item.size}</span></p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 bg-secondary hover:bg-border rounded text-primary-text transition-colors cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 bg-secondary hover:bg-border rounded text-primary-text transition-colors cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end shrink-0">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-secondary-text hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-bold text-primary-text">{formatPrice(item.product.price * item.quantity)}</span>
                              <button 
                                onClick={() => handleCheckoutItem(item.product, item.size, item.quantity)}
                                className="px-3 py-1 bg-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black/90 active:scale-95 transition-all cursor-pointer"
                              >
                                Order
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 mt-3 space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-primary-text">
                        <span>Subtotal:</span>
                        <span className="text-lg font-black text-primary-text">
                          {formatPrice(cart.reduce((total, item) => total + (item.product.price * item.quantity), 0))}
                        </span>
                      </div>
                      <button 
                        onClick={clearCart}
                        className="w-full text-center text-xs font-bold text-secondary-text hover:text-red-500 transition-colors py-1 cursor-pointer"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

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

      {/* Order Modal for Cart Item Checkout */}
      {isOrderModalOpen && (
        <OrderModal
          product={checkoutProduct}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          initialSize={checkoutSize}
          initialQuantity={checkoutQty}
        />
      )}
    </>
  );
};

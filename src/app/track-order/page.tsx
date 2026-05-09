'use client';

import React, { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setIsLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${orderId.replace(/\s+/g, '')}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Order not found. Please check your Order ID and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusSteps = [
    { label: 'Pending', icon: Clock },
    { label: 'Payment Verification Pending', icon: Loader2 },
    { label: 'Confirmed', icon: CheckCircle2 },
    { label: 'Processing', icon: Loader2 },
    { label: 'Shipped', icon: Package },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    return statusSteps.findIndex(s => s.label === status);
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 sm:space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            >
              <Search className="w-3 h-3" /> Real-time Tracking
            </motion.div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-primary">Track Your Order</h1>
            <p className="text-secondary-text font-medium text-sm sm:text-base">Enter your Order ID to check the current status of your package.</p>
          </div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-2 rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-accent/5 flex flex-col sm:flex-row gap-2 border border-border"
          >
            <div className="flex-1 relative">
              <Package className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-secondary-text" />
              <input 
                type="text"
                placeholder="Enter Order ID (e.g. ORD-XXXXXX)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3.5 sm:py-5 rounded-xl sm:rounded-[1.5rem] bg-secondary/50 outline-none focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all font-mono font-bold text-sm sm:text-base"
              />
            </div>
            <button 
              onClick={handleTrack}
              disabled={isLoading || !orderId}
              className="px-6 sm:px-10 py-3.5 sm:py-5 bg-primary text-white rounded-xl sm:rounded-[1.5rem] font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track Now"}
            </button>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-700"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-bold">{error}</p>
              </motion.div>
            )}

            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-border overflow-hidden"
              >
                {/* Order Summary Header */}
                <div className="bg-primary p-4 sm:p-8 text-white flex flex-col sm:flex-row justify-between gap-3 sm:gap-6">
                  <div>
                    <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Tracking Order</p>
                    <h3 className="text-lg sm:text-2xl font-black font-mono tracking-wider">{order.order_id}</h3>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm sm:text-xl font-bold bg-accent px-3 sm:px-4 py-1 rounded-full inline-block">{order.order_status}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-8 space-y-6 sm:space-y-10">
                  {/* Status Timeline */}
                  <div className="relative pt-4">
                    {order.order_status === 'Cancelled' ? (
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                        <h4 className="text-lg font-bold text-red-700">Order Cancelled</h4>
                        <p className="text-sm text-red-600">This order has been cancelled. Please contact support for more information.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between relative gap-8 sm:gap-2">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-secondary hidden sm:block" />
                        
                        {statusSteps.map((step, idx) => {
                          const currentIdx = getCurrentStepIndex(order.order_status);
                          const isCompleted = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          
                          return (
                            <div key={idx} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 relative z-10">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                isCompleted ? "bg-accent text-white scale-110 shadow-lg shadow-accent/25" : "bg-secondary text-secondary-text"
                              )}>
                                <step.icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
                              </div>
                              <div className="text-left sm:text-center">
                                <p className={cn(
                                  "text-xs font-black uppercase tracking-tighter",
                                  isCompleted ? "text-primary" : "text-secondary-text"
                                )}>{step.label}</p>
                                {isCurrent && (
                                  <p className="text-[10px] text-accent font-bold animate-pulse">Current Status</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <hr className="border-border" />

                  {/* Order Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs font-bold text-secondary-text uppercase tracking-widest">Product Details</p>
                          <p className="font-bold text-primary">{order.product_name}</p>
                          <p className="text-sm text-secondary-text font-medium">Quantity: {order.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 text-left sm:text-right">
                      <div className="flex items-center sm:justify-end gap-3">
                        <Clock className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs font-bold text-secondary-text uppercase tracking-widest">Last Updated</p>
                          <p className="font-bold text-primary">{format(new Date(order.updated_at), 'PPP')}</p>
                          <p className="text-sm text-secondary-text font-medium">{format(new Date(order.updated_at), 'p')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="bg-secondary/20 p-6 text-center">
                  <p className="text-sm text-secondary-text font-medium">Need help? <Link href="#" className="text-accent font-bold underline">Contact Support</Link></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Section */}
          <div className="flex items-center justify-center gap-4 text-secondary-text">
            <Link href="/" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, CreditCard, Banknote, Copy, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn, mapSize } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ product, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    size: '',
    quantity: 1,
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    district: '',
    paymentMethod: 'Cash on Delivery' as 'Cash on Delivery' | 'bKash',
    bkashTxid: '',
    customerNote: '',
    deliveryLocation: 'Inside Dhaka' as 'Inside Dhaka' | 'Outside Dhaka',
    deliveryCharge: 150,
  });

  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        category: product.category,
        size: product.available_sizes[0] || '5KG',
      }));
    }
  }, [product]);

  if (!product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName) return 'Name is required';
    if (!formData.customerPhone) return 'Phone number is required';
    if (!/^01[3-9]\d{8}$/.test(formData.customerPhone)) return 'Invalid Bangladeshi phone number';
    if (!formData.customerAddress) return 'Address is required';
    if (!formData.district) return 'District is required';
    if (formData.paymentMethod === 'bKash' && !formData.bkashTxid) return 'bKash Transaction ID is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: product.id,
          productName: product.name,
          totalPrice: (product.price * formData.quantity) + formData.deliveryCharge,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmedOrderId(data.order.order_id);
        setStep(2); // Success step
        toast.success('Order placed successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {step === 1 ? (
              <>
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Complete Your Order</h2>
                  <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Product Summary */}
                  <div className="flex flex-col gap-4 p-4 bg-secondary/50 rounded-2xl border border-border">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{product.name}</h4>
                        <p className="text-sm text-secondary-text">{formatPrice(product.price)} x {formData.quantity} = {formatPrice(product.price * formData.quantity)}</p>
                        <p className="text-xs text-accent font-bold mt-1">+ Delivery Charge: {formatPrice(formData.deliveryCharge)}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                      <p className="text-lg font-bold text-primary">Total Payable:</p>
                      <p className="text-2xl font-black text-accent">{formatPrice((product.price * formData.quantity) + formData.deliveryCharge)}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest text-center">
                        ⚠️ Please check your name, full address and phone number before ordering.
                      </p>
                    </div>
                  </div>

                  {/* Delivery Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Delivery Location</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, deliveryLocation: 'Inside Dhaka', deliveryCharge: 150 }))}
                        className={cn(
                          "flex flex-col p-4 rounded-2xl border-2 transition-all text-left",
                          formData.deliveryLocation === 'Inside Dhaka' ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                        )}
                      >
                        <span className="font-bold text-primary">Inside Dhaka</span>
                        <span className="text-xs text-secondary-text">ঢাকার ভিতরে ১৫০ টাকা</span>
                        <span className="mt-1 font-bold text-accent">৳150</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, deliveryLocation: 'Outside Dhaka', deliveryCharge: 250 }))}
                        className={cn(
                          "flex flex-col p-4 rounded-2xl border-2 transition-all text-left",
                          formData.deliveryLocation === 'Outside Dhaka' ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                        )}
                      >
                        <span className="font-bold text-primary">Outside Dhaka</span>
                        <span className="text-xs text-secondary-text">ঢাকার বাইরে ২৫০ টাকা</span>
                        <span className="mt-1 font-bold text-accent">৳250</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category & Size */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none appearance-none"
                      >
                        <option value="iron dumbell">iron dumbell</option>
                        <option value="mossaic dumbell">mossaic dumbell</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Size</label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none appearance-none"
                      >
                        {Array.from(new Set(product.available_sizes.map(s => mapSize(s)))).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Full Name *</label>
                        <input
                          name="customerName"
                          placeholder="Your Name"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Phone Number *</label>
                        <input
                          name="customerPhone"
                          placeholder="017XXXXXXXX"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Full Address *</label>
                      <input
                        name="customerAddress"
                        placeholder="House/Street/Village"
                        value={formData.customerAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">District / Area *</label>
                      <input
                        name="district"
                        placeholder="Your District"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Order Note (Optional)</label>
                      <textarea
                        name="customerNote"
                        rows={2}
                        placeholder="Anything else we should know?"
                        value={formData.customerNote}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none resize-none"
                      />
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className={cn(
                        "relative flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all",
                        formData.paymentMethod === 'Cash on Delivery' ? "border-accent bg-accent/5" : "border-border hover:bg-secondary/50"
                      )}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Cash on Delivery"
                          checked={formData.paymentMethod === 'Cash on Delivery'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Banknote className="w-5 h-5" />
                        <span className="font-semibold">Cash on Delivery</span>
                      </label>
                      <label className={cn(
                        "relative flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all",
                        formData.paymentMethod === 'bKash' ? "border-accent bg-accent/5" : "border-border hover:bg-secondary/50"
                      )}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bKash"
                          checked={formData.paymentMethod === 'bKash'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <CreditCard className="w-5 h-5 text-pink-600" />
                        <span className="font-semibold">bKash (Send Money)</span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'bKash' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-pink-50 border border-pink-100 rounded-2xl space-y-3"
                      >
                        <p className="text-sm font-medium text-pink-800">
                          Please send money to our bKash Number: <strong>{process.env.NEXT_PUBLIC_BKASH_NUMBER || '017XXXXXXXX'}</strong> (Personal)
                        </p>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-pink-700">Transaction ID *</label>
                          <input
                            name="bkashTxid"
                            placeholder="Enter TrxID"
                            value={formData.bkashTxid}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:ring-2 focus:ring-pink-500 outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg tracking-wide transform active:scale-95 transition-all duration-200 hover:bg-black/90 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : 'Confirm Order'}
                  </button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center space-y-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-primary">Order Confirmed!</h2>
                  <p className="text-secondary-text max-w-sm mx-auto font-medium">
                    Thank you for your order. We'll contact you shortly for confirmation.
                  </p>
                </div>

                <div className="bg-secondary/30 p-6 rounded-3xl border border-border inline-block min-w-[280px] group relative">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary-text mb-2">Your Order ID</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-2xl font-black text-accent tracking-wider font-mono">{confirmedOrderId}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(confirmedOrderId);
                        toast.success('Order ID copied!');
                      }}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-secondary-text hover:text-accent"
                      title="Copy ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 max-w-sm mx-auto">
                  <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    📝 <strong>Important:</strong> Please save this Order ID to track your order later.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-soft"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import Image from 'next/image';

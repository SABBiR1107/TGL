'use client';

import React from 'react';
import { X, User, Phone, MapPin, Package, CreditCard, Calendar, FileText, Trash2, Printer } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onDelete
}) => {
  if (!order) return null;

  const statuses: OrderStatus[] = [
    'Pending',
    'Payment Verification Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-purple-100 text-purple-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  Order Details
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(order.order_status))}>
                    {order.order_status}
                  </span>
                </h2>
                <p className="text-sm text-secondary-text font-medium mt-1">ID: {order.order_id}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer Information
                  </h3>
                  <div className="bg-secondary/20 p-4 rounded-2xl space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 mt-1 text-accent" />
                      <div>
                        <p className="text-xs text-secondary-text font-medium">Name</p>
                        <p className="font-semibold text-primary">{order.customer_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 mt-1 text-accent" />
                      <div>
                        <p className="text-xs text-secondary-text font-medium">Phone</p>
                        <p className="font-semibold text-primary">{order.customer_phone}</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Shipping Address
                  </h3>
                  <div className="bg-secondary/20 p-4 rounded-2xl space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-1 text-accent" />
                      <div>
                        <p className="text-xs text-secondary-text font-medium">Address</p>
                        <p className="font-semibold text-primary">{order.customer_address}</p>
                        <p className="text-sm text-secondary-text font-medium">{order.district}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Order Items */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text flex items-center gap-2">
                  <Package className="w-4 h-4" /> Order Summary
                </h3>
                <div className="border border-border rounded-2xl overflow-hidden">
                  <div className="p-4 flex items-center justify-between bg-secondary/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{order.product_name}</p>
                        <p className="text-xs text-secondary-text font-medium">Size: {order.size} | Qty: {order.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-primary">৳{order.total_price}</p>
                  </div>
                  {order.customer_note && (
                    <div className="p-4 bg-yellow-50/50 border-t border-yellow-100">
                      <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest flex items-center gap-2 mb-1">
                        <FileText className="w-3 h-3" /> Customer Note
                      </p>
                      <p className="text-sm text-yellow-900 italic font-medium">"{order.customer_note}"</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Payment Info */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment Details
                </h3>
                <div className="bg-secondary/20 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      order.payment_method === 'bKash' ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
                    )}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-text font-medium">Method</p>
                      <p className="font-bold text-primary">{order.payment_method}</p>
                    </div>
                  </div>
                  {order.bkash_transaction_id && (
                    <div className="text-right">
                      <p className="text-xs text-secondary-text font-medium">TxID</p>
                      <p className="font-mono text-sm font-bold text-accent">{order.bkash_transaction_id}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Actions */}
              <section className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-text">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(order.id, status)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                        order.order_status === status 
                          ? "bg-accent text-white shadow-lg shadow-accent/25" 
                          : "bg-secondary hover:bg-secondary-text/10 text-secondary-text"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-secondary/30 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  if(confirm('Are you sure you want to delete this order?')) {
                    onDelete(order.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete Order
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-soft"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

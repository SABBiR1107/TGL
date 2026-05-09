'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Search, 
  Filter, 
  LogOut, 
  MoreHorizontal,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  Trash2,
  Menu,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { OrderDetailModal } from '@/components/OrderDetailModal';

const STATUS_COLORS: Record<OrderStatus, string> = {
  'Pending': 'bg-amber-100 text-amber-700',
  'Payment Verification Pending': 'bg-purple-100 text-purple-700',
  'Confirmed': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-indigo-100 text-indigo-700',
  'Shipped': 'bg-cyan-100 text-cyan-700',
  'Delivered': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  if (!mounted) return null;

  async function fetchOrders() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || order.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order ${newStatus}`);
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Order deleted');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" />
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)} 
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteOrder}
        />
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex flex-col z-50 animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <Link href="/" className="text-xl font-bold tracking-tighter">
                ADMIN<span className="text-secondary-text">PANEL</span>
              </Link>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
                <ShoppingBag className="w-5 h-5" /> Orders
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
                <Package className="w-5 h-5" /> Products
              </Link>
            </nav>
            <div className="p-4 border-t border-border">
              <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl font-medium transition-colors">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
            ADMIN<span className="text-secondary-text">PANEL</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
            <Package className="w-5 h-5" /> Products
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-red-600 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Orders Management</h1>
                <p className="text-secondary-text text-sm hidden sm:block">Track and update customer orders</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
              <input 
                type="text" 
                placeholder="Search phone or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 bg-white border border-border rounded-xl text-sm outline-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-secondary-text border-b border-border">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-secondary-text">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-secondary-text">No orders found</td></tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-accent">{order.order_id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold">{order.customer_name}</div>
                        <div className="text-[10px] text-secondary-text">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{order.product_name}</div>
                        <div className="text-[10px] text-secondary-text">{order.size} × {order.quantity}</div>
                      </td>
                      <td className="px-6 py-4 font-bold">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                          STATUS_COLORS[order.order_status]
                        )}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-secondary-text">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-secondary text-accent rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="h-8 w-px bg-border mx-1" />
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Confirm Order"
                            disabled={order.order_status !== 'Pending'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

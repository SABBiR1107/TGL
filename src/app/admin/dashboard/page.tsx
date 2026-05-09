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
import { supabase } from '@/lib/supabase';
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

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });
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
        calculateStats(data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }

  function calculateStats(allOrders: Order[]) {
    setStats({
      total: allOrders.length,
      pending: allOrders.filter(o => o.order_status === 'Pending').length,
      confirmed: allOrders.filter(o => o.order_status === 'Confirmed').length,
      cancelled: allOrders.filter(o => o.order_status === 'Cancelled').length,
    });
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

  if (!mounted) return null;

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
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
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
          <Link href="/" className="text-xl font-bold tracking-tighter">
            ADMIN<span className="text-secondary-text">PANEL</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
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
                <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-secondary-text text-sm hidden sm:block">Welcome back to your admin panel</p>
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
                className="w-full sm:w-auto pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-accent', icon: ShoppingBag },
            { label: 'Pending', value: stats.pending, color: 'text-amber-600', icon: Clock },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600', icon: CheckCircle },
            { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600', icon: XCircle },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-soft flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-secondary", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-text mb-1">{stat.label}</p>
                <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All Orders <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-secondary-text border-b border-border">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-secondary-text">Loading recent orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-secondary-text">No orders yet</td></tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4 font-mono text-sm font-bold">{order.order_id}</td>
                        <td className="px-6 py-4 text-sm font-bold">{order.customer_name}</td>
                        <td className="px-6 py-4">
                          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", STATUS_COLORS[order.order_status])}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Clock } from 'lucide-react';

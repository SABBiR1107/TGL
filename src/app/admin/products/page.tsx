'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  LayoutDashboard, 
  ShoppingBag, 
  Package,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { ProductForm } from '@/components/ProductForm';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const openEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Toaster position="top-right" />
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-border flex flex-col z-50 animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
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
              <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
                <ShoppingBag className="w-5 h-5" /> Orders
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
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
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl font-medium text-secondary-text transition-colors">
            <ShoppingBag className="w-5 h-5" /> Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-accent text-white rounded-xl font-medium">
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
                <h1 className="text-xl sm:text-2xl font-bold">Products Management</h1>
                <p className="text-secondary-text text-sm hidden sm:block">Manage your store inventory</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button 
              onClick={openAdd}
              className="px-3 sm:px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-black/90 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span> Product
            </button>
          </div>
        </header>

        {/* Products Grid/List */}
        <div className="bg-white rounded-2xl shadow-soft border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-secondary/50 text-[10px] font-bold uppercase tracking-widest text-secondary-text border-b border-border">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Sizes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary-text">Loading inventory...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary-text">No products found</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">{product.name}</div>
                            <div className="text-[10px] text-secondary-text line-clamp-1 max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 font-bold">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          product.stock_status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        )}>
                          {product.stock_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {product.available_sizes.map(s => (
                            <span key={s} className="text-[8px] px-1.5 py-0.5 rounded border border-border bg-background">
                              {s.charAt(0)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEdit(product)}
                            className="p-2 hover:bg-secondary text-accent rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-5 h-5" />
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

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}

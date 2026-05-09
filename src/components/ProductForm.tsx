'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Image as ImageIcon, Upload, Video, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    image_urls: [] as string[],
    video_url: '',
    description: '',
    price: 0,
    category: 'iron dumbell',
    available_sizes: ['5KG', '7KG', '10KG'],
    stock_status: 'In Stock',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        image_url: product.image_url,
        image_urls: product.image_urls || [],
        video_url: product.video_url || '',
        description: product.description,
        price: Number(product.price) || 0,
        category: product.category,
        available_sizes: product.available_sizes || [],
        stock_status: product.stock_status || 'In Stock',
      });
    } else {
      setFormData({
        name: '',
        image_url: '',
        image_urls: [],
        video_url: '',
        description: '',
        price: 0,
        category: 'iron dumbell',
        available_sizes: ['5KG', '7KG', '10KG'],
        stock_status: 'In Stock',
      });
    }
    setImageFiles([]);
    setVideoFile(null);
  }, [product, isOpen]);

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrls: string[] = [...formData.image_urls];
      let finalVideoUrl = formData.video_url;

      // Upload Images if new files selected
      if (imageFiles.length > 0) {
        setIsUploading(true);
        const uploadPromises = imageFiles.map(file => uploadFile(file, 'product-media'));
        const newUrls = await Promise.all(uploadPromises);
        uploadedImageUrls = [...uploadedImageUrls, ...newUrls];
      }

      // Upload Video if new file selected
      if (videoFile) {
        setIsUploading(true);
        finalVideoUrl = await uploadFile(videoFile, 'product-media');
      }

      const submissionData = {
        ...formData,
        image_urls: uploadedImageUrls,
        image_url: uploadedImageUrls[0] || '', // Set primary image to first in list
        video_url: finalVideoUrl,
      };

      if (submissionData.image_urls.length === 0) {
        toast.error('Please upload at least one image');
        setIsSubmitting(false);
        return;
      }

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        toast.success(product ? 'Product updated' : 'Product created');
        onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to save product');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.message === 'Bucket not found') {
        toast.error('Storage Bucket "product-media" not found. Please create it in Supabase dashboard.');
      } else {
        toast.error(err.message || 'Error uploading files. Make sure "product-media" bucket exists.');
      }
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Product Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none"
                    placeholder="e.g. Premium Cotton T-Shirt"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Product Images (Upload multiple)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {formData.image_urls.map((url, index) => (
                      <div key={`url-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border border-border group">
                        <Image src={url} alt="Product" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, image_urls: p.image_urls.filter((_, i) => i !== index) }))}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* New Files Preview */}
                    {imageFiles.map((file, index) => (
                      <div key={`file-${index}`} className="relative aspect-square rounded-2xl overflow-hidden border border-accent/30 group bg-accent/5">
                        <Image src={URL.createObjectURL(file)} alt="New" fill className="object-cover" />
                        <div className="absolute inset-0 bg-accent/10 flex items-center justify-center">
                          <span className="text-[10px] font-black uppercase text-accent bg-white px-2 py-1 rounded-full shadow-sm">New</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add Button */}
                    <label className="relative aspect-square rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                      <Upload className="w-6 h-6 text-secondary-text" />
                      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-widest text-center px-2">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setImageFiles(prev => [...prev, ...files]);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Product Video (Optional)</label>
                  <div className="relative group">
                    <div className={cn(
                      "w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden",
                      videoFile || formData.video_url ? "border-purple-200" : "border-border hover:border-purple-200 hover:bg-purple-50/30"
                    )}>
                      {videoFile || formData.video_url ? (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                          <Video className="w-8 h-8 text-purple-600" />
                          <p className="text-[10px] font-bold text-secondary-text uppercase tracking-widest truncate max-w-full">
                            {videoFile ? videoFile.name : 'Video Uploaded'}
                          </p>
                          <button 
                            type="button"
                            onClick={() => { setVideoFile(null); setFormData(p => ({...p, video_url: ''})) }}
                            className="p-1 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Video className="w-8 h-8 text-secondary-text group-hover:text-purple-600 transition-colors" />
                          <p className="text-[10px] font-bold text-secondary-text uppercase tracking-widest">Click to Upload Video</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none resize-none"
                  placeholder="Tell something about this product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                  >
                    <option value="iron dumbell">iron dumbell</option>
                    <option value="mossaic dumbell">mossaic dumbell</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:ring-2 focus:ring-accent outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary-text">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['5KG', '7KG', '10KG'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        formData.available_sizes.includes(size)
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-secondary-text border-border hover:bg-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg tracking-wide transform active:scale-95 transition-all duration-200 hover:bg-black/90 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : product ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

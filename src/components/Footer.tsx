'use client';

import React from 'react';
import { MessageCircle, Video, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-border pt-10 sm:pt-20 pb-6 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12 mb-10 sm:mb-20">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6 col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl sm:text-2xl font-black tracking-tighter">
              TGL
            </Link>
            <p className="text-secondary-text font-bold uppercase tracking-widest text-[10px] sm:text-xs">
              TURAB GROUPS LIMITED
            </p>
            <p className="text-secondary-text font-medium leading-relaxed text-sm sm:text-base">
              Elevating your lifestyle with premium quality products and world-class service.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="https://www.facebook.com/profile.php?id=61580429376769" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center text-primary hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                title="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link 
                href="https://wa.me/8801620334814" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center text-primary hover:bg-[#25D366] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link 
                href="https://www.tiktok.com/@tglturabgruopslimited" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center text-primary hover:bg-[#000000] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                title="TikTok"
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-6">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Shop</h4>
            <ul className="space-y-2 sm:space-y-4">
              {['All Products', 'Categories', 'Featured Items', 'New Arrivals'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-secondary-text font-medium hover:text-accent transition-colors text-xs sm:text-base">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3 sm:space-y-6">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Support</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li>
                <Link href="/track-order" className="text-secondary-text font-medium hover:text-accent transition-colors text-xs sm:text-base">Track Order</Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary-text font-medium hover:text-accent transition-colors text-xs sm:text-base">TGL Dumbbell – Terms, Policies & Guidelines</Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary-text font-medium hover:text-accent transition-colors text-xs sm:text-base">Returns & Refunds</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-6 col-span-2 lg:col-span-1">
            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                <span className="text-secondary-text font-medium text-xs sm:text-base">Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                <a href="tel:+8801620334814" className="text-secondary-text font-medium text-xs sm:text-base hover:text-accent transition-colors">+880 1620-334814</a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                <a href="mailto:support@turabgroups.com" className="text-secondary-text font-medium text-xs sm:text-base hover:text-accent transition-colors">support@turabgroups.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-secondary-text text-xs sm:text-sm font-medium">
            © {new Date().getFullYear()} TURAB GROUPS LIMITED. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors group"
          >
            Back to Top <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Truck, RefreshCw, CreditCard, UserCheck, Bell, Info } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      id: 1,
      title: 'Terms & Conditions',
      icon: FileText,
      content: 'By accessing and using this website, you agree to comply with all applicable terms and policies. Users must provide accurate information and use the products responsibly. TGL reserves the right to accept or cancel any order based on availability or incorrect details.'
    },
    {
      id: 2,
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: 'We collect basic customer information such as name, phone number, and address for order processing and communication. Customer data is kept secure and is not shared with third parties.'
    },
    {
      id: 3,
      title: 'Shipping & Delivery',
      icon: Truck,
      content: 'We provide delivery across Bangladesh. Delivery time varies depending on location. Orders are confirmed before dispatch, and customers are contacted prior to delivery.'
    },
    {
      id: 4,
      title: 'Return & Refund Policy',
      icon: RefreshCw,
      content: 'Returns are accepted only for damaged or incorrect products. Issues must be reported within 48 hours. Products must remain unused and in original packaging.'
    },
    {
      id: 5,
      title: 'Warranty Policy',
      icon: Info,
      content: 'TGL Dumbbells come with a lifetime guarantee covering manufacturing defects. The warranty does not cover misuse or intentional damage.'
    },
    {
      id: 6,
      title: 'Payment Policy',
      icon: CreditCard,
      content: 'We accept Cash on Delivery and selected mobile banking options. Orders are processed after confirmation.'
    },
    {
      id: 7,
      title: 'User Responsibility',
      icon: UserCheck,
      content: 'Customers are responsible for proper use of the product and must follow safety guidelines during workouts.'
    },
    {
      id: 8,
      title: 'Policy Updates',
      icon: Bell,
      content: 'TGL reserves the right to update policies at any time without prior notice.'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-primary mb-4"
            >
              TGL Dumbbell – <span className="text-accent">Terms, Policies & Guidelines</span>
            </motion.h1>
            <p className="text-secondary-text max-w-2xl mx-auto">
              Please read our terms and policies carefully to understand how we operate and your responsibilities as a customer.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-primary">{section.id}. {section.title}</h2>
                </div>
                <div className="pl-14">
                  <p className="text-secondary-text leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </motion.section>
            ))}
          </div>

          <div className="mt-20 p-8 bg-secondary/30 rounded-3xl border border-border text-center">
            <p className="text-sm text-secondary-text font-medium">
              Last Updated: May 2026. For any queries, please contact our support team.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

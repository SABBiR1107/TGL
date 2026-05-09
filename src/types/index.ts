export interface Product {
  id: string;
  name: string;
  image_url: string;
  image_urls: string[];
  video_url?: string;
  description: string;
  price: number;
  category: 'iron dumbell' | 'mossaic dumbell';
  available_sizes: string[];
  stock_status: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Verification Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled';

export interface Order {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  category: string;
  size: string;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  district: string;
  payment_method: 'Cash on Delivery' | 'bKash';
  bkash_transaction_id?: string;
  order_status: OrderStatus;
  customer_note?: string;
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();
    const {
      productId,
      productName,
      category,
      size,
      quantity,
      totalPrice,
      customerName,
      customerPhone,
      customerAddress,
      district,
      paymentMethod,
      bkashTxid,
      customerNote
    } = body;

    // Generate a simple human-readable Order ID
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `ORD-${shortId}`;

    // Basic Validation
    if (!customerName || !customerPhone || !customerAddress || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: orderId,
          product_id: productId,
          product_name: productName,
          category,
          size,
          quantity,
          total_price: totalPrice,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          district,
          payment_method: paymentMethod,
          bkash_transaction_id: bkashTxid,
          customer_note: customerNote,
          order_status: paymentMethod === 'bKash' ? 'Payment Verification Pending' : 'Pending',
        }
      ])
      .select();

    if (error) {
      console.error('Supabase INSERT Order Error:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Failed to save order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data[0] }, { status: 201 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

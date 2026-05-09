import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const normalizedId = orderId.replace(/\s+/g, '').toUpperCase();
    console.log('Tracking attempt for Order ID:', normalizedId);

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Use the public client because orders have a SELECT policy
    const { data, error } = await supabase
      .from('orders')
      .select('order_id, product_name, order_status, updated_at, quantity, total_price')
      .eq('order_id', normalizedId)
      .maybeSingle();

    if (error) {
      console.error('Supabase Tracking Error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!data) {
      console.warn('Order not found in database:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('Order found successfully:', data.order_id);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('TRACKING API CRITICAL ERROR:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ 
        status: 'Error', 
        message: 'Could not connect to database', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'Connected', 
      message: 'Database connection is working perfectly!',
      productCount: data
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'Failed', 
      message: 'Internal server error during connection test',
      error: err.message
    }, { status: 500 });
  }
}

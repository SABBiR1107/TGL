import { createClient as createBrowserClient } from '@/utils/supabase/client';

// Client-side instance safe for both Client and Server components
// (but will only initialize on the client/window)
export const supabase = typeof window !== 'undefined' ? createBrowserClient() : null as any;

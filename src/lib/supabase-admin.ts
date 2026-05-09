import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Server-side admin instance (using service role)
// This file should ONLY be imported in Server Components, Server Actions, or API Routes.
export const getAdminSupabase = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // This can be ignored if you have middleware refreshing sessions
        }
      },
    },
  });
};

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, { path: "/", ...options });
        } catch {
          // Ignore if called during a render phase where cookies cannot be modified
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set(name, "", { path: "/", maxAge: 0, ...options });
        } catch {
          // Ignore if called during a render phase where cookies cannot be modified
        }
      },
    },
  });
}

// Alias for API routes
export const createClient = getSupabaseServerClient;




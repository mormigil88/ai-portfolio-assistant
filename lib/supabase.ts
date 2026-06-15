import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization — avoids crash when env vars missing at build time
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabaseAdmin;
}

// Keep named exports for backwards compat (lazy proxy)
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => (getSupabase() as never)[prop as keyof SupabaseClient],
});
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get: (_, prop) => (getSupabaseAdmin() as never)[prop as keyof SupabaseClient],
});

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});

export interface Message {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  online: boolean;
  last_seen: string;
}

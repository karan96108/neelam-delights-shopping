
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nwukqreobnztzcycxwch.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53dWtxcmVvYm56dHpjeWN4d2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MDgxOTcsImV4cCI6MjA1NjI4NDE5N30.TE8INNa81f-_-6nkTI0oiXYtgZjIQGvssxF00ozgJyo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

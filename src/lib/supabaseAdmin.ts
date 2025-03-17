import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_KEY as string;

// Service role client (do not expose to browser)
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default supabaseAdmin;

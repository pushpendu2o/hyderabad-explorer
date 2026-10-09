// Supabase project config. The anon key is MEANT to be public/client-side —
// it only grants what the RLS policies in supabase/schema.sql allow. Never
// put the service_role key here or in any file that gets committed.
const SUPABASE_URL = 'REPLACE_WITH_YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tmahfmjkxyoiloinhjjd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYWhmbWpreHlvaWxvaW5oampkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjkyNzgsImV4cCI6MjEwMjE0NTI3OH0.nTze_eLUREg99u3MGzBJbJ5cxAYSgsU9grI4akJ7EFE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

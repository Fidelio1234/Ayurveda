import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug
console.log('🔗 Supabase Config:');
console.log('URL:', supabaseUrl);
console.log('KEY:', supabaseKey ? 'Presente' : 'Mancante');

export const supabase = createClient(supabaseUrl, supabaseKey)



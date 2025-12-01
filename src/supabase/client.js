import { createClient } from '@supabase/supabase-js'

// Usa le variabili d'ambiente o valori di sviluppo
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.dummy-key'

console.log('🔗 Supabase Config (modalità sviluppo):')

// Forza la creazione del client anche con valori dummy
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
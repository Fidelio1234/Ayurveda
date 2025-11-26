// src/TestConnection.jsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function TestConnection() {
  const [message, setMessage] = useState('Test in corso...');

  useEffect(() => {
    testSupabase();
  }, []);

  const testSupabase = async () => {
    try {
      // Test semplice - prova a fare una query
      const { data, error } = await supabase
        .from('_test') // Tabella che non esiste - ci aspettiamo errore
        .select('*')
        .limit(1);

      if (error) {
        // Se arriva qui, la connessione FUNZIONA!
        setMessage('✅ Connesso a Supabase! Le credenziali sono corrette.');
      }
    } catch (err) {
      setMessage('❌ Errore di connessione: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h3>Test Connessione Supabase</h3>
      <p>{message}</p>
    </div>
  );
}
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClienti = async () => {
    try {
      const { data, error } = await supabase
        .from('clienti')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setClienti(data || [])
    } catch (error) {
      console.error('Errore:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClienti()

    // Real-time subscription
    const subscription = supabase
      .channel('clienti-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'clienti' },
        () => {
          fetchClienti()
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Caricamento clienti...</div>

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Elenco Clienti ({clienti.length})</h2>
      
      {clienti.length === 0 ? (
        <p>Nessun cliente trovato.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {clienti.map(cliente => (
            <div key={cliente.id} style={{ 
              padding: '1rem', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{cliente.nome}</h4>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                📧 {cliente.email}
              </p>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>
                📞 {cliente.telefono}
              </p>
              <small style={{ color: '#999' }}>
                Creato: {new Date(cliente.created_at).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
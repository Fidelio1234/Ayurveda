import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase/client'
import { Modal } from '../components/Modal/Modal'
import './Clienti.css'

export function Clienti() {
  const [clienti, setClienti] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalAperto, setModalAperto] = useState(null)
  const [clienteSelezionato, setClienteSelezionato] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    indirizzo: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('nome')
  const [storicoAperto, setStoricoAperto] = useState(false)
  const [prenotazioniCliente, setPrenotazioniCliente] = useState([])
  const [loadingStorico, setLoadingStorico] = useState(false)
  const [confermaEliminazioneAperta, setConfermaEliminazioneAperta] = useState(false)
  const [clienteDaEliminare, setClienteDaEliminare] = useState(null)

  // CORREZIONE: useCallback per fetchClienti
  const fetchClienti = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clienti')
        .select('*')
        .order(sortBy, { ascending: true })
      
      if (error) throw error
      setClienti(data || [])
    } catch (error) {
      console.error('Errore:', error)
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  useEffect(() => {
    fetchClienti()

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
  }, [fetchClienti])

  // Funzione per caricare lo storico prenotazioni
  const caricaStoricoCliente = async (clienteId) => {
    try {
      setLoadingStorico(true)
      const { data, error } = await supabase
        .from('prenotazioni')
        .select(`
          *,
          servizi (id, nome, prezzo, durata),
          clienti (id, nome, email, telefono)
        `)
        .eq('cliente_id', clienteId)
        .order('data_prenotazione', { ascending: false })
        .order('ora_inizio', { ascending: false })

      if (error) throw error
      setPrenotazioniCliente(data || [])
    } catch (error) {
      console.error('Errore caricamento storico:', error)
    } finally {
      setLoadingStorico(false)
    }
  }

  const apriStorico = async (cliente) => {
    setClienteSelezionato(cliente)
    setStoricoAperto(true)
    await caricaStoricoCliente(cliente.id)
  }

  const chiudiStorico = () => {
    setStoricoAperto(false)
    setClienteSelezionato(null)
    setPrenotazioniCliente([])
  }

  const apriCreaCliente = () => {
    setFormData({ nome: '', email: '', telefono: '', indirizzo: '' })
    setClienteSelezionato(null)
    setModalAperto('crea')
  }

  const apriModificaCliente = (cliente) => {
    setFormData({
      nome: cliente.nome || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      indirizzo: cliente.indirizzo || ''
    })
    setClienteSelezionato(cliente)
    setModalAperto('modifica')
  }

  const chiudiModal = () => {
    setModalAperto(null)
    setClienteSelezionato(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (modalAperto === 'crea') {
        const { error } = await supabase
          .from('clienti')
          .insert([formData])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('clienti')
          .update(formData)
          .eq('id', clienteSelezionato.id)
        if (error) throw error
      }
      
      chiudiModal()
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante il salvataggio')
    }
  }

  // Nuova funzione per gestire la richiesta di eliminazione
  const handleRichiediEliminazioneCliente = (cliente) => {
    setClienteDaEliminare(cliente)
    setConfermaEliminazioneAperta(true)
  }

  // Funzione per confermare l'eliminazione
  const handleConfermaEliminazione = async () => {
    if (!clienteDaEliminare) return

    try {
      const { error } = await supabase
        .from('clienti')
        .delete()
        .eq('id', clienteDaEliminare.id)
      
      if (error) throw error
      
      setConfermaEliminazioneAperta(false)
      setClienteDaEliminare(null)
      
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante l\'eliminazione')
    }
  }

  // Funzione per annullare l'eliminazione
  const handleAnnullaEliminazione = () => {
    setConfermaEliminazioneAperta(false)
    setClienteDaEliminare(null)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Funzioni helper per lo storico
  const formattaData = (dataString) => {
    return new Date(dataString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formattaOra = (oraString) => {
    return oraString.substring(0, 5)
  }

  const calcolaTotaleSpeso = () => {
    return prenotazioniCliente.reduce((totale, prenotazione) => {
      return totale + (prenotazione.servizi?.prezzo || 0)
    }, 0)
  }

  // Filtra e ordina clienti
  const clientiFiltrati = clienti
    .filter(cliente => 
      cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono?.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'nome') {
        return a.nome?.localeCompare(b.nome)
      } else if (sortBy === 'data') {
        return new Date(b.created_at) - new Date(a.created_at)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="clienti-loading">
        <div className="loading-spinner"></div>
        <p>Caricamento clienti...</p>
      </div>
    )
  }

  return (
    <div className="clienti-container">
      {/* Header con statistiche e azioni */}
      <div className="clienti-header">
        <div className="header-info">
          <h1>👥 Gestione Clienti</h1>
          <p>Gestisci la tua base clienti in modo efficiente</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{clienti.length}</span>
            <span className="stat-label">Clienti Totali</span>
          </div>
          <button 
            className="btn btn-primary btn-add"
            onClick={apriCreaCliente}
          >
            ➕ Nuovo Cliente
          </button>
        </div>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="clienti-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Cerca per nome, email o telefono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="nome">Ordina per Nome</option>
            <option value="data">Ordina per Data</option>
          </select>
        </div>
      </div>

      {/* Lista clienti */}
      {clientiFiltrati.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nessun cliente trovato</h3>
          <p>
            {searchTerm ? 'Prova a modificare i criteri di ricerca' : 'Inizia aggiungendo il tuo primo cliente'}
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={apriCreaCliente}
            >
              ➕ Aggiungi Primo Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="clienti-grid">
          {clientiFiltrati.map(cliente => (
            <div key={cliente.id} className="cliente-card">
              <div className="cliente-header">
                <div className="cliente-avatar">
                  {cliente.nome?.charAt(0).toUpperCase()}
                </div>
                <div className="cliente-info">
                  <h3 className="cliente-nome">{cliente.nome}</h3>
                  <span className="cliente-badge">
                    ID: {cliente.id}
                  </span>
                </div>
                <div className="cliente-actions">
                
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => apriModificaCliente(cliente)}
                    title="Modifica cliente"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleRichiediEliminazioneCliente(cliente)}
                    title="Elimina cliente"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="cliente-details">
                {cliente.email && (
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <a href={`mailto:${cliente.email}`} className="detail-link">
                      {cliente.email}
                    </a>
                  </div>
                )}
                {cliente.telefono && (
                  <div className="detail-item">
                    <span className="detail-icon">📞</span>
                    <a href={`tel:${cliente.telefono}`} className="detail-link">
                      {cliente.telefono}
                    </a>
                  </div>
                )}
                {cliente.indirizzo && (
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{cliente.indirizzo}</span>
                  </div>
                )}
              </div>

              <div className="cliente-footer">
                <span className="cliente-date">
                  Registrato il {new Date(cliente.created_at).toLocaleDateString('it-IT')}
                </span>
                <button 
                  className="btn-prenotazioni"
                  onClick={() => apriStorico(cliente)}
                >
                  📅 Visualizza Prenotazioni
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal per creare/modificare cliente */}
      <Modal
        isOpen={modalAperto !== null}
        onClose={chiudiModal}
        title={modalAperto === 'crea' ? 'Nuovo Cliente' : 'Modifica Cliente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="cliente-form">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Inserisci il nome completo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@esempio.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Telefono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+39 123 456 7890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="indirizzo">Indirizzo</label>
            <textarea
              id="indirizzo"
              name="indirizzo"
              value={formData.indirizzo}
              onChange={handleChange}
              rows="3"
              placeholder="Inserisci l'indirizzo completo"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={chiudiModal} className="btn btn-secondary">
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              {modalAperto === 'crea' ? 'Crea Cliente' : 'Salva Modifiche'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Storico Prenotazioni */}
      {storicoAperto && clienteSelezionato && (
        <div className="storico-overlay">
          <div className="storico-modal">
            <div className="storico-header">
              <h2>📊 Storico Prenotazioni</h2>
              <h3>{clienteSelezionato.nome}</h3>
              <button 
                className="storico-close"
                onClick={chiudiStorico}
              >
                ✕
              </button>
            </div>

            <div className="storico-statistiche">
              <div className="statistica">
                <span className="statistica-valore">{prenotazioniCliente.length}</span>
                <span className="statistica-label">Prenotazioni Totali</span>
              </div>
              <div className="statistica">
                <span className="statistica-valore">
                  €{calcolaTotaleSpeso().toFixed(2)}
                </span>
                <span className="statistica-label">Totale Speso</span>
              </div>
            </div>

            <div className="storico-lista">
              {loadingStorico ? (
                <div className="storico-loading">
                  <div className="loading-spinner"></div>
                  <p>Caricamento storico...</p>
                </div>
              ) : prenotazioniCliente.length > 0 ? (
                prenotazioniCliente.map(prenotazione => (
                  <div key={prenotazione.id} className="prenotazione-storico">
                    <div className="prenotazione-data">
                      <div className="prenotazione-giorno">
                        {formattaData(prenotazione.data_prenotazione)}
                      </div>
                      <div className="prenotazione-ora">
                        🕐 {formattaOra(prenotazione.ora_inizio)} - {formattaOra(prenotazione.ora_fine)}
                      </div>
                    </div>
                    
                    <div className="prenotazione-dettagli">
                      <div className="prenotazione-servizio">
                        🎯 {prenotazione.servizi?.nome}
                      </div>
                      <div className="prenotazione-prezzo">
                        💰 €{prenotazione.servizi?.prezzo || '0.00'}
                      </div>
                    </div>

                    {prenotazione.note && (
                      <div className="prenotazione-note">
                        📝 {prenotazione.note}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="storico-vuoto">
                  <p>Nessuna prenotazione trovata per questo cliente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Conferma Eliminazione */}
      {confermaEliminazioneAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <div className="conferma-icon">⚠️</div>
            <h3>Conferma Eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare il cliente <strong>{clienteDaEliminare?.nome}</strong>?
            </p>
            <p className="conferma-avviso">
              Questa azione non può essere annullata.
            </p>
            <div className="conferma-azioni">
              <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={handleAnnullaEliminazione}
              >
                ❌ Annulla
              </button>

              <button 
                className="conferma-btn conferma-btn-danger"
                onClick={handleConfermaEliminazione}
              >
                🗑️ Elimina
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
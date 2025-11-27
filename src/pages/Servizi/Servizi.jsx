import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { Modal } from '../../components/Modal/Modal';
import { ServizioForm } from '../../components/ServizioForm/ServizioForm';
import './Servizi.css';

export function Servizi() {
  const [servizi, setServizi] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [modalAperto, setModalAperto] = useState(null);
  const [servizioSelezionato, setServizioSelezionato] = useState(null);
  const [azioneInCorso, setAzioneInCorso] = useState(false);
  const [messaggio, setMessaggio] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('tutte');
  const [filtroStato, setFiltroStato] = useState('tutti');

  const fetchServizi = async () => {
    try {
      let query = supabase
        .from('servizi')
        .select('*')
        .order('created_at', { ascending: false });

      // Applica filtri
      if (filtroCategoria !== 'tutte') {
        query = query.eq('categoria', filtroCategoria);
      }
      if (filtroStato !== 'tutti') {
        query = query.eq('attivo', filtroStato === 'attivi');
      }

      const { data, error } = await query;

      if (error) throw error;
      setServizi(data || []);
    } catch (error) {
      console.error('Errore:', error);
      setMessaggio('❌ Errore nel caricamento servizi');
    } finally {
      //setLoading(false);
    }
  };

 useEffect(() => {
  fetchServizi();

  const subscription = supabase
    .channel('servizi-realtime')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'servizi' },
      () => {
        fetchServizi();
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filtroCategoria, filtroStato]);


  const apriCreaModal = () => {
    setServizioSelezionato(null);
    setModalAperto('crea');
  };

  const apriModificaModal = (servizio) => {
    setServizioSelezionato(servizio);
    setModalAperto('modifica');
  };

  const apriEliminaModal = (servizio) => {
    setServizioSelezionato(servizio);
    setModalAperto('elimina');
  };

  const chiudiModal = () => {
    setModalAperto(null);
    setServizioSelezionato(null);
    setMessaggio('');
  };
















  const handleCreaServizio = async (formData) => {
  setAzioneInCorso(true);
  try {
    const { error } = await supabase
      .from('servizi')
      .insert([formData]);

    if (error) throw error;

    setMessaggio('✅ Servizio creato con successo!');
    
    // 🔄 AGGIORNA LA LISTA IMMEDIATAMENTE
    await fetchServizi();
    
    setTimeout(() => {
      chiudiModal();
    }, 1500);
  } catch (error) {
    console.error('Errore creazione:', error);
    setMessaggio('❌ Errore durante la creazione');
  } finally {
    setAzioneInCorso(false);
  }
};

const handleModificaServizio = async (formData) => {
  setAzioneInCorso(true);
  try {
    const { error } = await supabase
      .from('servizi')
      .update(formData)
      .eq('id', servizioSelezionato.id);

    if (error) throw error;

    setMessaggio('✅ Servizio aggiornato con successo!');
    
    // 🔄 AGGIORNA LA LISTA IMMEDIATAMENTE
    await fetchServizi();
    
    setTimeout(() => {
      chiudiModal();
    }, 1500);
  } catch (error) {
    console.error('Errore aggiornamento:', error);
    setMessaggio('❌ Errore durante l\'aggiornamento');
  } finally {
    setAzioneInCorso(false);
  }
};

const handleEliminaServizio = async () => {
  setAzioneInCorso(true);
  try {
    const { error } = await supabase
      .from('servizi')
      .delete()
      .eq('id', servizioSelezionato.id);

    if (error) throw error;

    setMessaggio('✅ Servizio eliminato con successo!');
    
    // 🔄 AGGIORNA LA LISTA IMMEDIATAMENTE
    await fetchServizi();
    
    setTimeout(() => {
      chiudiModal();
    }, 1500);
  } catch (error) {
    console.error('Errore eliminazione:', error);
    setMessaggio('❌ Errore durante l\'eliminazione');
  } finally {
    setAzioneInCorso(false);
  }
};

const handleToggleStato = async (servizio) => {
  try {
    const { error } = await supabase
      .from('servizi')
      .update({ attivo: !servizio.attivo })
      .eq('id', servizio.id);

    if (error) throw error;

    setMessaggio(`✅ Servizio ${!servizio.attivo ? 'attivato' : 'disattivato'}!`);
    
    // 🔄 AGGIORNA LA LISTA IMMEDIATAMENTE
    await fetchServizi();
    
    setTimeout(() => setMessaggio(''), 3000);
  } catch (error) {
    console.error('Errore toggle stato:', error);
    setMessaggio('❌ Errore durante la modifica dello stato');
  }
};











  const formattaPrezzo = (prezzo) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(prezzo);
  };

  // Estrai categorie uniche per i filtri
  const categorie = ['tutte', ...new Set(servizi.map(s => s.categoria).filter(Boolean))];



  return (
    <div className="servizi-page">
      <div className="servizi-container">
        <div className="servizi-table-header">
          <div className="servizi-header">
            <h2 className="servizi-title">Gestione Servizi</h2>
            <div className="servizi-actions">
              <button
                onClick={apriCreaModal}
                className="servizi-btn servizi-btn-primary"
              >
                ➕ Nuovo Servizio
              </button>
            </div>
          </div>

          {/* Filtri */}
          <div className="servizi-filters">
            <div className="filter-group">
              <label className="filter-label">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="filter-select"
              >
                {categorie.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'tutte' ? 'Tutte le categorie' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Stato</label>
              <select
                value={filtroStato}
                onChange={(e) => setFiltroStato(e.target.value)}
                className="filter-select"
              >
                <option value="tutti">Tutti</option>
                <option value="attivi">Attivi</option>
                <option value="inattivi">Inattivi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="servizi-table-body">
          {messaggio && (
            <div className={`alert ${messaggio.includes('❌') ? 'alert-error' : 'alert-success'}`}>
              {messaggio}
            </div>
          )}

          {servizi.length === 0 ? (
            <div className="servizi-empty">
              <div className="servizi-empty-icon">🔧</div>
              <h3 className="servizi-empty-title">Nessun servizio trovato</h3>
              <p className="servizi-empty-description">
                {filtroCategoria !== 'tutte' || filtroStato !== 'tutti' 
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Inizia creando il tuo primo servizio'
                }
              </p>
           
            </div>
          ) : (
            <table className="servizi-table">
              <thead>
                <tr>
                  <th>Servizio</th>
                  <th>Prezzo</th>
                  <th>Durata</th>
                  <th>Categoria</th>
                  <th>Stato</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {servizi.map(servizio => (
                  <tr key={servizio.id}>
                    <td>
                      <div className="servizio-nome">{servizio.nome}</div>
                      {servizio.descrizione && (
                        <div className="servizio-descrizione">
                          {servizio.descrizione}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="servizio-prezzo">
                        {formattaPrezzo(servizio.prezzo)}
                      </div>
                    </td>
                    <td>
                      {servizio.durata && (
                        <div className="servizio-durata">
                          ⏱️ {servizio.durata} min
                        </div>
                      )}
                    </td>
                    <td>
                      {servizio.categoria && (
                        <span className="servizio-categoria">
                          {servizio.categoria}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`servizio-stato ${servizio.attivo ? 'servizio-attivo' : 'servizio-inattivo'}`}>
                        {servizio.attivo ? '✅ Attivo' : '❌ Inattivo'}
                      </span>
                    </td>
                    <td>
                      <div className="servizi-actions-cell">
                        <button
                          onClick={() => apriModificaModal(servizio)}
                          className="servizio-btn servizio-btn-edit"
                          title="Modifica servizio"
                        >
                          ✏️ Modifica
                        </button>
                        <button
                          onClick={() => handleToggleStato(servizio)}
                          className="servizio-btn servizio-btn-toggle"
                          title={servizio.attivo ? 'Disattiva' : 'Attiva'}
                        >
                          {servizio.attivo ? '⏸️ Disattiva' : '▶️ Attiva'}
                        </button>
                        <button
                          onClick={() => apriEliminaModal(servizio)}
                          className="servizio-btn servizio-btn-delete"
                          title="Elimina servizio"
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Crea/Modifica */}
      <Modal
        isOpen={modalAperto === 'crea' || modalAperto === 'modifica'}
        onClose={chiudiModal}
        title={modalAperto === 'crea' ? 'Crea Nuovo Servizio' : 'Modifica Servizio'}
        size="md"
      >
        {messaggio ? (
          <div className={`alert ${messaggio.includes('❌') ? 'alert-error' : 'alert-success'}`}>
            {messaggio}
          </div>
        ) : (
          <ServizioForm
            servizio={servizioSelezionato}
            onSubmit={modalAperto === 'crea' ? handleCreaServizio : handleModificaServizio}
            onCancel={chiudiModal}
            //loading={azioneInCorso}
          />
        )}
      </Modal>

      {/* Modal Elimina */}
<Modal
  isOpen={modalAperto === 'elimina'}
  onClose={chiudiModal}
  title="Conferma Eliminazione"
  size="sm"
>
  {messaggio ? (
    <div className={`alert ${messaggio.includes('❌') ? 'alert-error' : 'alert-success'}`}>
      {messaggio}
    </div>
  ) : (
    <div>
      <p className="mb-4">
        Sei sicuro di voler eliminare il servizio <strong>"{servizioSelezionato?.nome}"</strong>?
      </p>
      <p className="alert alert-warning mb-4">
        ⚠️ Questa azione non può essere annullata.
      </p>
      <div className="form-actions">
        <button
          onClick={chiudiModal}
          className="btn btn-outline"
          disabled={azioneInCorso}
        >
          Annulla
        </button>
        <button
          onClick={handleEliminaServizio}
          className="btn btn-danger"
          disabled={azioneInCorso}
        >
          {azioneInCorso ? 'Eliminazione...' : 'Conferma Eliminazione'}
        </button>
      </div>
    </div>
  )}
</Modal>
    </div>
  );
}
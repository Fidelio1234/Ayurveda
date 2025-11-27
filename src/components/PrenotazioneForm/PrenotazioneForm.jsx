/*import React, { useState, useEffect, useCallback } from 'react';
import './PrenotazioneForm.css';

export function PrenotazioneForm({ 
  prenotazione, 
  giorno, 
  clienti, 
  servizi, 
  prenotazioniEsistenti = [], 
  onSubmit, 
  onCancel,
  onDelete 
}) {
 

  // Funzione per convertire qualsiasi formato in stringa YYYY-MM-DD
  const convertiDataInStringa = (data) => {
    if (!data) return '';
    
    // Se è già una stringa YYYY-MM-DD, usala direttamente
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      return data;
    }
    
    // Se è un oggetto Date, convertilo in YYYY-MM-DD
    if (data instanceof Date) {
      const year = data.getFullYear();
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const day = String(data.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return '';
  };

  // Inizializzazione dello stato con data convertita
  const [formData, setFormData] = useState(() => {
    const dataConvertita = convertiDataInStringa(giorno);
    console.log('📅 Data convertita per form:', dataConvertita);
    
    const initialState = {
      cliente_id: '',
      servizio_id: '',
      data_prenotazione: dataConvertita,
      ora_inizio: '',
      ora_fine: '',
      note: ''
    };

    // Se stiamo modificando una prenotazione esistente
    if (prenotazione) {
      return {
        ...initialState,
        cliente_id: prenotazione.cliente_id || '',
        servizio_id: prenotazione.servizio_id || '',
        data_prenotazione: convertiDataInStringa(prenotazione.data_prenotazione),
        ora_inizio: prenotazione.ora_inizio || '',
        ora_fine: prenotazione.ora_fine || '',
        note: prenotazione.note || ''
      };
    }

    return initialState;
  });

  // CORREZIONE: Rimuovi completamente l'useEffect di debug o spostalo
  console.log('✅ FormData corrente:', formData);

  const [error, setError] = useState('');
  const [fasceOccupate, setFasceOccupate] = useState([]);
  const [confermaEliminazioneAperta, setConfermaEliminazioneAperta] = useState(false);

  const calcolaFasceOccupate = useCallback((dataSelezionata) => {
    if (!dataSelezionata) return [];
    
    const prenotazioniGiorno = prenotazioniEsistenti.filter(p => 
      p.data_prenotazione === dataSelezionata && p.id !== prenotazione?.id
    );
    
    return prenotazioniGiorno.map(p => ({
      inizio: p.ora_inizio,
      fine: p.ora_fine
    }));
  }, [prenotazioniEsistenti, prenotazione?.id]);

  useEffect(() => {
    if (formData.data_prenotazione) {
      const fasce = calcolaFasceOccupate(formData.data_prenotazione);
      setFasceOccupate(fasce);
    }
  }, [formData.data_prenotazione, calcolaFasceOccupate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServizioChange = (e) => {
    const servizioId = e.target.value;
    const servizioSelezionato = servizi.find(s => s.id === parseInt(servizioId));
    
    if (servizioSelezionato && formData.ora_inizio) {
      const oraInizio = new Date(`2000-01-01T${formData.ora_inizio}`);
      const oraFine = new Date(oraInizio.getTime() + servizioSelezionato.durata * 60000);
      
      const oraFineString = oraFine.toTimeString().slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        servizio_id: servizioId,
        ora_fine: oraFineString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        servizio_id: servizioId
      }));
    }
  };

  const handleOraInizioChange = (e) => {
    const oraInizio = e.target.value;
    const servizioSelezionato = servizi.find(s => s.id === parseInt(formData.servizio_id));
    
    if (servizioSelezionato) {
      const oraInizioDate = new Date(`2000-01-01T${oraInizio}`);
      const oraFineDate = new Date(oraInizioDate.getTime() + servizioSelezionato.durata * 60000);
      
      const oraFineString = oraFineDate.toTimeString().slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        ora_inizio: oraInizio,
        ora_fine: oraFineString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ora_inizio: oraInizio
      }));
    }
  };

  const verificaDisponibilita = () => {
    if (!formData.ora_inizio || !formData.ora_fine) return true;

    const nuovaPrenotazioneInizio = new Date(`2000-01-01T${formData.ora_inizio}`);
    const nuovaPrenotazioneFine = new Date(`2000-01-01T${formData.ora_fine}`);

    for (const fascia of fasceOccupate) {
      const fasciaInizio = new Date(`2000-01-01T${fascia.inizio}`);
      const fasciaFine = new Date(`2000-01-01T${fascia.fine}`);

      if (nuovaPrenotazioneInizio < fasciaFine && nuovaPrenotazioneFine > fasciaInizio) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validazioni
    if (!formData.cliente_id || !formData.servizio_id || !formData.data_prenotazione || 
        !formData.ora_inizio || !formData.ora_fine) {
      setError('Tutti i campi obbligatori devono essere compilati');
      return;
    }

    if (!verificaDisponibilita()) {
      setError('L\'orario selezionato si sovrappone con un\'altra prenotazione');
      return;
    }

    if (formData.ora_inizio >= formData.ora_fine) {
      setError('L\'ora di fine deve essere successiva all\'ora di inizio');
      return;
    }

    console.log('✅ Invio dati al database:', formData);
    onSubmit(formData);
  };

  const handleElimina = () => {
    setConfermaEliminazioneAperta(true);
  };

  const confermaEliminazione = () => {
    if (onDelete && prenotazione) {
      onDelete(prenotazione);
    }
    setConfermaEliminazioneAperta(false);
  };

  const annullaEliminazione = () => {
    setConfermaEliminazioneAperta(false);
  };

  const generaOpzioniOrario = () => {
    const opzioni = [];
    for (let ora = 8; ora <= 20; ora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const oraString = `${ora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        opzioni.push(oraString);
      }
    }
    return opzioni;
  };

  const opzioniOrario = generaOpzioniOrario();

  return (
    <>
      <form onSubmit={handleSubmit} className="prenotazione-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="cliente_id">Cliente *</label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleziona un cliente</option>
            {clienti.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} {cliente.email ? `(${cliente.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="servizio_id">Servizio *</label>
          <select
            id="servizio_id"
            name="servizio_id"
            value={formData.servizio_id}
            onChange={handleServizioChange}
            required
          >
            <option value="">Seleziona un servizio</option>
            {servizi.map(servizio => (
              <option key={servizio.id} value={servizio.id}>
                {servizio.nome} ({servizio.durata} min) - €{servizio.prezzo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data_prenotazione">Data *</label>
          <input
            type="date"
            id="data_prenotazione"
            name="data_prenotazione"
            value={formData.data_prenotazione}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ora_inizio">Ora Inizio *</label>
            <select
              id="ora_inizio"
              name="ora_inizio"
              value={formData.ora_inizio}
              onChange={handleOraInizioChange}
              required
            >
              <option value="">Seleziona orario</option>
              {opzioniOrario.map(ora => (
                <option key={ora} value={ora}>{ora}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ora_fine">Ora Fine *</label>
            <select
              id="ora_fine"
              name="ora_fine"
              value={formData.ora_fine}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona orario</option>
              {opzioniOrario.map(ora => (
                <option key={ora} value={ora}>{ora}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            placeholder="Note aggiuntive..."
          />
        </div>

        {fasceOccupate.length > 0 && (
          <div className="fasce-occupate">
            <h4>Fasce orarie occupate:</h4>
            <ul>
              {fasceOccupate.map((fascia, index) => (
                <li key={index}>
                  {fascia.inizio} - {fascia.fine}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <div className="form-actions-left">
            {prenotazione && (
              <button 
                type="button" 
                onClick={handleElimina} 
                className="btn btn-danger"
              >
                🗑️ Elimina
              </button>
            )}
          </div>
          
          <div className="form-actions-right">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Annulla
            </button>
            <button type="submit" className="btn btn-primary">
              {prenotazione ? 'Salva Modifiche' : 'Crea Prenotazione'}
            </button>
          </div>
        </div>
      </form>

      {/* Dialog di conferma eliminazione *//*}
      {confermaEliminazioneAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <h3>Conferma Eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare la prenotazione di{' '}
              <strong>{prenotazione?.clienti?.nome}</strong> per{' '}
              <strong>{prenotazione?.servizi?.nome}</strong> del{' '}
              {prenotazione?.data_prenotazione}?
            </p>
            <div className="conferma-azioni">
              <button 
                className="conferma-btn conferma-btn-danger"
                onClick={confermaEliminazione}
              >
                Elimina
              </button>
              <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={annullaEliminazione}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


*/










import React, { useState, useEffect, useCallback } from 'react';
import './PrenotazioneForm.css';

export function PrenotazioneForm({ 
  prenotazione, 
  giorno, 
  clienti, 
  servizi, 
  prenotazioniEsistenti = [], 
  onSubmit, 
  onCancel,
  onDelete,
  onEvadi 
}) {
  console.log('🔍 DEBUG - Giorno ricevuto:', giorno);
  console.log('🔍 DEBUG - Tipo giorno:', typeof giorno);

  // Funzione per convertire qualsiasi formato in stringa YYYY-MM-DD
  const convertiDataInStringa = (data) => {
    if (!data) return '';
    
    console.log('🔄 ConvertiData - Input:', data);
    
    // Se è già una stringa YYYY-MM-DD, usala direttamente
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      console.log('✅ Già in formato YYYY-MM-DD:', data);
      return data;
    }
    
    // Se è un oggetto Date, convertilo in YYYY-MM-DD considerando il fuso orario
    if (data instanceof Date) {
      // Usa i metodi locali invece di UTC
      const year = data.getFullYear();
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const day = String(data.getDate()).padStart(2, '0');
      const result = `${year}-${month}-${day}`;
      
      console.log('📅 Data convertita:', {
        input: data,
        output: result,
        getDate: data.getDate(),
        getUTCDate: data.getUTCDate()
      });
      
      return result;
    }
    
    console.log('❌ Formato non riconosciuto');
    return '';
  };

  // Inizializzazione dello stato con data convertita
  const [formData, setFormData] = useState(() => {
    const dataConvertita = convertiDataInStringa(giorno);
    console.log('📅 Data convertita per form:', dataConvertita);
    
    const initialState = {
      cliente_id: '',
      servizio_id: '',
      data_prenotazione: dataConvertita,
      ora_inizio: '',
      ora_fine: '',
      note: ''
    };

    // Se stiamo modificando una prenotazione esistente
    if (prenotazione) {
      return {
        ...initialState,
        cliente_id: prenotazione.cliente_id || '',
        servizio_id: prenotazione.servizio_id || '',
        data_prenotazione: convertiDataInStringa(prenotazione.data_prenotazione),
        ora_inizio: prenotazione.ora_inizio || '',
        ora_fine: prenotazione.ora_fine || '',
        note: prenotazione.note || ''
      };
    }

    return initialState;
  });

  const [prenotazioneChiusa, setPrenotazioneChiusa] = useState(prenotazione?.evasa || false);
  const [error, setError] = useState('');
  const [fasceOccupate, setFasceOccupate] = useState([]);
  const [confermaEliminazioneAperta, setConfermaEliminazioneAperta] = useState(false);
  const [confermaChiusuraAperta, setConfermaChiusuraAperta] = useState(false);

  // useEffect per aggiornare la data quando cambia la prop 'giorno'
  useEffect(() => {
    if (giorno && !prenotazione) {
      const nuovaData = convertiDataInStringa(giorno);
      console.log('🔄 Aggiornamento data da prop giorno:', {
        giornoInput: giorno,
        nuovaData: nuovaData,
        formDataAttuale: formData.data_prenotazione
      });
      
      if (nuovaData && nuovaData !== formData.data_prenotazione) {
        setFormData(prev => ({
          ...prev,
          data_prenotazione: nuovaData
        }));
      }
    }
  }, [giorno, prenotazione, formData.data_prenotazione]);

  console.log('✅ FormData corrente:', formData);

  const calcolaFasceOccupate = useCallback((dataSelezionata) => {
    if (!dataSelezionata) return [];
    
    const prenotazioniGiorno = prenotazioniEsistenti.filter(p => 
      p.data_prenotazione === dataSelezionata && p.id !== prenotazione?.id
    );
    
    return prenotazioniGiorno.map(p => ({
      inizio: p.ora_inizio,
      fine: p.ora_fine
    }));
  }, [prenotazioniEsistenti, prenotazione?.id]);

  useEffect(() => {
    if (formData.data_prenotazione) {
      const fasce = calcolaFasceOccupate(formData.data_prenotazione);
      setFasceOccupate(fasce);
    }
  }, [formData.data_prenotazione, calcolaFasceOccupate]);

  const handleChange = (e) => {
    if (prenotazioneChiusa) return; // Blocca modifiche se chiusa
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServizioChange = (e) => {
    if (prenotazioneChiusa) return; // Blocca modifiche se chiusa
    
    const servizioId = e.target.value;
    const servizioSelezionato = servizi.find(s => s.id === parseInt(servizioId));
    
    if (servizioSelezionato && formData.ora_inizio) {
      const oraInizio = new Date(`2000-01-01T${formData.ora_inizio}`);
      const oraFine = new Date(oraInizio.getTime() + servizioSelezionato.durata * 60000);
      
      const oraFineString = oraFine.toTimeString().slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        servizio_id: servizioId,
        ora_fine: oraFineString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        servizio_id: servizioId
      }));
    }
  };

  const handleOraInizioChange = (e) => {
    if (prenotazioneChiusa) return; // Blocca modifiche se chiusa
    
    const oraInizio = e.target.value;
    const servizioSelezionato = servizi.find(s => s.id === parseInt(formData.servizio_id));
    
    if (servizioSelezionato) {
      const oraInizioDate = new Date(`2000-01-01T${oraInizio}`);
      const oraFineDate = new Date(oraInizioDate.getTime() + servizioSelezionato.durata * 60000);
      
      const oraFineString = oraFineDate.toTimeString().slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        ora_inizio: oraInizio,
        ora_fine: oraFineString
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ora_inizio: oraInizio
      }));
    }
  };

  const verificaDisponibilita = () => {
    if (!formData.ora_inizio || !formData.ora_fine) return true;

    const nuovaPrenotazioneInizio = new Date(`2000-01-01T${formData.ora_inizio}`);
    const nuovaPrenotazioneFine = new Date(`2000-01-01T${formData.ora_fine}`);

    for (const fascia of fasceOccupate) {
      const fasciaInizio = new Date(`2000-01-01T${fascia.inizio}`);
      const fasciaFine = new Date(`2000-01-01T${fascia.fine}`);

      if (nuovaPrenotazioneInizio < fasciaFine && nuovaPrenotazioneFine > fasciaInizio) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prenotazioneChiusa) return; // Blocca invio se chiusa
    
    setError('');

    // Validazioni
    if (!formData.cliente_id || !formData.servizio_id || !formData.data_prenotazione || 
        !formData.ora_inizio || !formData.ora_fine) {
      setError('Tutti i campi obbligatori devono essere compilati');
      return;
    }

    if (!verificaDisponibilita()) {
      setError('L\'orario selezionato si sovrappone con un\'altra prenotazione');
      return;
    }

    if (formData.ora_inizio >= formData.ora_fine) {
      setError('L\'ora di fine deve essere successiva all\'ora di inizio');
      return;
    }

    console.log('✅ Invio dati al database:', formData);
    onSubmit(formData);
  };

  const handleElimina = () => {
    if (prenotazioneChiusa) return; // Blocca eliminazione se chiusa
    setConfermaEliminazioneAperta(true);
  };

  const handleChiudiPrenotazione = () => {
    if (prenotazioneChiusa) return;
    setConfermaChiusuraAperta(true);
  };

  const confermaChiusura = () => {
    if (prenotazione && onEvadi) {
      onEvadi(prenotazione);
      setPrenotazioneChiusa(true);
    }
    setConfermaChiusuraAperta(false);
  };

  const annullaChiusura = () => {
    setConfermaChiusuraAperta(false);
  };

  const confermaEliminazione = () => {
    if (onDelete && prenotazione) {
      onDelete(prenotazione);
    }
    setConfermaEliminazioneAperta(false);
  };

  const annullaEliminazione = () => {
    setConfermaEliminazioneAperta(false);
  };

  const generaOpzioniOrario = () => {
    const opzioni = [];
    for (let ora = 8; ora <= 20; ora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const oraString = `${ora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        opzioni.push(oraString);
      }
    }
    return opzioni;
  };

  const opzioniOrario = generaOpzioniOrario();

  return (
    <>
      <form onSubmit={handleSubmit} className={`prenotazione-form ${prenotazioneChiusa ? 'form-chiusa' : ''}`}>
        {error && <div className="form-error">{error}</div>}

        {prenotazioneChiusa && (
          <div className="chiusa-banner">
            ✅ Prenotazione chiusa - Modifiche disabilitate
          </div>
        )}

        <div className="form-group">
          <label htmlFor="cliente_id">Cliente *</label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
            disabled={prenotazioneChiusa}
          >
            <option value="">Seleziona un cliente</option>
            {clienti.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} {cliente.email ? `(${cliente.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="servizio_id">Servizio *</label>
          <select
            id="servizio_id"
            name="servizio_id"
            value={formData.servizio_id}
            onChange={handleServizioChange}
            required
            disabled={prenotazioneChiusa}
          >
            <option value="">Seleziona un servizio</option>
            {servizi.map(servizio => (
              <option key={servizio.id} value={servizio.id}>
                {servizio.nome} ({servizio.durata} min) - €{servizio.prezzo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data_prenotazione">Data *</label>
          <input
            type="date"
            id="data_prenotazione"
            name="data_prenotazione"
            value={formData.data_prenotazione}
            onChange={handleChange}
            required
            disabled={prenotazioneChiusa}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ora_inizio">Ora Inizio *</label>
            <select
              id="ora_inizio"
              name="ora_inizio"
              value={formData.ora_inizio}
              onChange={handleOraInizioChange}
              required
              disabled={prenotazioneChiusa}
            >
              <option value="">Seleziona orario</option>
              {opzioniOrario.map(ora => (
                <option key={ora} value={ora}>{ora}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ora_fine">Ora Fine *</label>
            <select
              id="ora_fine"
              name="ora_fine"
              value={formData.ora_fine}
              onChange={handleChange}
              required
              disabled={prenotazioneChiusa}
            >
              <option value="">Seleziona orario</option>
              {opzioniOrario.map(ora => (
                <option key={ora} value={ora}>{ora}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            placeholder="Note aggiuntive..."
            disabled={prenotazioneChiusa}
          />
        </div>

        {fasceOccupate.length > 0 && (
          <div className="fasce-occupate">
            <h4>Fasce orarie occupate:</h4>
            <ul>
              {fasceOccupate.map((fascia, index) => (
                <li key={index}>
                  {fascia.inizio} - {fascia.fine}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <div className="form-actions-left">
            {prenotazione && !prenotazioneChiusa && (
              <button 
                type="button" 
                onClick={handleElimina} 
                className="btn btn-danger"
              >
                🗑️ Elimina
              </button>
            )}
          </div>
          
          <div className="form-actions-right">
            {prenotazione ? (
              // Se stiamo modificando una prenotazione esistente
              <>
                <button 
                  type="button" 
                  onClick={handleChiudiPrenotazione}
                  className="btn btn-success"
                  disabled={prenotazioneChiusa}
                >
                  {prenotazioneChiusa ? '✅ Chiusa' : '✓ Chiudi Prenotazione'}
                </button>
           
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={prenotazioneChiusa}
                >
                  Salva Modifiche
                </button>
              </>
            ) : (
              // Se stiamo creando una nuova prenotazione
              <>
                <button type="button" onClick={onCancel} className="btn btn-secondary">
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Crea Prenotazione
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* Dialog di conferma chiusura */}
      {confermaChiusuraAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <h3>Conferma Chiusura Prenotazione</h3>
            <p>
              Sei sicuro di voler chiudere la prenotazione di{' '}
              <strong>{prenotazione?.clienti?.nome}</strong> per{' '}
              <strong>{prenotazione?.servizi?.nome}</strong> del{' '}
              {prenotazione?.data_prenotazione} alle {prenotazione?.ora_inizio}?
            </p>
            <div className="conferma-azioni">

                <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={annullaChiusura}
              >
                Annulla
              </button>
              
              <button 
                className="conferma-btn conferma-btn-success"
                onClick={confermaChiusura}
              >
                ✓ Chiudi Prenotazione
              </button>
            
            </div>
          </div>
        </div>
      )}

      {/* Dialog di conferma eliminazione */}
      {confermaEliminazioneAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <h3>Conferma Eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare la prenotazione di{' '}
              <strong>{prenotazione?.clienti?.nome}</strong> per{' '}
              <strong>{prenotazione?.servizi?.nome}</strong> del{' '}
              {prenotazione?.data_prenotazione}?
            </p>
            <div className="conferma-azioni">
              <button 
                className="conferma-btn conferma-btn-danger"
                onClick={confermaEliminazione}
              >
                Elimina
              </button>
              <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={annullaEliminazione}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
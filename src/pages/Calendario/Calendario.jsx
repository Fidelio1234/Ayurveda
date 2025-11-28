/*import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Modal } from '../../components/Modal/Modal';
import { PrenotazioneForm } from '../../components/PrenotazioneForm/PrenotazioneForm';
import { GiornoCalendario } from '../../components/GiornoCalendario/GiornoCalendario';
import { LogoutModal } from './LogoutModal';
import './Calendario.css';

export function Calendario() {
  const [dataCorrente, setDataCorrente] = useState(new Date());
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAperto, setModalAperto] = useState(null);
  const [giornoSelezionato, setGiornoSelezionato] = useState(null);
  const [prenotazioneSelezionata, setPrenotazioneSelezionata] = useState(null);
  const [confermaEliminazioneAperta, setConfermaEliminazioneAperta] = useState(false);
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] = useState(null);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const mesi = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const giorniTotaliGriglia = 42;


const handleLogout = () => {
    // Cancella tutti i dati di sessione
    localStorage.clear();
    sessionStorage.clear();
    // Ricarica la pagina
    window.location.href = '/';
  };






  const caricaDati = useCallback(async () => {
    setLoading(false);
    try {
      const inizioMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
      const fineMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 0);
      
      const { data: prenotazioniData, error: prenotazioniError } = await supabase
        .from('prenotazioni')
        .select(`
          *,
          clienti (id, nome, email, telefono),
          servizi (id, nome, prezzo, durata)
        `)
        .gte('data_prenotazione', inizioMese.toISOString().split('T')[0])
        .lte('data_prenotazione', fineMese.toISOString().split('T')[0])
        .order('data_prenotazione', { ascending: true })
        .order('ora_inizio', { ascending: true });

      if (prenotazioniError) throw prenotazioniError;

      const { data: clientiData, error: clientiError } = await supabase
        .from('clienti')
        .select('*')
        .order('nome', { ascending: true });

      if (clientiError) throw clientiError;

      const { data: serviziData, error: serviziError } = await supabase
        .from('servizi')
        .select('*')
        .eq('attivo', true)
        .order('nome', { ascending: true });

      if (serviziError) throw serviziError;

      setPrenotazioni(prenotazioniData || []);
      setClienti(clientiData || []);
      setServizi(serviziData || []);

    } catch (error) {
      console.error('Errore caricamento dati:', error);
    } finally {
      setLoading(false);
    }
  }, [dataCorrente]);

  useEffect(() => {
    caricaDati();

    const subscription = supabase
      .channel('calendario-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'prenotazioni' },
        () => {
          caricaDati();
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [caricaDati]);

  const mesePrecedente = () => {
    setDataCorrente(new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() - 1, 1));
  };

  const meseSuccessivo = () => {
    setDataCorrente(new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 1));
  };

  const oggi = () => {
    setDataCorrente(new Date());
  };

  // 🔥 CORREZIONE: Passa l'oggetto Date originale, non una stringa
  const apriCreaPrenotazione = (giorno) => {
    console.log('📅 CLICK - Apri crea prenotazione per giorno:', giorno);
    console.log('   📊 Data originale:', giorno);
    console.log('   📅 Giorno del mese:', giorno.getDate());
    
    // 🔥 CORREZIONE: Passa l'oggetto Date originale invece di convertire in stringa
    setGiornoSelezionato(giorno); // Passa l'oggetto Date
    setPrenotazioneSelezionata(null);
    setModalAperto('crea');
  };

  const apriModificaPrenotazione = (prenotazione) => {
   
    
    setPrenotazioneSelezionata(prenotazione);
    
    const giornoDalDatabase = new Date(prenotazione.data_prenotazione + 'T00:00:00');
    
    
    
    setGiornoSelezionato(giornoDalDatabase);
    setModalAperto('modifica');
  };

  const chiudiModal = () => {
    setModalAperto(null);
    setGiornoSelezionato(null);
    setPrenotazioneSelezionata(null);
  };






  const handleCreaPrenotazione = async (formData) => {
  try {
    const datiPerDatabase = {
      cliente_id: formData.cliente_id,
      servizio_id: formData.servizio_id,
      data_prenotazione: formData.data_prenotazione, // Mantieni la stringa originale
      ora_inizio: formData.ora_inizio,
      ora_fine: formData.ora_fine,
      note: formData.note || null
    };
    
    const { error } = await supabase
      .from('prenotazioni')
      .insert([datiPerDatabase])
      .select();

    if (error) throw error;

    await caricaDati();
    chiudiModal();
    
  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    alert('Errore durante la creazione della prenotazione: ' + error.message);
  }
};













  const handleModificaPrenotazione = async (formData) => {
    try {
      const { error } = await supabase
        .from('prenotazioni')
        .update(formData)
        .eq('id', prenotazioneSelezionata.id);

      if (error) throw error;

      chiudiModal();
    } catch (error) {
      console.error('Errore modifica prenotazione:', error);
      alert('Errore durante la modifica della prenotazione');
    }
  };

  const handleEliminaPrenotazione = async (prenotazione) => {
    try {
      console.log('Eliminazione prenotazione:', prenotazione.id);
      
      const { error } = await supabase
        .from('prenotazioni')
        .delete()
        .eq('id', prenotazione.id);

      if (error) throw error;

      await caricaDati();
      chiudiModal();
      
      console.log('Prenotazione eliminata con successo');
      
    } catch (error) {
      console.error('Errore eliminazione prenotazione:', error);
      alert('Errore durante l\'eliminazione della prenotazione');
    }
  };

  const handleRichiediEliminazionePrenotazione = (prenotazione) => {
    setPrenotazioneDaEliminare(prenotazione);
    setConfermaEliminazioneAperta(true);
  };

  const handleConfermaEliminazione = async () => {
    if (!prenotazioneDaEliminare) return;

    try {
      console.log('Eliminazione prenotazione dal calendario:', prenotazioneDaEliminare.id);
      
      const { error } = await supabase
        .from('prenotazioni')
        .delete()
        .eq('id', prenotazioneDaEliminare.id);

      if (error) throw error;

      await caricaDati();
      
      setConfermaEliminazioneAperta(false);
      setPrenotazioneDaEliminare(null);
      
      console.log('Prenotazione eliminata con successo dal calendario');
      
    } catch (error) {
      console.error('Errore eliminazione prenotazione:', error);
      alert('Errore durante l\'eliminazione della prenotazione');
    }
  };

  const handleAnnullaEliminazione = () => {
    setConfermaEliminazioneAperta(false);
    setPrenotazioneDaEliminare(null);
  };

  const generaGiorniCalendario = () => {
    const primoGiornoMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
    const ultimoGiornoMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 0);
    const giorniMesePrecedente = primoGiornoMese.getDay() === 0 ? 6 : primoGiornoMese.getDay() - 1;
    
    const giorni = [];

    for (let i = giorniMesePrecedente - 1; i >= 0; i--) {
      const giorno = new Date(primoGiornoMese);
      giorno.setDate(giorno.getDate() - (i + 1));
      giorni.push({ data: new Date(giorno), altroMese: true });
    }

    for (let i = 1; i <= ultimoGiornoMese.getDate(); i++) {
      const giorno = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), i);
      giorni.push({ data: giorno, altroMese: false });
    }

    const giorniRimanenti = giorniTotaliGriglia - giorni.length;
    for (let i = 1; i <= giorniRimanenti; i++) {
      const giorno = new Date(ultimoGiornoMese);
      giorno.setDate(giorno.getDate() + i);
      giorni.push({ data: giorno, altroMese: true });
    }

    return giorni;
  };




// Aggiungi questa funzione nel componente Calendario
const handleEvadiPrenotazione = async (prenotazione) => {
  try {
    console.log('Evadi prenotazione:', prenotazione.id);
    
    const { error } = await supabase
      .from('prenotazioni')
      .update({ evasa: true })
      .eq('id', prenotazione.id);

    if (error) throw error;

    await caricaDati();
    chiudiModal(); // Chiudi il modal dopo aver evaso
    
    console.log('Prenotazione evasa con successo');
    
  } catch (error) {
    console.error('Errore evasione prenotazione:', error);
    alert('Errore durante l\'evasione della prenotazione');
  }
};




// 🔥 CORREZIONE: Funzione migliorata per filtrare le prenotazioni
const getPrenotazioniGiorno = (giorno) => {
  // Crea la data string in modo sicuro
  const anno = giorno.getFullYear();
  const mese = String(giorno.getMonth() + 1).padStart(2, '0');
  const giornoNum = String(giorno.getDate()).padStart(2, '0');
  const dataString = `${anno}-${mese}-${giornoNum}`;
  
  //console.log('🔍 DEBUG getPrenotazioniGiorno:');
  //console.log('   📅 Giorno passato:', giorno);
  //console.log('   📊 Data string per filtro:', dataString);
  //console.log('   📋 Numero totale prenotazioni:', prenotazioni.length);
  
  const prenotazioniTrovate = prenotazioni.filter(p => {
    //console.log('   🔄 Confronto:', p.data_prenotazione, '===', dataString, '→', p.data_prenotazione === dataString);
    return p.data_prenotazione === dataString;
  });
  
  //console.log('   ✅ Prenotazioni trovate per', dataString, ':', prenotazioniTrovate.length);
  return prenotazioniTrovate;
};
  const giorniCalendario = generaGiorniCalendario();

  const isOggi = (data) => {
    return new Date().toDateString() === data.toDateString();
  };

  // Funzione per verificare se è domenica
  const isDomenica = (data) => {
    return data.getDay() === 0;
  };

  if (loading) {
    return (
      <div className="calendario-loading">
        <div className="calendario-spinner"></div>
        <p>Caricamento calendario...</p>
      </div>
    );
  }

  return (
    <div className="calendario-page">
      <div className="calendario-container">
        <div className="calendario-header">
          <h1 className="calendario-title">📅 Calendario Prenotazioni</h1>
          <p className="calendario-subtitle">
            Gestisci le prenotazioni dei tuoi clienti in modo semplice e intuitivo
          </p>
        </div>

        <div className="calendario-controls">
          <div className="calendario-navigation">
            <button onClick={mesePrecedente} className="calendario-btn">
              ◀ Mese Prec.
            </button>
            <button onClick={oggi} className="calendario-btn calendario-btn-primary">
              🎯 Oggi
            </button>
            <button onClick={meseSuccessivo} className="calendario-btn">
              Mese Succ. ▶
            </button>
    <button 
            className="calendario-btn1 calendario-btn1-logout"
            onClick={() => setLogoutModalOpen(true)}
          >
            🔓 Logout
          </button>

          </div>



    

          <div className="calendario-mese-anno">
            {mesi[dataCorrente.getMonth()]} {dataCorrente.getFullYear()}
          </div>

          <div className="calendario-filtri">
            <select className="calendario-select">
              <option>Tutti i servizi</option>
              {servizi.map(servizio => (
                <option key={servizio.id} value={servizio.id}>
                  {servizio.nome}
                </option>
              ))}
            </select>
            <select className="calendario-select">
              <option>Tutti i clienti</option>
              {clienti.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIMOSSA LA RIGA DEI GIORNI DELLA SETTIMANA *//*}
        <div className="calendario-giorni">
          {giorniCalendario.map(({ data, altroMese }, index) => (
            <GiornoCalendario
              key={index}
              data={data}
              altroMese={altroMese}
              prenotazioni={getPrenotazioniGiorno(data)}
              onAggiungiPrenotazione={apriCreaPrenotazione}
              onModificaPrenotazione={apriModificaPrenotazione}
              onEliminaPrenotazione={handleRichiediEliminazionePrenotazione}
              onEvadiPrenotazione={handleEvadiPrenotazione}
              oggi={isOggi(data)}
              domenica={isDomenica(data)} // Passa la prop domenica
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalAperto !== null}
        onClose={chiudiModal}
        title={modalAperto === 'crea' ? 'Nuova Prenotazione' : 'Modifica Prenotazione'}
        size="lg"
      >
        <PrenotazioneForm
          prenotazione={prenotazioneSelezionata}
          giorno={giornoSelezionato} // 🔥 Ora passa l'oggetto Date invece della stringa
          clienti={clienti}
          servizi={servizi}
          prenotazioniEsistenti={prenotazioni}
          onSubmit={modalAperto === 'crea' ? handleCreaPrenotazione : handleModificaPrenotazione}
          onCancel={chiudiModal}
          onDelete={handleEliminaPrenotazione}
           onEvadi={handleEvadiPrenotazione}
        />
      </Modal>

<LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />



      {confermaEliminazioneAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <h3>Conferma Eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare la prenotazione di{' '}
              <strong>{prenotazioneDaEliminare?.clienti?.nome}</strong> per{' '}
              <strong>{prenotazioneDaEliminare?.servizi?.nome}</strong> del{' '}
              {prenotazioneDaEliminare?.data_prenotazione}?
            </p>
            <div className="conferma-azioni">
              <button 
                className="conferma-btn conferma-btn-danger"
                onClick={handleConfermaEliminazione}
              >
                Elimina
              </button>
              <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={handleAnnullaEliminazione}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

*/






import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase/client';
import { Modal } from '../../components/Modal/Modal';
import { PrenotazioneForm } from '../../components/PrenotazioneForm/PrenotazioneForm';
import { GiornoCalendario } from '../../components/GiornoCalendario/GiornoCalendario';
import { LogoutModal } from './LogoutModal';
import './Calendario.css';

export function Calendario() {
  const [dataCorrente, setDataCorrente] = useState(new Date());
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [modalAperto, setModalAperto] = useState(null);
  const [giornoSelezionato, setGiornoSelezionato] = useState(null);
  const [prenotazioneSelezionata, setPrenotazioneSelezionata] = useState(null);
  const [confermaEliminazioneAperta, setConfermaEliminazioneAperta] = useState(false);
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [filtroServizio, setFiltroServizio] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const mesi = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const giorniTotaliGriglia = 42;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const caricaDati = useCallback(async () => {
    try {
      const inizioMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
      const fineMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 0);
      
      const { data: prenotazioniData, error: prenotazioniError } = await supabase
        .from('prenotazioni')
        .select(`
          *,
          clienti (id, nome, email, telefono),
          servizi (id, nome, prezzo, durata)
        `)
        .gte('data_prenotazione', inizioMese.toISOString().split('T')[0])
        .lte('data_prenotazione', fineMese.toISOString().split('T')[0])
        .order('data_prenotazione', { ascending: true })
        .order('ora_inizio', { ascending: true });

      if (prenotazioniError) throw prenotazioniError;

      const { data: clientiData, error: clientiError } = await supabase
        .from('clienti')
        .select('*')
        .order('nome', { ascending: true });

      if (clientiError) throw clientiError;

      const { data: serviziData, error: serviziError } = await supabase
        .from('servizi')
        .select('*')
        .eq('attivo', true)
        .order('nome', { ascending: true });

      if (serviziError) throw serviziError;

      setPrenotazioni(prenotazioniData || []);
      setClienti(clientiData || []);
      setServizi(serviziData || []);

    } catch (error) {
      console.error('Errore caricamento dati:', error);
    }
  }, [dataCorrente]);

  useEffect(() => {
    caricaDati();

    const subscription = supabase
      .channel('calendario-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'prenotazioni' },
        () => {
          caricaDati();
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [caricaDati]);

  const mesePrecedente = () => {
    setDataCorrente(new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() - 1, 1));
  };

  const meseSuccessivo = () => {
    setDataCorrente(new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 1));
  };

  const oggi = () => {
    setDataCorrente(new Date());
  };

  const apriCreaPrenotazione = (giorno) => {
    setGiornoSelezionato(giorno);
    setPrenotazioneSelezionata(null);
    setModalAperto('crea');
  };

  const apriModificaPrenotazione = (prenotazione) => {
    setPrenotazioneSelezionata(prenotazione);
    const giornoDalDatabase = new Date(prenotazione.data_prenotazione + 'T00:00:00');
    setGiornoSelezionato(giornoDalDatabase);
    setModalAperto('modifica');
  };

  const chiudiModal = () => {
    setModalAperto(null);
    setGiornoSelezionato(null);
    setPrenotazioneSelezionata(null);
  };

  const handleCreaPrenotazione = async (formData) => {
    try {
      const datiPerDatabase = {
        cliente_id: formData.cliente_id,
        servizio_id: formData.servizio_id,
        data_prenotazione: formData.data_prenotazione,
        ora_inizio: formData.ora_inizio,
        ora_fine: formData.ora_fine,
        note: formData.note || null
      };
      
      const { error } = await supabase
        .from('prenotazioni')
        .insert([datiPerDatabase])
        .select();

      if (error) throw error;

      await caricaDati();
      chiudiModal();
      
    } catch (error) {
      console.error('Errore creazione prenotazione:', error);
      alert('Errore durante la creazione della prenotazione: ' + error.message);
    }
  };

  const handleModificaPrenotazione = async (formData) => {
    try {
      const { error } = await supabase
        .from('prenotazioni')
        .update(formData)
        .eq('id', prenotazioneSelezionata.id);

      if (error) throw error;

      chiudiModal();
    } catch (error) {
      console.error('Errore modifica prenotazione:', error);
      alert('Errore durante la modifica della prenotazione');
    }
  };

  const handleEliminaPrenotazione = async (prenotazione) => {
    try {
      const { error } = await supabase
        .from('prenotazioni')
        .delete()
        .eq('id', prenotazione.id);

      if (error) throw error;

      await caricaDati();
      chiudiModal();
      
    } catch (error) {
      console.error('Errore eliminazione prenotazione:', error);
      alert('Errore durante l\'eliminazione della prenotazione');
    }
  };

  const handleRichiediEliminazionePrenotazione = (prenotazione) => {
    setPrenotazioneDaEliminare(prenotazione);
    setConfermaEliminazioneAperta(true);
  };

  const handleConfermaEliminazione = async () => {
    if (!prenotazioneDaEliminare) return;

    try {
      const { error } = await supabase
        .from('prenotazioni')
        .delete()
        .eq('id', prenotazioneDaEliminare.id);

      if (error) throw error;

      await caricaDati();
      setConfermaEliminazioneAperta(false);
      setPrenotazioneDaEliminare(null);
      
    } catch (error) {
      console.error('Errore eliminazione prenotazione:', error);
      alert('Errore durante l\'eliminazione della prenotazione');
    }
  };

  const handleAnnullaEliminazione = () => {
    setConfermaEliminazioneAperta(false);
    setPrenotazioneDaEliminare(null);
  };

  const handleEvadiPrenotazione = async (prenotazione) => {
    try {
      const { error } = await supabase
        .from('prenotazioni')
        .update({ evasa: true })
        .eq('id', prenotazione.id);

      if (error) throw error;

      await caricaDati();
      chiudiModal();
      
    } catch (error) {
      console.error('Errore evasione prenotazione:', error);
      alert('Errore durante l\'evasione della prenotazione');
    }
  };

  // Funzione per filtrare le prenotazioni in base ai filtri
  const getPrenotazioniFiltrate = (giorno) => {
    const anno = giorno.getFullYear();
    const mese = String(giorno.getMonth() + 1).padStart(2, '0');
    const giornoNum = String(giorno.getDate()).padStart(2, '0');
    const dataString = `${anno}-${mese}-${giornoNum}`;
    
    let prenotazioniFiltrate = prenotazioni.filter(p => p.data_prenotazione === dataString);

    // Applica filtro servizio
    if (filtroServizio) {
      prenotazioniFiltrate = prenotazioniFiltrate.filter(p => 
        p.servizio_id === parseInt(filtroServizio)
      );
    }

    // Applica filtro cliente
    if (filtroCliente) {
      prenotazioniFiltrate = prenotazioniFiltrate.filter(p => 
        p.cliente_id === parseInt(filtroCliente)
      );
    }

    return prenotazioniFiltrate;
  };

  const generaGiorniCalendario = () => {
    const primoGiornoMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), 1);
    const ultimoGiornoMese = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() + 1, 0);
    const giorniMesePrecedente = primoGiornoMese.getDay() === 0 ? 6 : primoGiornoMese.getDay() - 1;
    
    const giorni = [];

    for (let i = giorniMesePrecedente - 1; i >= 0; i--) {
      const giorno = new Date(primoGiornoMese);
      giorno.setDate(giorno.getDate() - (i + 1));
      giorni.push({ data: new Date(giorno), altroMese: true });
    }

    for (let i = 1; i <= ultimoGiornoMese.getDate(); i++) {
      const giorno = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth(), i);
      giorni.push({ data: giorno, altroMese: false });
    }

    const giorniRimanenti = giorniTotaliGriglia - giorni.length;
    for (let i = 1; i <= giorniRimanenti; i++) {
      const giorno = new Date(ultimoGiornoMese);
      giorno.setDate(giorno.getDate() + i);
      giorni.push({ data: giorno, altroMese: true });
    }

    return giorni;
  };

  const giorniCalendario = generaGiorniCalendario();

  const isOggi = (data) => {
    return new Date().toDateString() === data.toDateString();
  };

  const isDomenica = (data) => {
    return data.getDay() === 0;
  };

  return (
    <div className="calendario-page">
      <div className="calendario-container">
        <div className="calendario-header">
          <h1 className="calendario-title">📅 Calendario Prenotazioni</h1>
          <p className="calendario-subtitle">
            Gestisci le prenotazioni dei tuoi clienti in modo semplice e intuitivo
          </p>
        </div>

        <div className="calendario-controls">
          <div className="calendario-navigation">
            <button onClick={mesePrecedente} className="calendario-btn">
              ◀ Mese Prec.
            </button>
            <button onClick={oggi} className="calendario-btn calendario-btn-primary">
              🎯 Oggi
            </button>
            <button onClick={meseSuccessivo} className="calendario-btn">
              Mese Succ. ▶
            </button>
            <button 
              className="calendario-btn1 calendario-btn-logout"
              onClick={() => setLogoutModalOpen(true)}
            >
              🔓 Logout
            </button>
          </div>

          <div className="calendario-mese-anno">
            {mesi[dataCorrente.getMonth()]} {dataCorrente.getFullYear()}
          </div>

          <div className="calendario-filtri">
            <select 
              className="calendario-select"
              value={filtroServizio}
              onChange={(e) => setFiltroServizio(e.target.value)}
            >
              <option value="">Tutti i servizi</option>
              {servizi.map(servizio => (
                <option key={servizio.id} value={servizio.id}>
                  {servizio.nome}
                </option>
              ))}
            </select>
            <select 
              className="calendario-select"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            >
              <option value="">Tutti i clienti</option>
              {clienti.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            
            {/* Pulsante per resettare i filtri */}
        
          </div>
        </div>

        <div className="calendario-giorni">
          {giorniCalendario.map(({ data, altroMese }, index) => (
            <GiornoCalendario
              key={index}
              data={data}
              altroMese={altroMese}
              prenotazioni={getPrenotazioniFiltrate(data)}
              onAggiungiPrenotazione={apriCreaPrenotazione}
              onModificaPrenotazione={apriModificaPrenotazione}
              onEliminaPrenotazione={handleRichiediEliminazionePrenotazione}
              onEvadiPrenotazione={handleEvadiPrenotazione}
              oggi={isOggi(data)}
              domenica={isDomenica(data)}
            />
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalAperto !== null}
        onClose={chiudiModal}
        title={modalAperto === 'crea' ? 'Nuova Prenotazione' : 'Modifica Prenotazione'}
        size="lg"
      >
        <PrenotazioneForm
          prenotazione={prenotazioneSelezionata}
          giorno={giornoSelezionato}
          clienti={clienti}
          servizi={servizi}
          prenotazioniEsistenti={prenotazioni}
          onSubmit={modalAperto === 'crea' ? handleCreaPrenotazione : handleModificaPrenotazione}
          onCancel={chiudiModal}
          onDelete={handleEliminaPrenotazione}
          onEvadi={handleEvadiPrenotazione}
        />
      </Modal>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onLogout={handleLogout}
      />

      {confermaEliminazioneAperta && (
        <div className="conferma-overlay">
          <div className="conferma-dialog">
            <h3>Conferma Eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare la prenotazione di{' '}
              <strong>{prenotazioneDaEliminare?.clienti?.nome}</strong> per{' '}
              <strong>{prenotazioneDaEliminare?.servizi?.nome}</strong> del{' '}
              {prenotazioneDaEliminare?.data_prenotazione}?
            </p>
            <div className="conferma-azioni">
              <button 
                className="conferma-btn conferma-btn-danger"
                onClick={handleConfermaEliminazione}
              >
                Elimina
              </button>
              <button 
                className="conferma-btn conferma-btn-secondary"
                onClick={handleAnnullaEliminazione}
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
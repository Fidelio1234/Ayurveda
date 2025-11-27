/*import React, { useState } from 'react';
import './GiornoCalendario.css';

export function GiornoCalendario({ 
  data, 
  altroMese, 
  prenotazioni = [], 
  onAggiungiPrenotazione, 
  onModificaPrenotazione,
  onEliminaPrenotazione,
  oggi,
  domenica
}) {

  const [menuAperto, setMenuAperto] = useState(false);
  const [visualizzaTutte, setVisualizzaTutte] = useState(false);

  const haPrenotazioni = prenotazioni.length > 0;
  const numeroPrenotazioni = prenotazioni.length;

  // Nomi dei giorni in italiano
  const nomiGiorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const nomeGiorno = nomiGiorni[data.getDay()];

  const formattaOra = (oraString) => {
    return oraString.substring(0, 5);
  };

  const getColorePriorita = (index) => {
    const colors = ['#4f46e5', '#7c3aed', '#a855f7', '#c084fc'];
    return colors[index % colors.length];
  };

  const handleEliminaTutte = () => {
    setMenuAperto(false);
    if (window.confirm(`Eliminare tutte le ${prenotazioni.length} prenotazioni di questo giorno?`)) {
      prenotazioni.forEach(onEliminaPrenotazione);
    }
  };

  const handleAggiungiPrenotazione = () => {
    // Crea una nuova data usando solo anno, mese, giorno - metodo più sicuro
    const dataCorretta = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    
    onAggiungiPrenotazione(dataCorretta);
    setMenuAperto(false);
  };

  // Click su una prenotazione: modifica
  const handleClickPrenotazione = (prenotazione, e) => {
    e.stopPropagation();
    onModificaPrenotazione(prenotazione);
  };

  // Click su "altre prenotazioni": mostra/nascondi tutte
  const handleClickAltrePrenotazioni = (e) => {
    e.stopPropagation();
    setVisualizzaTutte(!visualizzaTutte);
  };

  const isOggi = new Date().toDateString() === data.toDateString();

  // Determina quante prenotazioni mostrare
  const prenotazioniDaMostrare = visualizzaTutte ? prenotazioni : prenotazioni.slice(0, 3);

  return (
    <div 
      className={`
        giorno-calendario 
        ${altroMese ? 'giorno-altro-mese' : ''} 
        ${isOggi ? 'giorno-oggi' : ''}
        ${haPrenotazioni ? 'giorno-prenotato' : ''}
        ${domenica ? 'giorno-domenica' : ''}
      `}
      onClick={() => !altroMese && handleAggiungiPrenotazione()}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuAperto(true);
      }}
    >
      <div className="giorno-header">
        <div className="giorno-info">
          <span className="giorno-numero">{data.getDate()}</span>
          <span className="giorno-nome">{nomeGiorno}</span>
        </div>
        
        <div className="giorno-controls">
          {haPrenotazioni && (
            <span className="giorno-badge">{numeroPrenotazioni}</span>
          )}
          
          {!altroMese && (
            <button 
              className="btn-aggiungi-piccolo"
              onClick={(e) => {
                e.stopPropagation();
                handleAggiungiPrenotazione();
              }}
              title="Aggiungi prenotazione"
            >
              + Prenotazione
            </button>
          )}
        </div>
      </div>

      {!altroMese && (
        <div className="giorno-prenotazioni">
          {prenotazioniDaMostrare.map((prenotazione, index) => (
            <div 
              key={prenotazione.id}
              className="prenotazione-item"
              style={{ 
                borderLeftColor: getColorePriorita(index),
                backgroundColor: `${getColorePriorita(index)}15`
              }}
              onClick={(e) => handleClickPrenotazione(prenotazione, e)}
              title={`Clicca per modificare: ${prenotazione.clienti?.nome} - ${prenotazione.servizi?.nome}`}
            >
              <div className="prenotazione-ora">
                {formattaOra(prenotazione.ora_inizio)} - {formattaOra(prenotazione.ora_fine)}
              </div>
              <div className="prenotazione-cliente">
                {prenotazione.clienti?.nome}
              </div>
              <div className="prenotazione-servizio">
                {prenotazione.servizi?.nome}
              </div>
            </div>
          ))}
          
          {prenotazioni.length > 3 && (
            <button 
              className="btn-altre-prenotazioni"
              onClick={handleClickAltrePrenotazioni}
              title={visualizzaTutte ? "Nascondi prenotazioni" : "Visualizza tutte le prenotazioni"}
            >
              {visualizzaTutte ? '▲ Nascondi' : `▼ +${prenotazioni.length - 3} altre prenotazioni`}
            </button>
          )}
        </div>
      )}

      {menuAperto && (
        <div 
          className="giorno-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="menu-item"
            onClick={handleAggiungiPrenotazione}
          >
            ➕ Nuova Prenotazione
          </button>
          {haPrenotazioni && (
            <button 
              className="menu-item menu-item-danger"
              onClick={handleEliminaTutte}
            >
              🗑️ Elimina Tutte
            </button>
          )}
          <button 
            className="menu-item"
            onClick={() => setMenuAperto(false)}
          >
            ❌ Annulla
          </button>
        </div>
      )}

      {menuAperto && (
        <div 
          className="menu-overlay"
          onClick={() => setMenuAperto(false)}
        />
      )}
    </div>
  );
}


*/


import React, { useState } from 'react';
import './GiornoCalendario.css';

export function GiornoCalendario({ 
  data, 
  altroMese, 
  prenotazioni = [], 
  onAggiungiPrenotazione, 
  onModificaPrenotazione,
  onEliminaPrenotazione,
  onEvadiPrenotazione,
  oggi,
  domenica
}) {

  const [menuAperto, setMenuAperto] = useState(false);
  const [visualizzaTutte, setVisualizzaTutte] = useState(false);

  const haPrenotazioni = prenotazioni.length > 0;
  const numeroPrenotazioni = prenotazioni.length;
  const prenotazioniNonEvase = prenotazioni.filter(p => !p.evasa);
  const prenotazioniEvase = prenotazioni.filter(p => p.evasa);

  // Nomi dei giorni in italiano
  const nomiGiorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const nomeGiorno = nomiGiorni[data.getDay()];

  const formattaOra = (oraString) => {
    return oraString.substring(0, 5);
  };

  const getColorePriorita = (index, evasa = false) => {
    if (evasa) return '#10b981'; // Verde per prenotazioni evase
    
    const colors = ['#4f46e5', '#7c3aed', '#a855f7', '#c084fc'];
    return colors[index % colors.length];
  };

  const handleEliminaTutte = () => {
    setMenuAperto(false);
    if (window.confirm(`Eliminare tutte le ${prenotazioni.length} prenotazioni di questo giorno?`)) {
      prenotazioni.forEach(onEliminaPrenotazione);
    }
  };

  const handleAggiungiPrenotazione = () => {
    // Crea una nuova data usando solo anno, mese, giorno - metodo più sicuro
    const dataCorretta = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    
    onAggiungiPrenotazione(dataCorretta);
    setMenuAperto(false);
  };

  const handleEvadiPrenotazione = (prenotazione, e) => {
    e.stopPropagation();
    if (!prenotazione.evasa) {
      onEvadiPrenotazione(prenotazione);
    }
  };

  // Click su una prenotazione: modifica
  const handleClickPrenotazione = (prenotazione, e) => {
    e.stopPropagation();
    onModificaPrenotazione(prenotazione);
  };

  // Click su "altre prenotazioni": mostra/nascondi tutte
  const handleClickAltrePrenotazioni = (e) => {
    e.stopPropagation();
    setVisualizzaTutte(!visualizzaTutte);
  };

  const isOggi = new Date().toDateString() === data.toDateString();

  // Determina quante prenotazioni mostrare
  const prenotazioniDaMostrare = visualizzaTutte ? prenotazioni : prenotazioni.slice(0, 3);

  return (
    <div 
      className={`
        giorno-calendario 
        ${altroMese ? 'giorno-altro-mese' : ''} 
        ${isOggi ? 'giorno-oggi' : ''}
        ${haPrenotazioni ? 'giorno-prenotato' : ''}
        ${domenica ? 'giorno-domenica' : ''}
      `}
      onClick={() => !altroMese && handleAggiungiPrenotazione()}
      onContextMenu={(e) => {
        e.preventDefault();
        setMenuAperto(true);
      }}
    >
      <div className="giorno-header">
        <div className="giorno-info">
          <span className="giorno-numero">{data.getDate()}</span>
          <span className="giorno-nome">{nomeGiorno}</span>
        </div>
        
        <div className="giorno-controls">
          {haPrenotazioni && (
            <span className={`giorno-badge ${prenotazioniEvase.length === prenotazioni.length ? 'badge-tutte-evase' : ''}`}>
              {prenotazioniNonEvase.length}/{numeroPrenotazioni}
            </span>
          )}
          
          {!altroMese && (
            <button 
              className="btn-aggiungi-piccolo"
              onClick={(e) => {
                e.stopPropagation();
                handleAggiungiPrenotazione();
              }}
              title="Aggiungi prenotazione"
            >
              + Prenotazione
            </button>
          )}
        </div>
      </div>

      {!altroMese && (
        <div className="giorno-prenotazioni">
          {prenotazioniDaMostrare.map((prenotazione, index) => (
            <div 
              key={prenotazione.id}
              className={`prenotazione-item ${prenotazione.evasa ? 'prenotazione-evasa' : ''}`}
              style={{ 
                borderLeftColor: getColorePriorita(index, prenotazione.evasa),
                backgroundColor: prenotazione.evasa ? '#f0fdf4' : `${getColorePriorita(index)}15`
              }}
              onClick={(e) => handleClickPrenotazione(prenotazione, e)}
              title={`Clicca per modificare: ${prenotazione.clienti?.nome} - ${prenotazione.servizi?.nome} ${prenotazione.evasa ? '(CHIUSA)' : ''}`}
            >
              <div className="prenotazione-header">
                <div className="prenotazione-ora" style={{ color: prenotazione.evasa ? '#059669' : '#475569' }}>
                  {formattaOra(prenotazione.ora_inizio)} - {formattaOra(prenotazione.ora_fine)}
                </div>
                {!prenotazione.evasa && (
                  <button 
                    className="btn-evadi"
                    onClick={(e) => handleEvadiPrenotazione(prenotazione, e)}
                    title="Segna come chiusa"
                  >
                    ✓
                  </button>
                )}
                {prenotazione.evasa && (
                  <div className="chiusa-indicator" title="Prenotazione chiusa">
                    ✅
                  </div>
                )}
              </div>
              <div className="prenotazione-cliente" style={{ color: prenotazione.evasa ? '#065f46' : '#1e293b' }}>
                {prenotazione.clienti?.nome}
              </div>
              <div className="prenotazione-servizio" style={{ color: prenotazione.evasa ? '#047857' : '#64748b' }}>
                {prenotazione.servizi?.nome}
                {prenotazione.evasa && <span className="chiusa-badge">CHIUSA</span>}
              </div>
            </div>
          ))}
          
          {/* Mostra il pulsante "altre prenotazioni" solo quando non stiamo visualizzando tutto */}
          {!visualizzaTutte && prenotazioni.length > 3 && (
            <button 
              className="btn-altre-prenotazioni"
              onClick={handleClickAltrePrenotazioni}
            >
              {`▼ +${prenotazioni.length - 3} altre prenotazioni`}
            </button>
          )}
        </div>
      )}

      {menuAperto && (
        <div 
          className="giorno-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="menu-item"
            onClick={handleAggiungiPrenotazione}
          >
            ➕ Nuova Prenotazione
          </button>
          {haPrenotazioni && (
            <button 
              className="menu-item menu-item-danger"
              onClick={handleEliminaTutte}
            >
              🗑️ Elimina Tutte
            </button>
          )}
          <button 
            className="menu-item"
            onClick={() => setMenuAperto(false)}
          >
            ❌ Annulla
          </button>
        </div>
      )}

      {menuAperto && (
        <div 
          className="menu-overlay"
          onClick={() => setMenuAperto(false)}
        />
      )}
    </div>
  );
}


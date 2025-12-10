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








import React from 'react';
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

  const handleAggiungiPrenotazione = () => {
    // Crea una nuova data usando solo anno, mese, giorno - metodo più sicuro
    const dataCorretta = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    
    onAggiungiPrenotazione(dataCorretta);
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

  const isOggi = new Date().toDateString() === data.toDateString();

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
              ➕ Prenota
            </button>
          )}
        </div>
      </div>

      {!altroMese && haPrenotazioni && (
        <div className="giorno-prenotazioni">
          {prenotazioni.map((prenotazione, index) => (
            <div 
              key={prenotazione.id}
              className={`prenotazione-item-compact ${prenotazione.evasa ? 'prenotazione-evasa' : ''}`}
              style={{ 
                borderLeftWidth: '3px',
                borderLeftStyle: 'solid',
                borderLeftColor: getColorePriorita(index, prenotazione.evasa),
                backgroundColor: prenotazione.evasa ? '#f0fdf4' : `${getColorePriorita(index)}15`,
                marginBottom: '2px',
                padding: '7px 22px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={(e) => handleClickPrenotazione(prenotazione, e)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title={`Clicca per modificare:\n${prenotazione.clienti?.nome} - ${prenotazione.servizi?.nome}\n${prenotazione.evasa ? 'CHIUSA' : ''}`}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div style={{ 
                  color: prenotazione.evasa ? '#3c514aff' : '#475569',
                  fontSize: '0.82em',
                  fontWeight: 'bold'
                }}>
                  {formattaOra(prenotazione.ora_inizio)} - {formattaOra(prenotazione.ora_fine)}
                </div>
                
                {!prenotazione.evasa && (
                  <button 
                    onClick={(e) => handleEvadiPrenotazione(prenotazione, e)}
                    title="Segna come chiusa"
                    style={{
                      background: 'none',
                      border: '1px solid #d1d5db',
                      color: '#c5d2c5ff',
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: '4px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#1ad999ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#8c96acff';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    ✓
                  </button>
                )}
                
                {prenotazione.evasa && (
                  <div 
                    style={{
                      fontSize: '0.7em',
                      backgroundColor: '#cc1cc6ff',
                      color: 'white',
                      padding: '4px 6px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      marginLeft: '4px'
                    }}
                    title="Prenotazione chiusa"
                  >
                    ✓
                  </div>
                  
                )}
              </div>
              
              <div style={{ 
                color: prenotazione.evasa ? '#100f10ff' : '#101011ff',
                fontSize: '0.97em',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '2px'
              }}>
                {prenotazione.clienti?.nome}
              </div>
              
              <div style={{ 
                color: prenotazione.evasa ? '#e6930eff' : '#64748b',
                fontSize: '0.9em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {prenotazione.servizi?.nome}
              </div>
              
              {prenotazione.evasa && (
                <div 
                  className="chiusa-badge-compact"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#b910b3ff',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '0.51em',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: '4px',
                    alignSelf: 'flex-start'
                  }}
                >
                  CHIUSA
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
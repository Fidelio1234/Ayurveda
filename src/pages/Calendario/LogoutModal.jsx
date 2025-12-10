/*import React, { useState, useEffect } from 'react';
import './LogoutModal.css';

export function LogoutModal({ isOpen, onClose, onLogout }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
      setError('');
      // Focus sul primo input quando si apre il modal
      setTimeout(() => {
        document.getElementById('code-input-0')?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }

    // Auto-submit quando tutti i campi sono pieni
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = numbers.split('');
      setCode(newCode);
      document.getElementById(`code-input-5`)?.focus();
    }
  };

  const handleSubmit = async (submittedCode = code.join('')) => {
    if (submittedCode.length !== 6) {
      setError('Il codice deve essere di 6 cifre');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth-codes.json');
      const authData = await response.json();
      
      if (submittedCode === authData.logoutCode) {
        onLogout();
      } else {
        setError('Codice errato');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-input-0')?.focus();
      }
    } catch (error) {
      setError('Errore di verifica del codice');
      console.error('Errore caricamento auth-codes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        <div className="logout-modal-header">
          <h3>Logout Sicuro</h3>
          <button className="logout-modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="logout-modal-content">
          <p>Inserisci il codice di 6 cifre per effettuare il logout</p>
          
          <div className="code-inputs-container">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={loading}
                className="code-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="logout-error">{error}</div>}

          <div className="logout-modal-actions">
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Annulla
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSubmit()}
              disabled={loading || code.some(digit => digit === '')}
            >
              {loading ? 'Verifica...' : 'Conferma Logout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


*/






import React, { useState, useEffect } from 'react';
import './LogoutModal.css';

export function LogoutModal({ isOpen, onLogout }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSubmitAttempted, setAutoSubmitAttempted] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
      setError('');
      setAutoSubmitAttempted(false);
      setSuccess(false);
      // Focus sul primo input quando si apre il modal
      setTimeout(() => {
        document.getElementById('code-input-0')?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value) || loading || success) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      setTimeout(() => {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }, 50);
    }

    // Auto-submit quando tutti i campi sono pieni
    if (newCode.every(digit => digit !== '') && index === 5) {
      // Aggiungi un piccolo ritardo per dare feedback visivo
      setTimeout(() => {
        handleAutoSubmit(newCode.join(''));
      }, 300);
    }
  };

  const handleAutoSubmit = async (submittedCode) => {
    if (autoSubmitAttempted || success) return;
    
    setAutoSubmitAttempted(true);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/auth-codes.json');
      const authData = await response.json();
      
      if (submittedCode === authData.logoutCode) {
        // Mostra successo per 1 secondo, poi logout
        setSuccess(true);
        setTimeout(() => {
          onLogout();
        }, 1000);
      } else {
        setError('Codice errato');
        setCode(['', '', '', '', '', '']);
        setAutoSubmitAttempted(false);
        setTimeout(() => {
          document.getElementById('code-input-0')?.focus();
        }, 100);
      }
    } catch (error) {
      setError('Errore di verifica del codice');
      console.error('Errore caricamento auth-codes:', error);
      setAutoSubmitAttempted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (success || loading) return;
    
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Se il campo corrente è vuoto, torna al precedente
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        setTimeout(() => {
          document.getElementById(`code-input-${index - 1}`)?.focus();
        }, 50);
      } else if (code[index]) {
        // Se il campo corrente ha un valore, cancellalo
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
    
    // Invio manuale con Enter
    if (e.key === 'Enter' && code.every(digit => digit !== '')) {
      e.preventDefault();
      handleAutoSubmit(code.join(''));
    }
  };

  const handlePaste = (e) => {
    if (success || loading) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length === 6) {
      const newCode = numbers.split('');
      setCode(newCode);
      // Auto-submit dopo incolla
      setTimeout(() => {
        document.getElementById(`code-input-5`)?.focus();
        handleAutoSubmit(numbers);
      }, 100);
    }
  };

  // Calcola quanti caratteri mancano
  const filledDigits = code.filter(digit => digit !== '').length;

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal">
        {/* Header senza X di chiusura */}
        <div className="logout-modal-header">
          <div className="header-icon">🔒</div>
          <h3>Logout Sicuro</h3>
        </div>
        
        <div className="logout-modal-content">
          {!success ? (
            <>
              <p className="logout-instruction">
                Inserisci il codice di 6 cifre per effettuare il login
              </p>
              
              <div className="code-inputs-container">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="password"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit ? '•' : ''}
                    onChange={(e) => {
                      // Prendi solo l'ultimo carattere se ne viene inserito più di uno
                      const value = e.target.value.slice(-1);
                      handleInputChange(index, value === '•' ? '' : value);
                    }}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={loading}
                    className={`code-input ${digit !== '' ? 'filled' : ''} ${loading ? 'disabled' : ''}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Indicatore visivo dei campi completati */}
              <div className="dots-indicator">
                {code.map((digit, index) => (
                  <div 
                    key={index}
                    className={`dot ${digit !== '' ? 'active' : ''} ${index === filledDigits ? 'next' : ''}`}
                  />
                ))}
              </div>

              {/* Progress indicator */}
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(filledDigits / 6) * 100}%` }}
                  />
                </div>
                <div className="progress-text">
                  {filledDigits === 6 && loading ? 'Verifica in corso...' : `${filledDigits}/6 cifre`}
                </div>
              </div>

              {error && <div className="logout-error">{error}</div>}

              {loading && (
                <div className="auto-logout-message">
                  <div className="spinner"></div>
                  <span>Verifica codice...</span>
                </div>
              )}

              {/* Hint per l'utente */}
              <div className="logout-hint">
                <p>
                  💡 <strong>Suggerimento:</strong> Contattare il rivenditore per modificare codice sicurezza
                </p>
              </div>
            </>
          ) : (
            <div className="logout-success">
              <div className="success-icon">✅</div>
              <h4>Codice Corretto!</h4>
              <p>Login in corso...</p>
              <div className="spinner success-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}













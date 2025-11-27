import React, { useState, useEffect } from 'react';
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
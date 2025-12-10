

//COLLEGATO A LOGOUTMODAL





/*import React, { useState } from 'react';

// Password per l'accesso - CAMBIA QUESTA CON LA TUA PASSWORD!
const SITE_PASSWORD = 'mani'; // ← MODIFICA QUESTA PASSWORD

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('❌ Password errata. Riprova.');
      setPassword('');
    }
  };

  // Se non autenticato, mostra SEMPRE form di login
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <div style={styles.icon}>🔐</div>
            <h2 style={styles.title}>Accesso Riservato</h2>
            <p style={styles.subtitle}>Ayurveda Booking System</p>
          </div>
          
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password di accesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la password"
                style={styles.input}
                autoFocus
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              style={styles.loginButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
              }}
            >
              Accedi al Sistema
            </button>
          </form>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Accesso consentito solo al proprietario
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se autenticato, mostra l'app
  return children;
}

// Stili
const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center'
  },
  header: {
    marginBottom: '30px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    boxSizing: 'border-box'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626'
  },
  errorIcon: {
    fontSize: '18px'
  },
  errorText: {
    fontSize: '14px',
    fontWeight: '500'
  },
  loginButton: {
    padding: '16px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0'
  }
};



*/










// SCOLLEGATO DA LOGOUTMODAL



import React, { useState } from 'react';

// Password per l'accesso - CAMBIA QUESTA CON LA TUA PASSWORD!
const SITE_PASSWORD = 'aa'; // ← MODIFICA QUESTA PASSWORD

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('❌ Password errata. Riprova.');
      setPassword('');
    }
  };

  // Se non autenticato, mostra form di login
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.header}>
            <div style={styles.icon}>🔐</div>
            <h2 style={styles.title}>Accesso Riservato</h2>
            <p style={styles.subtitle}>Ayurveda Booking System</p>
          </div>
          
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password di accesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la password"
                style={styles.input}
                autoFocus
              />
            </div>
            
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              style={styles.loginButton}
            >
              Accedi al Sistema
            </button>
          </form>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Accesso consentito solo al proprietario
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se autenticato, mostra l'app
  return children;
}

// Stili semplificati
const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loginCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center'
  },
  header: {
    marginBottom: '30px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s',
    boxSizing: 'border-box'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626'
  },
  errorIcon: {
    fontSize: '18px'
  },
  errorText: {
    fontSize: '14px',
    fontWeight: '500'
  },
  loginButton: {
    padding: '16px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0'
  }
};
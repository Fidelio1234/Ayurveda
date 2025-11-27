import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }) {
  const location = useLocation();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
  <nav style={{ 
    backgroundColor: 'white', 
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  }}>
    <h1 style={{ margin: 0, color: '#333' }}>Gestione Clienti</h1>
    <div style={{ marginTop: '1rem' }}>
      
      {/* Link Calendario */}
      <Link 
        to="/calendario" 
        style={{ 
          marginRight: '1rem', 
          textDecoration: 'none',
          color: location.pathname === '/calendario' ? '#007bff' : '#333'
        }}
      >
        <span style={{padding: '0 10px'}}>📅 Calendario</span>
      </Link>

      {/* Link Clienti */}
      <Link 
        to="/clienti" 
        style={{ 
          marginRight: '1rem', 
          textDecoration: 'none',
          color: location.pathname === '/clienti' ? '#007bff' : '#333'
        }}
      >
        <span style={{padding: '0 10px'}}>👥 Clienti</span>
      </Link>

      {/* Link Servizi */}
      <Link 
        to="/servizi" 
        style={{ 
          marginRight: '1rem', 
          textDecoration: 'none',
          color: location.pathname === '/servizi' ? '#007bff' : '#333'
        }}
      >
        <span style={{padding: '0 10px'}}>🛠️ Servizi</span>
      </Link>

      {/*
      <Link 
        to="/pagamenti" 
        style={{ 
          textDecoration: 'none',
          color: location.pathname === '/nuovo-cliente' ? '#007bff' : '#333'
        }}
      >
        💳 Pagamenti
      </Link>
      */}

    </div>
  </nav>
  
      <main style={{ padding: '0 2rem' }}>
        {children}
      </main>
    </div>
  );
}
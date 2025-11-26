import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Dashboard</h2>
      <p>Benvenuto nel sistema di gestione clienti.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Link to="/clienti" style={{ textDecoration: 'none' }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            minWidth: '200px',
            border: '2px solid #2196f3'
          }}>
            <h3>👥 Clienti</h3>
            <p>Gestisci l'elenco clienti</p>
          </div>
        </Link>
        
        <Link to="/nuovo-cliente" style={{ textDecoration: 'none' }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '8px',
            minWidth: '200px',
            border: '2px solid #4caf50'
          }}>
            <h3>➕ Nuovo Cliente</h3>
            <p>Aggiungi un nuovo cliente</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
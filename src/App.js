/*import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clienti } from './pages/Clienti';
import { NuovoCliente } from './pages/NuovoCliente';
import { Pagamenti } from './pages/Pagamenti';  // ← Aggiungi questa import
import stripePromise from './stripe/config';    // ← Aggiungi questa import
import { Servizi } from './pages/Servizi/Servizi';
import { Calendario } from './pages/Calendario/Calendario';



function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clienti" element={<Clienti />} />
            <Route path="/nuovo-cliente" element={<NuovoCliente />} />
            <Route path="/pagamenti" element={<Pagamenti />} /> 
            <Route path="/servizi" element={<Servizi />} />
            
            <Route path="/calendario" element={<Calendario />} />
          </Routes>
        </Layout>
      </Router>
    </Elements>
  );
}

export default App;



*/





// App.js
import { Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Layout } from './components/Layout';

import { Clienti } from './pages/Clienti';

import { Pagamenti } from './pages/Pagamenti';
import stripePromise from './stripe/config';
import { Servizi } from './pages/Servizi/Servizi';
import { Calendario } from './pages/Calendario/Calendario';

function App() {
  return (
    <Elements stripe={stripePromise}>
      {/* Rimuovi BrowserRouter da qui */}
      <Layout>
        <Routes>
          
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/clienti" element={<Clienti />} />
         
          <Route path="/pagamenti" element={<Pagamenti />} />
          <Route path="/servizi" element={<Servizi />} />
        </Routes>
      </Layout>
    </Elements>
  );
}

export default App;
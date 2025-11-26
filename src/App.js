import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clienti } from './pages/Clienti';
import { NuovoCliente } from './pages/NuovoCliente';
import { Pagamenti } from './pages/Pagamenti';  // ← Aggiungi questa import
import stripePromise from './stripe/config';    // ← Aggiungi questa import


function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clienti" element={<Clienti />} />
            <Route path="/nuovo-cliente" element={<NuovoCliente />} />
            <Route path="/pagamenti" element={<Pagamenti />} />  {/* ← Aggiungi questa route */}
          </Routes>
        </Layout>
      </Router>
    </Elements>
  );
}

export default App;
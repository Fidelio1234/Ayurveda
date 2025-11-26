import { PaymentForm } from '../components/PaymentForm';

export function Pagamenti() {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1>💳 Pagamenti</h1>
      <p>Testa il sistema di pagamento integrato con Stripe</p>
      <PaymentForm />
    </div>
  );
}
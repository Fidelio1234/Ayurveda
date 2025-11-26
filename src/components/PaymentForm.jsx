import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { supabase } from '../supabase/client';

export function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Stile per il campo carta
  const cardOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#666666',
        },
      },
      invalid: {
        color: '#ff0000',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setMessage('Stripe non è pronto');
      return;
    }

    setLoading(true);
    setMessage('Processing pagamento...');

    try {
      console.log('🎯 Iniziando pagamento...');
      
      // 1. Crea il payment method con Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error('❌ Errore Stripe:', error);
        setMessage(`❌ Errore Stripe: ${error.message}`);
        return;
      }

      console.log('✅ PaymentMethod creato:', paymentMethod.id);

      // 2. Salva nel database Supabase
      console.log('💾 Salvando nel database...');
      
      const { data, error: dbError } = await supabase
        .from('pagamenti')
        .insert([
          {
            amount: 1000, // 10.00 EUR in centesimi
            currency: 'eur',
            status: 'completed', 
            stripe_payment_id: paymentMethod.id,
          }
        ])
        .select();

      if (dbError) {
        console.error('❌ Errore database:', dbError);
        setMessage(`❌ Errore salvataggio: ${dbError.message}`);
        return;
      }

      console.log('✅ Pagamento salvato nel database:', data);
      
      // 3. Successo!
      setMessage(`✅ Pagamento completato e salvato!\nID: ${paymentMethod.id}\nImporto: €10.00`);
      
      // Reset dopo 5 secondi
      setTimeout(() => {
        elements.getElement(CardElement).clear();
        setMessage('');
      }, 5000);

    } catch (error) {
      console.error('❌ Errore generale:', error);
      setMessage(`❌ Errore imprevisto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '3px solid #4F46E5',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: '#4F46E5', 
        marginBottom: '0.5rem',
        fontSize: '2rem'
      }}>
        💳 TEST PAGAMENTO STRIPE
      </h2>
      
      <p style={{ 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '2rem',
        fontSize: '1.2rem',
        fontWeight: '500'
      }}>
        Importo: <strong style={{ color: '#10B981' }}>€10.00</strong>
      </p>

      {/* STATO STRIPE - MOLTO VISIBILE */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: stripe ? '#D1FAE5' : '#FEF3C7',
        border: `2px solid ${stripe ? '#10B981' : '#F59E0B'}`,
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        {stripe ? '✅ STRIPE CARICATO - INSERISCI I DATI CARTA' : '🔄 CARICAMENTO STRIPE IN CORSO...'}
      </div>

      <form onSubmit={handleSubmit}>
        {/* CAMPO CARTA - MOLTO VISIBILE */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '700',
            color: '#374151',
            fontSize: '1.3rem'
          }}>
            🎫 INSERISCI I DATI DELLA CARTA:
          </label>
          
          <div style={{ 
            padding: '20px', 
            border: '3px solid #3B82F6', 
            borderRadius: '10px',
            backgroundColor: '#EFF6FF',
            minHeight: '80px',
            fontSize: '18px'
          }}>
            {stripe ? (
              <CardElement options={cardOptions} />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#6B7280',
                padding: '2rem',
                fontSize: '1.2rem'
              }}>
                ⏳ Caricamento campo carta Stripe...
              </div>
            )}
          </div>
        </div>

        {/* MESSAGGI */}
        {message && (
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: message.includes('❌') ? '#FEE2E2' : '#D1FAE5',
            border: `2px solid ${message.includes('❌') ? '#EF4444' : '#10B981'}`,
            borderRadius: '8px',
            marginBottom: '2rem',
            color: message.includes('❌') ? '#DC2626' : '#065F46',
            fontSize: '1.1rem',
            fontWeight: '500',
            textAlign: 'center',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </div>
        )}

        {/* BOTTONE */}
        <button 
          type="submit" 
          disabled={!stripe || loading}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: (!stripe || loading) ? '#9CA3AF' : '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.3rem',
            fontWeight: '700',
            cursor: (!stripe || loading) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          {!stripe ? '🔄 CARICAMENTO...' : 
           loading ? '⏳ PROCESSING...' : 
           '✅ PAGA €10.00'}
        </button>
      </form>

      {/* ISTRUZIONI TEST - MOLTO VISIBILE */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        backgroundColor: '#FFFBEB', 
        borderRadius: '12px',
        border: '3px solid #F59E0B',
        fontSize: '1.1rem'
      }}>
        <h3 style={{ 
          margin: '0 0 1.5rem 0', 
          color: '#D97706',
          textAlign: 'center',
          fontSize: '1.5rem'
        }}>
          🧪 CARTA DI TEST STRIPE
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gap: '1rem',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '2px solid #FBBF24'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '700'
            }}>1</span>
            <div>
              <strong>Numero Carta:</strong>{' '}
              <code style={{ 
                backgroundColor: '#1F2937', 
                color: 'white', 
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>4242 4242 4242 4242</code>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '700'
            }}>2</span>
            <div>
              <strong>Scadenza:</strong>{' '}
              <code style={{ 
                backgroundColor: '#1F2937', 
                color: 'white', 
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>12/34</code>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '700'
            }}>3</span>
            <div>
              <strong>CVC:</strong>{' '}
              <code style={{ 
                backgroundColor: '#1F2937', 
                color: 'white', 
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';

const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export function StripeCardInput({ onChange }) {
  return (
    <div style={{
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      transition: 'border-color 0.2s'
    }}>
      <CardElement 
        options={cardStyle}
        onChange={onChange}
      />
    </div>
  );
}
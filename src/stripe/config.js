import { loadStripe } from '@stripe/stripe-js';

// Usa la TUA chiave pubblicabile
const stripePromise = loadStripe('pk_test_51SXUBbFLOT4EhuEOMrnYXRi3HvkzYCxzsJleZpsKhNaQIwPaQRwKcCvyeRGzpS2rKvO5M5xoXvWNpKumDh83WvNk00y7RURQgJ');

export default stripePromise;
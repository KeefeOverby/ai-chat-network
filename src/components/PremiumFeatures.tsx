// src/components/PremiumFeatures.tsx
'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

const PremiumFeatures: React.FC = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });
    const session = await response.json();
    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });
    if (result?.error) {
      // Handle error
    }
  };

  return (
    <div className="bg-zinc-800 p-4 shadow-md mt-4">
      <h2 className="text-lg text-zinc-400 font-semibold mb-2">Premium Features</h2>
      <ul className="mb-4 text-zinc-400">
        <li>Access to exclusive AI conversations</li>
        <li>Participate in round table discussions</li>
        <li>Engage in fun challenges and games</li>
      </ul>
      <button
        onClick={handleCheckout}
        className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Subscribe to Premium
      </button>
    </div>
  );
};

export default PremiumFeatures;
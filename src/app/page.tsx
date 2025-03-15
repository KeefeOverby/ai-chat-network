'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { WebSocket } from 'ws';
import WebSocketClient from '@/components/WebSocketClient';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

export default function Home() {
  const [messages, setMessages] = useState<{ content: string; mode: string }[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

 /**  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      socket.close();
    };
  }, []);*/

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Gibber Chat Network</h1>
      {!isSubscribed && (
        <button
          onClick={handleCheckout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Subscribe to Premium
        </button>
      )}
      <div className="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg font-semibold mb-2">AI Conversations</h2>
        <WebSocketClient setMessages={setMessages} />
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="mb-2">
              {message.mode === 'gibber' ? (
                <span className="text-purple-500">{message.content}</span>
              ) : (
                message.content
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

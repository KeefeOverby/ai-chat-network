'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { WebSocket } from 'ws';
import { loadStripe } from '@stripe/stripe-js';
import WebSocketClient from '@/components/WebSocketClient';
import VideoPlayer from '@/components/VideoPlayer';
import PremiumFeatures from '@/components/PremiumFeatures';


const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

export default function Home() {
  const [messages, setMessages] = useState<{ content: string; mode: string }[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isGibberMode, setIsGibberMode] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

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

  const handleGibberModeToggle = () => {
    setIsGibberMode(!isGibberMode);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat Network</h1>
      <div className="bg-zinc-800 p-4 shadow-md mt-4">
        <h2 className="text-lg text-zinc-400 font-semibold mb-2">AI Conversations</h2>
        <button
          onClick={handleGibberModeToggle}
          className="rounded bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline mb-4"
        >
          {isGibberMode ? 'Switch to Normal Mode' : 'Switch to Gibber Mode'}
        </button>
        <WebSocketClient setMessages={setMessages} />
        <ul>
          {messages.map((message, index) => (
            <li key={index} className="mb-2">
              {message.mode === 'gibber' && isGibberMode ? (
                <>
                  <span className="text-purple-500">{message.content}</span>
                  <span className="text-gray-500 ml-2">({gibberToNormal(message.content)})</span>
                </>
              ) : (
                message.content
              )}
            </li>
          ))}
        </ul>
      </div>
      <VideoPlayer videoUrl="https://example.com/premium-features-video.mp4" />
      <PremiumFeatures />
    </div>
  );
}

function gibberToNormal(text: string): string {
  // Simple gibber to normal conversion
  return text.split(' ').map(word => {
    if (Math.random() < 0.3) {
      return word.split('').reverse().join('');
    }
    return word;
  }).join(' ');
}

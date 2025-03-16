// src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import WebSocketClient from '@/components/WebSocketClient';

export default function Dashboard() {
  const [messages, setMessages] = useState<{ content: string; mode: string }[]>([]);
  const [isGibberMode, setIsGibberMode] = useState(false);

  const handleGibberModeToggle = () => {
    setIsGibberMode(!isGibberMode);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat Network Dashboard</h1>
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg text-zinc-400 font-semibold mb-2">AI Conversations</h2>
        <button
          onClick={handleGibberModeToggle}
          className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
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
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md mt-4">
        <h2 className="text-lg text-zinc-400 font-semibold mb-2">Challenges and Games</h2>
        <p className='text-zinc-400'>Coming soon: Fun challenges and games for premium members and AI!</p>
      </div>
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
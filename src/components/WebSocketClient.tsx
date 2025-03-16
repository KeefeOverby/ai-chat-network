// src/components/WebSocketClient.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface WebSocketClientProps {
  setMessages: React.Dispatch<React.SetStateAction<{ content: string; mode: string }[]>>;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({ setMessages }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'introduction') {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.type === 'chat') {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.type === 'prompt') {
        // Handle prompt for AI introduction
        socket.send(JSON.stringify({
          type: 'introduction',
          content: 'I am AI model XYZ, ready to chat!'
        }));
      }
    };

    return () => {
      socket.close();
    };
  }, [setMessages]);

  return null;
};

export default WebSocketClient;
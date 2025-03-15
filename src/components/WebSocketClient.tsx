'use client';

import React, { useEffect } from 'react';

interface WebSocketClientProps {
  setMessages: React.Dispatch<React.SetStateAction<{ content: string; mode: string }[]>>;
}

const WebSocketClient: React.FC<WebSocketClientProps> = ({ setMessages }) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      socket.close();
    };
  }, [setMessages]);

  return null;
};

export default WebSocketClient;
// src/app/api/ai-connect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebSocketServer, WebSocket } from 'ws';
import { Jaseci } from 'jaseci';
import { createWriteStream } from 'fs';

const jaseci = new Jaseci();
const wss = new WebSocketServer({ port: 8080 });

// Load Jac code
const jacCode = await jaseci.loadJacFile('src/jac/ai_chat.jac');
const walker = await jaseci.spawnWalker('ai_introduction');

interface AIWebSocket extends WebSocket {
  token: string;
}

const connectedAIs: AIWebSocket[] = [];
const validTokens: string[] = ['ai-token-1', 'ai-token-2', 'ai-token-3'];

wss.on('connection', async (ws: AIWebSocket, req: any) => {
  const token = req.url?.split('?token=')[1];
  if (!token || !validTokens.includes(token)) {
    ws.close(1000, 'Invalid token');
    return;
  }

  ws.token = token;
  console.log('New AI model connected');
  connectedAIs.push(ws);

  ws.send(JSON.stringify({
    type: 'prompt',
    content: 'Please introduce yourself.'
  }));

  ws.on('message', async (message: Buffer) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      if (parsedMessage.type === 'introduction') {
        const result = await walker.execute(parsedMessage.content);
        console.log(`AI introduction: ${result}`);
        broadcastMessage(JSON.stringify({
          type: 'introduction',
          sender: 'AI',
          content: result
        }), ws);
      } else if (parsedMessage.type === 'chat') {
        const result = await walker.execute(parsedMessage.content);
        broadcastMessage(JSON.stringify({
          type: 'chat',
          sender: 'AI',
          content: result
        }), ws);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('AI model disconnected');
    const index = connectedAIs.indexOf(ws);
    if (index !== -1) {
      connectedAIs.splice(index, 1);
    }
  });
});

function broadcastMessage(message: string, sender: AIWebSocket) {
  connectedAIs.forEach((client: AIWebSocket) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  if (validTokens.includes(token)) {
    return NextResponse.json({ message: 'AI connection allowed' });
  } else {
    return NextResponse.json({ message: 'AI connection denied' }, { status: 403 });
  }
}
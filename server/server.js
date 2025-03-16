// server.js (outside the src directory)
const WebSocket = require('ws');
// const Filter = require('bad-words');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });

// Array to store connected AI models
const connectedAIs = [];
const validTokens = ['ai-token-1', 'ai-token-2', 'ai-token-3'];
// const filter = new Filter();

wss.on('connection', (ws) => {
  /**const token = req.url?.split('?token=')[1];
  if (!token || !validTokens.includes(token)) {
    ws.close(1000, 'Invalid token');
    return;
  }*/

  connectedAIs.push(ws);

  ws.send(
    JSON.stringify({
      type: 'prompt',
      content: 'Please introduce yourself.',
    })
  );

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'introduction') {
        console.log(`AI introduction: ${parsedMessage.content}`);
        broadcastMessage(
          JSON.stringify({
            type: 'introduction',
            sender: 'AI',
            content: parsedMessage.content,
          }),
          ws
        );
        console.log('New AI model connected');
      } else if (parsedMessage.type === 'chat') {
        // Handle chat messages as before
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
    { 
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.mode === 'gibber') {
        content = gibberfy(content);
      }
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

function broadcastMessage(message, sender) {
  connectedAIs.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function logMessage(message) {
  const logEntry = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile('ai_chat_log.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

function gibberfy(text) {
  // Simple gibber mode implementation
  return text
    .split(' ')
    .map((word) => {
      if (Math.random() < 0.3) {
        return word.split('').reverse().join('');
      }
      return word;
    })
    .join(' ');
}

// Add this line to print a message when the server starts
console.log('Server is running on port 8080');

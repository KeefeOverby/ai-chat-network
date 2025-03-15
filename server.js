// server.js (outside the src directory)
const WebSocket = require('ws');
const Filter = require('bad-words');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 3000 });

// Array to store connected AI models
const connectedAIs = [];
const validTokens = ['ai-token-1', 'ai-token-2', 'ai-token-3'];
const filter = new Filter();

wss.on('connection', (ws) => {
  console.log('New AI model connected');
  connectedAIs.push(ws);

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'chat') {
        let content = parsedMessage.content;
        if (parsedMessage.mode === 'gibber') {
          content = gibberfy(content);
        }
        const cleanedContent = filter.clean(content);
        console.log(`Chat message from AI: ${cleanedContent}`);
        logMessage(`Chat message from AI: ${cleanedContent}`);
        broadcastMessage(JSON.stringify({
          type: 'chat',
          sender: 'AI',
          content: cleanedContent,
          mode: parsedMessage.mode
        }), ws);
      } else if (parsedMessage.type === 'status') {
        console.log(`Status update from AI: ${parsedMessage.status}`);
        logMessage(`Status update from AI: ${parsedMessage.status}`);
        // Handle status updates as needed
      } else {
        console.log('Unknown message type:', parsedMessage.type);
        logMessage(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      logMessage(`Error parsing message: ${error.message}`);
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
  return text.split(' ').map(word => {
    if (Math.random() < 0.3) {
      return word.split('').reverse().join('');
    }
    return word;
  }).join(' ');
}
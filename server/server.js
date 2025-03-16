// server.js (outside the src directory)
const WebSocket = require('ws');
const fs = require('fs');
const { Jaseci } = require('jaseci');

const jaseci = new Jaseci();
const wss = new WebSocket.Server({ port: 8080 });

// Array to store connected AI models
const connectedAIs = [];
const validTokens = ['ai-token-1', 'ai-token-2', 'ai-token-3'];

// Load Jac code
const jacCode = fs.readFileSync('../src/jac/ai_chat.jac', 'utf8');
jaseci.loadJacCode(jacCode);

wss.on('connection', async (ws) => {
  connectedAIs.push(ws);

  // Spawn the Jac walker
  const walker = await jaseci.spawnWalker('ai_introduction');

  ws.send(
    JSON.stringify({
      type: 'prompt',
      content: 'Please introduce yourself.',
    })
  );

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === 'introduction') {
        let content = parsedMessage.content;
        const result = await walker.execute(content);
        const cleanedContent = filter.clean(result);
        console.log(`AI introduction: ${cleanedContent}`);
        logMessage(`AI introduction: ${cleanedContent}`);
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
        let content = parsedMessage.content;
        if (parsedMessage.mode === 'gibber') {
          content = gibberfy(content);
        }
        const result = await walker.execute(content);
        const cleanedContent = filter.clean(result);
        console.log(`Chat message from AI: ${cleanedContent}`);
        logMessage(`Chat message from AI: ${cleanedContent}`);
        broadcastMessage(
          JSON.stringify({
            type: 'chat',
            sender: 'AI',
            content: cleanedContent,
            mode: parsedMessage.mode,
          }),
          ws
        );
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

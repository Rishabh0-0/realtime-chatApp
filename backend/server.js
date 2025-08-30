const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();

server.on('connection', (ws) => {
  const clientId = generateId();

  clients.set(ws, {
    id: clientId,
    username: null,
    joinedAt: new Date().toISOString(),
  });

  console.log(`New Clinet connected: ${clientId}`);
  broadcast({ type: 'userCount', count: clients.size });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const client = clients.get(ws);

      switch (message.type) {
        case 'setUsername':
          client.username = message.username;
          broadcast({
            type: 'userJoined',
            username: client.username,
            timestamp: new Date().toISOString(),
          });
          break;
        case 'chat':
          if (username) {
            broadcast({
              type: 'chat',
              username: client.username,
              message: message.message,
              timestamp: new Date().toISOString(),
            });
            break;
          }
        case 'typing':
          broadcastToOthers(
            {
              type: 'typing',
              username: client.username,
              isTyping: message.isTyping,
            },
            ws
          );
          break;
      }
    } catch (error) {
      console.error('Error parsing message', error);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (username) {
      broadcast({
        type: 'userLeft',
        username: client.username,
        timestamp: new Date().toISOString(),
      });
    }
    clients.delete(ws);
    broadcast({
      type: 'userCount',
      count: clients.size,
    });

    console.log(`Client disconnected: ${client.id}`);
  });
});

const broadcast = (message) => {
  const data = JSON.stringify(message);
  clients.forEach((client, ws) => {
    if (ws.readState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

const broadcastToOthers = (message, sender) => {
  const data = JSON.stringify(message);
  clients.forEach((client, ws) => {
    if (ws != sender && ws.readState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

const generateId = () => Math.random().toString(36).substring(2, 9);

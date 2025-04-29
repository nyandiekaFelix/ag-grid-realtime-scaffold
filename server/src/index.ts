import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import { MetricsGenerator } from './metricsGenerator';
import { WebSocketMessage } from './types';

const PORT = 8081;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Metrics Server is running');
});

const wss = new WebSocketServer({ server });
const metricsGenerator = new MetricsGenerator();

// Broadcast function
const broadcast = (data: WebSocketMessage) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial snapshot
  const initialData: WebSocketMessage = {
    type: 'INIT',
    data: metricsGenerator.getAllMetrics(),
  };
  ws.send(JSON.stringify(initialData));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Simulate metric updates every 500ms
setInterval(() => {
  const changes = metricsGenerator.updateMetrics();
  if (changes.length > 0) {
    const updateMessage: WebSocketMessage = {
      type: 'UPDATE',
      data: changes,
    };
    broadcast(updateMessage);
  }
}, 500);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

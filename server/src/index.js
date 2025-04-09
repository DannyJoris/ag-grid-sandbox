const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { generateStockData, updateStockData } = require('./services/dataService');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Store the current stock data
let currentStockData = generateStockData();

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initial data endpoint
app.get('/api/stocks', (req, res) => {
  res.json(currentStockData);
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial data
  ws.send(JSON.stringify({ type: 'initial', data: currentStockData }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Update data every 2 seconds
setInterval(() => {
  currentStockData = updateStockData(currentStockData);
  
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', data: currentStockData }));
    }
  });
}, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
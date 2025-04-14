import express, { Application } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import { generateStockData, updateStockData } from './services/dataService';
import authRoutes from './routes/auth';

const app: Application = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store the current stock data
let currentStockData = generateStockData();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

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
  ws.send(JSON.stringify({
    type: 'initial',
    data: currentStockData
  }));

  // Set up interval for updates
  const interval = setInterval(() => {
    currentStockData = updateStockData(currentStockData);
    ws.send(JSON.stringify({
      type: 'update',
      data: currentStockData
    }));
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

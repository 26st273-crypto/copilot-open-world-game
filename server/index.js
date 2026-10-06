import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorldManager } from './world.js';
import { PlayerManager } from './playerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Game Managers
const worldManager = new WorldManager(1200, 800, 32);
const playerManager = new PlayerManager();

let gameState = {
  players: {},
  world: worldManager.getWorldData(),
  timestamp: Date.now()
};

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create player
  const playerId = socket.id;
  const player = playerManager.createPlayer(playerId, {
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 100,
    username: `Player_${playerId.slice(0, 5)}`
  });
  
  gameState.players[playerId] = player;
  
  // Send initial game state to new player
  socket.emit('gameState', gameState);
  
  // Broadcast new player to others
  socket.broadcast.emit('playerJoined', { playerId, player });
  
  // Player movement
  socket.on('playerMove', (data) => {
    if (gameState.players[playerId]) {
      gameState.players[playerId].x = data.x;
      gameState.players[playerId].y = data.y;
      gameState.players[playerId].direction = data.direction;
      
      // Broadcast to all players
      io.emit('playerMoved', { playerId, x: data.x, y: data.y, direction: data.direction });
    }
  });
  
  // Block placement
  socket.on('placeBlock', (data) => {
    const { x, y, blockType } = data;
    worldManager.setBlock(x, y, blockType);
    gameState.world = worldManager.getWorldData();
    
    // Broadcast to all players
    io.emit('blockPlaced', { x, y, blockType, timestamp: Date.now() });
  });
  
  // Block removal
  socket.on('removeBlock', (data) => {
    const { x, y } = data;
    worldManager.setBlock(x, y, 0); // 0 = empty
    gameState.world = worldManager.getWorldData();
    
    // Broadcast to all players
    io.emit('blockRemoved', { x, y, timestamp: Date.now() });
  });
  
  // Player disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${playerId}`);
    delete gameState.players[playerId];
    io.emit('playerLeft', { playerId });
  });
});

// REST API
app.get('/api/gamestate', (req, res) => {
  res.json(gameState);
});

app.get('/api/world', (req, res) => {
  res.json(worldManager.getWorldData());
});

app.get('/api/players', (req, res) => {
  res.json(gameState.players);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🎮 Copilot Open World Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
});

import { io } from 'socket.io-client';
import { GameEngine } from './gameEngine.js';
import { InputManager } from './inputManager.js';
import { Renderer } from './renderer.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.socket = null;
    
    this.gameEngine = null;
    this.inputManager = null;
    this.renderer = null;
    
    this.playerId = null;
    this.gameState = null;
    
    this.init();
  }
  
  async init() {
    // Setup canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Connect to server
    await this.connectToServer();
    
    // Initialize managers
    this.gameEngine = new GameEngine(this.gameState);
    this.inputManager = new InputManager(this.socket, this.gameEngine);
    this.renderer = new Renderer(this.ctx, this.gameState);
    
    // Hide loading screen
    document.getElementById('loading').classList.remove('show');
    
    // Start game loop
    this.gameLoop();
  }
  
  connectToServer() {
    return new Promise((resolve) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      this.socket = io(`${protocol}//${host}`);
      
      this.socket.on('gameState', (state) => {
        this.gameState = state;
        this.playerId = this.socket.id;
        console.log('📡 Game state received', this.gameState);
        resolve();
      });
      
      this.socket.on('playerMoved', (data) => {
        if (this.gameState.players[data.playerId]) {
          this.gameState.players[data.playerId].x = data.x;
          this.gameState.players[data.playerId].y = data.y;
          this.gameState.players[data.playerId].direction = data.direction;
        }
      });
      
      this.socket.on('playerJoined', (data) => {
        this.gameState.players[data.playerId] = data.player;
        this.updatePlayerCount();
      });
      
      this.socket.on('playerLeft', (data) => {
        delete this.gameState.players[data.playerId];
        this.updatePlayerCount();
      });
      
      this.socket.on('blockPlaced', (data) => {
        this.gameState.world.blocks.push({ x: data.x, y: data.y, type: data.blockType });
      });
      
      this.socket.on('blockRemoved', (data) => {
        this.gameState.world.blocks = this.gameState.world.blocks.filter(
          b => !(b.x === data.x && b.y === data.y)
        );
      });
    });
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 80; // Account for header/footer
  }
  
  gameLoop = () => {
    // Update
    this.gameEngine.update();
    
    // Render
    this.renderer.render(this.gameState, this.playerId);
    
    // Update UI
    const player = this.gameState.players[this.playerId];
    if (player) {
      document.getElementById('position').textContent = 
        `${Math.floor(player.x)}, ${Math.floor(player.y)}`;
    }
    
    requestAnimationFrame(this.gameLoop);
  }
  
  updatePlayerCount() {
    const count = Object.keys(this.gameState.players).length;
    document.getElementById('player-count').textContent = count;
  }
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Game();
  });
} else {
  new Game();
}

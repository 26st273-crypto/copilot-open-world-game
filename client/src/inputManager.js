export class InputManager {
  constructor(socket, gameEngine) {
    this.socket = socket;
    this.gameEngine = gameEngine;
    
    this.keys = {};
    this.buildMode = true;
    this.selectedBlockType = 1; // Grass
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Mouse
    document.getElementById('gameCanvas').addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.getElementById('gameCanvas').addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }
  
  handleKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;
    
    if (e.key.toLowerCase() === 'b') {
      this.buildMode = !this.buildMode;
      document.getElementById('mode').textContent = this.buildMode ? 'Build' : 'Explore';
    }
    
    // Number keys for block selection
    if (e.key >= '1' && e.key <= '9') {
      this.selectedBlockType = parseInt(e.key);
    }
    
    // Send movement input
    this.handleMovement();
  }
  
  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }
  
  handleMovement() {
    const speed = 3;
    let moved = false;
    let newX = this.lastPlayerX || 100;
    let newY = this.lastPlayerY || 100;
    
    if (this.keys['w'] || this.keys['arrowup']) {
      newY -= speed;
      moved = true;
    }
    if (this.keys['s'] || this.keys['arrowdown']) {
      newY += speed;
      moved = true;
    }
    if (this.keys['a'] || this.keys['arrowleft']) {
      newX -= speed;
      moved = true;
    }
    if (this.keys['d'] || this.keys['arrowright']) {
      newX += speed;
      moved = true;
    }
    
    if (moved) {
      this.socket.emit('playerMove', { x: newX, y: newY, direction: 'down' });
      this.lastPlayerX = newX;
      this.lastPlayerY = newY;
    }
  }
  
  handleMouseDown(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const tileSize = this.gameEngine.getTileSize();
    const gridX = Math.floor(mouseX / tileSize);
    const gridY = Math.floor(mouseY / tileSize);
    
    if (e.button === 0) {
      // Left click - place block
      this.socket.emit('placeBlock', { x: gridX, y: gridY, blockType: this.selectedBlockType });
    } else if (e.button === 2) {
      // Right click - remove block
      e.preventDefault();
      this.socket.emit('removeBlock', { x: gridX, y: gridY });
    }
  }
  
  handleMouseMove(e) {
    // Can be used for showing hover effects
  }
}

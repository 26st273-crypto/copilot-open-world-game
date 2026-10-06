export class Renderer {
  constructor(ctx, gameState) {
    this.ctx = ctx;
    this.gameState = gameState;
    this.tileSize = gameState?.world?.tileSize || 32;
    
    this.blockColors = {
      0: '#87CEEB',  // Empty/Sky
      1: '#00AA00',  // Grass
      2: '#8B4513',  // Dirt
      3: '#4169E1',  // Water
      4: '#228B22'   // Tree
    };
    
    this.cameraX = 0;
    this.cameraY = 0;
  }
  
  render(gameState, playerId) {
    const canvas = this.ctx.canvas;
    const { width, height } = canvas;
    
    // Get player position for camera
    const player = gameState.players[playerId];
    if (player) {
      this.cameraX = player.x - width / 2 / this.tileSize;
      this.cameraY = player.y - height / 2 / this.tileSize;
    }
    
    // Clear canvas
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, width, height);
    
    // Draw world blocks
    this.drawWorld(gameState.world, width, height);
    
    // Draw players
    this.drawPlayers(gameState.players, playerId, width, height);
    
    // Draw grid
    this.drawGrid(width, height);
  }
  
  drawWorld(world, canvasWidth, canvasHeight) {
    if (!world || !world.blocks) return;
    
    for (const block of world.blocks) {
      const screenX = (block.x - this.cameraX) * this.tileSize;
      const screenY = (block.y - this.cameraY) * this.tileSize;
      
      // Only draw if on screen
      if (screenX + this.tileSize > 0 && screenX < canvasWidth &&
          screenY + this.tileSize > 0 && screenY < canvasHeight) {
        this.drawBlock(block.x, block.y, block.type);
      }
    }
  }
  
  drawBlock(x, y, type) {
    const screenX = (x - this.cameraX) * this.tileSize;
    const screenY = (y - this.cameraY) * this.tileSize;
    
    const color = this.blockColors[type] || '#CCCCCC';
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
    
    // Draw border
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
  }
  
  drawPlayers(players, playerId, canvasWidth, canvasHeight) {
    for (const [id, player] of Object.entries(players)) {
      const screenX = (player.x - this.cameraX) * this.tileSize;
      const screenY = (player.y - this.cameraY) * this.tileSize;
      
      if (screenX + this.tileSize > 0 && screenX < canvasWidth &&
          screenY + this.tileSize > 0 && screenY < canvasHeight) {
        
        // Draw player character (Copilot inspired)
        this.drawCharacter(screenX, screenY, player, id === playerId);
        
        // Draw name
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(player.username, screenX + this.tileSize / 2, screenY - 5);
      }
    }
  }
  
  drawCharacter(x, y, player, isLocal) {
    // Draw player as a colored square with a marker
    const size = this.tileSize - 4;
    const offsetX = 2;
    const offsetY = 2;
    
    this.ctx.fillStyle = player.color || '#FF0000';
    this.ctx.fillRect(x + offsetX, y + offsetY, size, size);
    
    if (isLocal) {
      // Highlight local player
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x + offsetX - 2, y + offsetY - 2, size + 4, size + 4);
    }
    
    // Draw eyes (Copilot style)
    this.ctx.fillStyle = '#000';
    const eyeSize = 2;
    this.ctx.fillRect(x + 6, y + 6, eyeSize, eyeSize);
    this.ctx.fillRect(x + this.tileSize - 8, y + 6, eyeSize, eyeSize);
  }
  
  drawGrid(canvasWidth, canvasHeight) {
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvasWidth; x += this.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, canvasHeight);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= canvasHeight; y += this.tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(canvasWidth, y);
      this.ctx.stroke();
    }
  }
}

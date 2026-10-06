export class GameEngine {
  constructor(gameState) {
    this.gameState = gameState;
    this.deltaTime = 0;
    this.lastFrameTime = Date.now();
  }
  
  update() {
    const now = Date.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;
    
    // Update game logic here
    // For now, just basic time tracking
  }
  
  getTileSize() {
    return this.gameState?.world?.tileSize || 32;
  }
}

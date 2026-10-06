export class WorldManager {
  constructor(width, height, tileSize) {
    this.width = Math.floor(width / tileSize);
    this.height = Math.floor(height / tileSize);
    this.tileSize = tileSize;
    
    // Initialize world with empty tiles and some default terrain
    this.world = new Map();
    this.generateDefaultWorld();
  }
  
  generateDefaultWorld() {
    // Create simple terrain: grass with some water and dirt
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const key = `${x},${y}`;
        
        // Perlin-like simple noise for terrain variety
        const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1);
        
        if (noise > 0.5) {
          this.world.set(key, 1); // Grass
        } else if (noise > 0.2) {
          this.world.set(key, 2); // Dirt
        } else if (noise > -0.2) {
          this.world.set(key, 3); // Water
        } else {
          this.world.set(key, 2); // Dirt
        }
      }
    }
    
    // Add some trees
    for (let i = 0; i < 30; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const key = `${x},${y}`;
      this.world.set(key, 4); // Tree
    }
  }
  
  getBlock(x, y) {
    const key = `${x},${y}`;
    return this.world.get(key) || 0;
  }
  
  setBlock(x, y, blockType) {
    const key = `${x},${y}`;
    if (blockType === 0) {
      this.world.delete(key);
    } else {
      this.world.set(key, blockType);
    }
  }
  
  getWorldData() {
    const data = {
      width: this.width,
      height: this.height,
      tileSize: this.tileSize,
      blocks: Array.from(this.world.entries()).map(([key, type]) => {
        const [x, y] = key.split(',').map(Number);
        return { x, y, type };
      })
    };
    return data;
  }
}

export class PlayerManager {
  constructor() {
    this.players = new Map();
  }
  
  createPlayer(id, data) {
    const player = {
      id,
      x: data.x || 100,
      y: data.y || 100,
      username: data.username || `Player_${id.slice(0, 5)}`,
      direction: 'down',
      isMoving: false,
      createdAt: Date.now(),
      color: this.generatePlayerColor()
    };
    
    this.players.set(id, player);
    return player;
  }
  
  getPlayer(id) {
    return this.players.get(id);
  }
  
  updatePlayer(id, data) {
    const player = this.players.get(id);
    if (player) {
      Object.assign(player, data);
    }
    return player;
  }
  
  removePlayer(id) {
    this.players.delete(id);
  }
  
  getAllPlayers() {
    return Array.from(this.players.values());
  }
  
  generatePlayerColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

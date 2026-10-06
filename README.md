# 🤖 Copilot Open World

A 2D open-world pixel sandbox game with multiplayer support, building mechanics, and in-game scripting.

## Features

- ✨ **2D Pixel World**: Beautiful tile-based environment with multiple terrain types
- 👥 **Multiplayer**: Real-time player synchronization via WebSocket
- 🔨 **Building System**: Place and remove blocks to shape your world
- 🎮 **Smooth Controls**: Keyboard movement and mouse-based building
- 🤖 **Copilot Characters**: Play as GitHub Copilot-inspired avatars
- 💾 **Persistent World**: All changes are saved on the server

## Quick Start

### Prerequisites
- Node.js 16+ installed

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd copilot-open-world-game

# Install dependencies
npm run setup

# Create .env file
cp .env.example .env
```

### Development

Run server and client in development mode:

```bash
# Terminal 1: Start server
npm run dev:server

# Terminal 2: Start client
npm run dev:client
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
# Build client
npm run build

# Start server (uses built client)
npm start
```

## Controls

| Action | Control |
|--------|----------|
| Move | WASD or Arrow Keys |
| Place Block | Left Click |
| Remove Block | Right Click |
| Toggle Build Mode | B |
| Select Block (1-9) | Number Keys |

## Architecture

### Server (`/server`)
- **index.js**: Express + Socket.IO server
- **world.js**: World generation and block management
- **playerManager.js**: Player state management

### Client (`/client`)
- **game.js**: Main game loop and socket connection
- **gameEngine.js**: Game logic
- **inputManager.js**: Keyboard and mouse input handling
- **renderer.js**: Canvas rendering and drawing

### Shared (`/shared`)
- **constants.js**: Game configuration and block types

## Deployment

### Render (Backend)

1. Create account at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set environment variables in Render dashboard
5. Deploy

### Vercel (Frontend)

1. Create account at https://vercel.com
2. Import project from GitHub
3. Set root directory: `client`
4. Deploy

## Future Features

- [ ] In-game code editor for NPC scripting
- [ ] Resource gathering and crafting system
- [ ] NPC system with AI behavior
- [ ] Server-side scripting with Lua
- [ ] World save/load system
- [ ] User accounts and world sharing
- [ ] Advanced terrain generation
- [ ] Particle effects and animations
- [ ] Sound effects and music

## License

MIT

# Real-Time Metrics Grid

A real-time metrics monitoring dashboard built with React, AG Grid, and WebSocket. This application demonstrates efficient real-time data streaming and grid updates with minimal re-renders.

## Architecture

### Backend (Node.js + WebSocket)
- **WebSocket Server**: Streams metric updates every 500ms
- **In-Memory State**: Simulates 8 different service metrics
- **Smart Updates**: Only sends delta updates (not full snapshots)
- **Status Calculation**: Automatically determines OK/WARN/CRITICAL based on thresholds

### Frontend (React + AG Grid)
- **AG Grid Community**: Efficient grid rendering with transaction-based updates
- **Custom Hooks**: Clean separation of WebSocket logic and grid state management
- **Real-Time Features**:
  - Cell change flash animations
  - Status-based row styling (green/amber/red)
  - Pause/Resume stream control
  - Automatic reconnection on disconnect
  - Relative timestamps ("3s ago")

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Running

1. **Start the Backend**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server will start on `ws://localhost:8080`

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── index.ts              # WebSocket server entry point
│   │   ├── metricsGenerator.ts   # Metric generation logic
│   │   ├── metricsStore.ts       # State management placeholder
│   │   └── types.ts              # Shared TypeScript types
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetricsGrid.tsx   # Main grid component
│   │   │   └── StatusCell.tsx    # Custom status cell renderer
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts   # WebSocket connection management
│   │   │   └── useMetricsStream.ts # Grid data stream handler
│   │   ├── utils/
│   │   │   └── formatTime.ts     # Time formatting utilities
│   │   ├── types.ts              # Frontend types
│   │   └── App.tsx               # Main app component
│   └── package.json
```

## Key Features

### Backend
- **Deterministic IDs**: Each metric has a stable ID for efficient updates
- **Random Walk Algorithm**: Values change gradually (±10) instead of full random
- **Threshold-Based Status**: Automatic WARN/CRITICAL detection
- **Graceful Disconnect Handling**: Cleans up client connections properly

### Frontend
- **Efficient Updates**: Uses `applyTransaction()` instead of full row data replacement
- **Memoized Columns**: Prevents unnecessary re-renders
- **getRowId**: Enables AG Grid to track row identity for updates
- **Cell Change Flash**: Visual feedback when values update
- **Pause/Resume**: Control stream without disconnecting
- **Auto-Reconnect**: Exponential backoff on connection loss

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm run dev  # Vite dev server with HMR
```

### Production Build
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

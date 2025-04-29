# Real-Time Metrics Grid

A real-time metrics monitoring dashboard built with React, AG Grid, and WebSocket. This application demonstrates efficient real-time data streaming and grid updates with minimal re-renders.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup & Run

```bash
# Install all dependencies
npm run install:all

# Run both backend and frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend WebSocket: ws://localhost:8080

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both servers in development mode |
| `npm run build` | Build both projects for production |
| `npm start` | Run both servers in production mode |
| `npm run install:all` | Install all dependencies |

## Architecture

### Backend (Node.js + WebSocket)
- Streams metric updates every 500ms
- Simulates 8 different service metrics
- Sends delta updates (not full snapshots)
- Auto-calculates status (OK/WARN/CRITICAL) based on thresholds

### Frontend (React + AG Grid)
- Efficient grid rendering with transaction-based updates
- Custom hooks for WebSocket and state management
- Real-time features:
  - Cell change flash animations
  - Status-based row styling (green / amber / red)
  - Pause/Resume stream control
  - Automatic reconnection
  - Relative timestamps ("3s ago")

## � Project Structure

```
├── package.json                    # Root package with concurrently scripts
├── server/                         # WebSocket backend
│   ├── src/
│   │   ├── index.ts               # Server entry point
│   │   ├── metricsGenerator.ts    # Metric generation logic
│   │   └── types.ts               # TypeScript types
│   └── package.json
├── client/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── MetricsGrid.tsx    # Main grid component
│   │   │   └── StatusCell.tsx     # Status cell renderer
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts    # WebSocket connection
│   │   │   └── useMetricsStream.ts # Grid data handler
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Key Features

- **Efficient Updates**: Uses `applyTransaction()` for minimal re-renders
- **Deterministic IDs**: Stable row IDs for efficient tracking
- **Random Walk Algorithm**: Realistic metric behavior (±10 value changes)
- **Memoized Columns**: Prevents unnecessary re-renders
- **Cell Flash Animations**: Visual feedback on value changes
- **Auto-Reconnect**: Exponential backoff on connection loss

## Development

Run individual servers if needed:

```bash
# Backend only
cd server && npm run dev

# Frontend only
cd client && npm run dev
```

## License

MIT

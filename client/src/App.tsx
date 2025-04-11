import { MetricsGrid } from './components/MetricsGrid';

function App() {
  const WS_URL = 'ws://localhost:8080';

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto p-4">
        <MetricsGrid wsUrl={WS_URL} />
      </main>
    </div>
  );
}

export default App;

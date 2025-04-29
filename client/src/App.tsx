import { MetricsGrid } from './components/MetricsGrid';

function App() {
  const WS_URL = 'ws://localhost:8081';

  return (
    <div className="bg-gray-900 text-white font-sans">
      <MetricsGrid wsUrl={WS_URL} />
    </div>
  );
}

export default App;

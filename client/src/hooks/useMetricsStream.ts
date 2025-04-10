import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { Metric, WebSocketMessage } from '../types';
import { GridApi } from 'ag-grid-community';

export const useMetricsStream = (url: string) => {
  const { lastMessage, isConnected, close, connect } = useWebSocket(url);
  const [gridApi, setGridApi] = useState<GridApi<Metric> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Initial load state to populate grid
  const [rowData, setRowData] = useState<Metric[]>([]);

  useEffect(() => {
    if (!lastMessage || isPaused) return;

    if (lastMessage.type === 'INIT') {
      setRowData(lastMessage.data);
    } else if (lastMessage.type === 'UPDATE' && gridApi) {
      // Efficiently update rows using transaction
      const transaction = {
        update: lastMessage.data,
      };
      gridApi.applyTransaction(transaction);
    }
  }, [lastMessage, gridApi, isPaused]);

  return {
    rowData,
    isConnected,
    setGridApi,
    isPaused,
    setIsPaused,
    reconnect: connect
  };
};

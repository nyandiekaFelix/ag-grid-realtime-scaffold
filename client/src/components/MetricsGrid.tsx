import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, ValueFormatterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import type { Metric } from '../types';
import { StatusCell } from './StatusCell';
import { useMetricsStream } from '../hooks/useMetricsStream';
import { formatTimeAgo } from '../utils/formatTime';

interface MetricsGridProps {
  wsUrl: string;
}

export const MetricsGrid = ({ wsUrl }: MetricsGridProps) => {
  const { rowData, isConnected, setGridApi, isPaused, setIsPaused, reconnect } = useMetricsStream(wsUrl);

  // Column Definitions: Defines the columns to be displayed.
  const colDefs = useMemo<ColDef<Metric>[]>(() => [
    { field: 'serviceName', filter: true, flex: 1 },
    { field: 'metricName', filter: true, flex: 1 },
    {
      field: 'value',
      flex: 1,
      enableCellChangeFlash: true, // Flash on update
      valueFormatter: (params: ValueFormatterParams) => `${params.value} ${params.data.unit}`
    },
    {
      field: 'status',
      flex: 1,
      cellRenderer: StatusCell,
      cellRendererParams: {
        // passing component as renderer
      }
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => formatTimeAgo(params.value)
      // Note: Relative time won't auto-update every second unless we force it or use a renderer that ticks.
      // For performance, we can leave it as "snapshot time" or update via cell refresh.
      // Simplified for now.
    }
  ], []);

  // Memoize the defaultColDef to prevent unnecessary re-renders
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, [setGridApi]);

  // Used for efficient updates
  const getRowId = useCallback((params: any) => {
    return params.data.id;
  }, []);

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real-Time System Metrics</h1>
        <div className="flex gap-2 items-center">
          <span className={`px-2 py-1 rounded text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded text-white ${isPaused ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          {!isConnected && (
            <button
              onClick={reconnect}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      <div className="ag-theme-alpine-dark flex-grow w-full" style={{ height: '600px' }}>
        <AgGridReact<Metric>
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          getRowId={getRowId}
          animateRows={true}
        />
      </div>
    </div>
  );
};

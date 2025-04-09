export interface Metric {
  id: string;
  serviceName: string;
  metricName: string;
  value: number;
  unit: string;
  status: 'OK' | 'WARN' | 'CRITICAL';
  updatedAt: number;
}

export interface WebSocketMessage {
  type: 'INIT' | 'UPDATE';
  data: Metric[];
}

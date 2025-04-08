export interface Metric {
  id: string;
  serviceName: string;
  metricName: string;
  value: number;
  unit: string;
  status: 'OK' | 'WARN' | 'CRITICAL';
  updatedAt: number; // timestamp
}

export interface WebSocketMessage {
  type: 'INIT' | 'UPDATE';
  data: Metric[];
}

export interface MetricDefinition {
  serviceName: string;
  metricName: string;
  unit: string;
  min: number;
  max: number;
  warnThreshold: number;
  criticalThreshold: number;
}

import { Metric, MetricDefinition } from './types';


// Define the metrics we want to simulate
const METRIC_DEFINITIONS: MetricDefinition[] = [
  { serviceName: 'AuthService', metricName: 'CPU Usage', unit: '%', min: 0, max: 100, warnThreshold: 70, criticalThreshold: 90 },
  { serviceName: 'AuthService', metricName: 'Memory Usage', unit: 'MB', min: 100, max: 1024, warnThreshold: 800, criticalThreshold: 950 },
  { serviceName: 'PaymentService', metricName: 'Transaction Latency', unit: 'ms', min: 10, max: 2000, warnThreshold: 500, criticalThreshold: 1000 },
  { serviceName: 'PaymentService', metricName: 'Failed Transactions', unit: 'count', min: 0, max: 50, warnThreshold: 10, criticalThreshold: 20 },
  { serviceName: 'Database', metricName: 'Active Connections', unit: 'count', min: 0, max: 500, warnThreshold: 300, criticalThreshold: 450 },
  { serviceName: 'Database', metricName: 'Query Duration', unit: 'ms', min: 1, max: 500, warnThreshold: 100, criticalThreshold: 300 },
  { serviceName: 'Frontend', metricName: 'Page Load Time', unit: 'ms', min: 100, max: 3000, warnThreshold: 1500, criticalThreshold: 2500 },
  { serviceName: 'Frontend', metricName: 'Request Errors', unit: 'count', min: 0, max: 20, warnThreshold: 5, criticalThreshold: 10 },
];

export class MetricsGenerator {
  private metrics: Metric[] = [];

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    this.metrics = METRIC_DEFINITIONS.map((def) => {
      return {
        id: `${def.serviceName}-${def.metricName}`.replace(/\s+/g, '-').toLowerCase(),
        serviceName: def.serviceName,
        metricName: def.metricName,
        value: this.getRandomValue(def.min, def.max),
        unit: def.unit,
        status: 'OK',
        updatedAt: Date.now(),
      };
    });
    this.updateStatuses();
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private updateStatuses() {
    this.metrics.forEach((metric) => {
      const def = METRIC_DEFINITIONS.find(
        (d) => d.serviceName === metric.serviceName && d.metricName === metric.metricName
      );
      if (!def) return;

      if (metric.value >= def.criticalThreshold) {
        metric.status = 'CRITICAL';
      } else if (metric.value >= def.warnThreshold) {
        metric.status = 'WARN';
      } else {
        metric.status = 'OK';
      }
    });
  }

  public getAllMetrics(): Metric[] {
    return this.metrics;
  }

  public updateMetrics(): Metric[] {
    const updatedMetrics: Metric[] = [];
    const now = Date.now();

    this.metrics.forEach((metric) => {
      // Update only ~40% of metrics to simulate real-world variance
      if (Math.random() > 0.6) {
        const def = METRIC_DEFINITIONS.find(
          (d) => d.serviceName === metric.serviceName && d.metricName === metric.metricName
        );
        if (def) {
          // Random walk: adjust value slightly rather than full random
          const change = this.getRandomValue(-10, 10);
          let newValue = metric.value + change;
          // Clamp to min/max
          newValue = Math.max(def.min, Math.min(def.max, newValue));

          metric.value = newValue;
          metric.updatedAt = now;
          updatedMetrics.push(metric);
        }
      }
    });

    this.updateStatuses();
    return updatedMetrics;
  }
}

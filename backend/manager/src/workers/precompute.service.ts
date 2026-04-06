import { AnalyticsRepository } from '../../database/storage/repositories/analytics.repo';

const repo = new AnalyticsRepository();

export class PrecomputeWorker {
  private isRunning = false;

  start() {
    console.log('Precompute Worker Started (Interval: 10s)');
    setInterval(async () => {
      if (this.isRunning) return;
      
      this.isRunning = true;
      try {
        const processedCount = await repo.aggregatePendingEvents();
        if (processedCount > 0) {
          console.log(`Precompute Worker: Processed ${processedCount} events`);
        }
      } catch (error) {
        console.error('Precompute Worker Error:', error);
      } finally {
        this.isRunning = false;
      }
    }, 10000);
  }
}

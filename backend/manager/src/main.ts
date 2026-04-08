import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrecomputeWorker } from './workers/precompute.service';
import { connectRedis } from './database/cache/src/cache.service';
import { connectProducer } from './kafka/producer';
import { DatabaseInitService } from './database/init.service';

async function bootstrap() {
  // Initialize database schema and seed data
  const dbInit = new DatabaseInitService();
  await dbInit.initialize().catch((err) =>
    console.error('Failed to initialize database:', err),
  );

  // Ensure Redis is connected before starting
  await connectRedis().catch((err) =>
    console.error('Failed to connect to Redis:', err),
  );

  // Connect Kafka Producer
  await connectProducer().catch((err) =>
    console.error('Failed to connect to Kafka Producer:', err),
  );

  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend Manager is running on: http://localhost:${port}`);

  // Start the background precompute worker
  const worker = new PrecomputeWorker();
  void worker.start().catch((err) =>
    console.error('Failed to start Precompute Worker:', err),
  );
  console.log(`⚙️ Precompute Worker initialized and running.`);
}

void bootstrap();

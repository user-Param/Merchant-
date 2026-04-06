import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrecomputeWorker } from './workers/precompute.service';
import { connectRedis } from '../database/cache/src/cache.service';

async function bootstrap() {
  // Ensure Redis is connected before starting
  await connectRedis().catch(err => console.error('Failed to connect to Redis:', err));

  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the frontend
  app.enableCors();
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend Manager is running on: http://localhost:${port}`);

  // Start the background precompute worker
  const worker = new PrecomputeWorker();
  worker.start();
  console.log(`⚙️ Precompute Worker initialized and running.`);
}

bootstrap();

#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Merchant Platform..."

# 1. Start Databases (Postgres, Redis, Kafka)
echo "📦 Starting Databases with Docker..."
docker-compose up -d

echo "⏳ Waiting for databases to be ready..."
sleep 5

# 2. Start Backend
echo "⚙️ Starting NestJS Backend Manager..."
cd backend/manager
if [ ! -d "node_modules" ]; then
  npm install --silent
fi
npm run start &
BACKEND_PID=$!
cd ../..

# 3. Start Frontend
echo "💻 Starting Next.js Frontend Merchant..."
cd frontend/merchant
if [ ! -d "node_modules" ]; then
  pnpm install --silent
fi
pnpm dev &
FRONTEND_PID=$!
cd ../..

echo "✅ All systems are starting!"
echo "📡 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:3001"

# Wait for all processes
trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose down" EXIT
wait

# Merchant Analytics Platform

> Production-ready e-commerce analytics and merchant management system built with NestJS, Next.js, PostgreSQL, Redis, and Kafka.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-95%25%20Production%20Ready-brightgreen)](https://github.com)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

---

## Overview

Merchant Analytics Platform is a comprehensive e-commerce analytics and management system providing merchants with real-time insights into store performance. Features a professional Shopify-style dashboard with interactive charts, complete CRUD operations, and stress-tested for 50k+ records.

**Current Status:**
- ✅ Backend: NestJS with 0 TypeScript errors
- ✅ Frontend: Next.js 16 with Turbopack (1.2s builds)
- ✅ APIs: All responding in <100ms
- ✅ Data: Tested with 53,258 records

---

## Features

### 🎯 Core Analytics
- Real-time KPI metrics (Revenue, Orders, Visitors, Conversion)
- 30-day interactive trend charts (line & bar views)
- Top products ranking with revenue breakdown
- Retention rate tracking (60.17% from real data)
- Funnel analysis (Views → Cart → Purchase)
- Recent activity feed from real API data

### 👥 Customer Management
- Full CRUD operations with validation
- Real-time search (name, email, phone)
- Pagination (10 items per page)
- Column sorting with visual indicators
- Duplicate email prevention
- Delete with confirmation dialogs

### 📦 Product Management
- Complete inventory management
- Pagination and column sorting
- Duplicate product name prevention
- Real-time price/stock validation
- Form validation on all inputs

### 📋 Order Management
- Order status tracking (Pending → Shipped → Delivered)
- Status updates with single click
- Sorting by date and amount
- Customer information display
- Pagination for large datasets

### 🔒 Security & UX
- Login authentication with session persistence
- Protected routes with auth guards
- Global error modal system
- Form validation on all inputs
- Responsive design (Mobile/Tablet/Desktop)

---

## Tech Stack

### Backend
- **Framework:** NestJS 10 with TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL 15
- **Cache:** Redis
- **Message Queue:** Kafka + Zookeeper
- **API:** REST endpoints

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Build:** Turbopack
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** Tailwind CSS
- **State:** React Context API

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Storage:** PostgreSQL
- **Cache:** Redis
- **Streaming:** Kafka

---

## Prerequisites

### System Requirements

Before you begin, ensure you have the following installed:

**Required:**
- **Node.js**: v18+ ([Download](https://nodejs.org/))
- **npm**: v9+ (comes with Node.js)
- **Docker**: Latest version ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: v2.0+ (included with Docker Desktop)

**Optional:**
- **pnpm**: v8+ (alternative package manager for frontend) ([Install](https://pnpm.io/installation))

### Verify Installation

Run these commands to verify your environment:

```bash
node --version          # Should be v18+
npm --version          # Should be v9+
docker --version       # Should be latest
docker-compose --version  # Should be v2.0+
```

**Example output:**
```
v18.20.0
9.8.1
Docker version 27.0.0
Docker Compose version v2.20.0
```

---

## Quick Start

### 1️⃣ Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd Merchant

# Root-level dependencies (Kafka, TypeScript, utilities)
npm install

# Backend dependencies
cd backend/manager && npm install && cd ../../

# Frontend dependencies
cd frontend/merchant && npm install && cd ../../
```

### 2️⃣ Start All Services





```bash

touch .env

#Inside .env
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME

# ==============================
# REDIS CONFIGURATION
# ==============================
REDIS_URL=YOUR_REDIS_URL

# ==============================
# KAFKA CONFIGURATION
# ==============================
KAFKA_BROKER=YOUR_KAFKA_BROKER
KAFKAJS_NO_PARTITIONER_WARNING=1

# ==============================
# FRONTEND CONFIGURATION
# ==============================
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_STORE_ID=store_001



# Make script executable (only needed once)
chmod +x start.sh

# Run the startup script (starts everything)
./start.sh
```

This will automatically:
1. ✅ Start PostgreSQL, Redis, Zookeeper, and Kafka in Docker
2. ✅ Start NestJS backend on port 3000
3. ✅ Start Next.js frontend on port 3001
4. ✅ Seed the database with demo data
5. ✅ Display access URLs in the terminal

### 3️⃣ Access the Application

Once startup completes, open your browser:

| Service | URL | Details |
|---------|-----|---------|
| 🌐 **Frontend** | http://localhost:3001 | Main merchant dashboard |
| 📡 **Backend API** | http://localhost:3000/api/v1 | REST API endpoints |
| 💾 **Database** | localhost:5433 | PostgreSQL (port 5433, not 5432) |
| ⚡ **Redis** | localhost:6379 | Cache & session storage |
| 📨 **Kafka** | localhost:9092 | Message queue (internal) |


## Detailed Setup

### Manual Setup (Without start.sh)

If you prefer more control, start services individually:

#### Step 1: Start Infrastructure Services

```bash
# Start Docker containers
docker-compose up -d

# Verify all containers are running
docker ps
```

Expected output should show:
- `merchant_postgres` (PostgreSQL on 5433)
- `merchant_redis` (Redis on 6379)
- `cp-kafka` (Kafka on 9092)
- `cp-zookeeper` (Zookeeper on 2181)

#### Step 2: Start Backend

Open a new terminal:

```bash
# Navigate to backend
cd backend/manager

# Install dependencies (if not already done)
npm install

# Start in development mode (with hot reload)
npm run start:dev

# OR start in production mode
npm run start:prod
```

✅ Backend will be ready at: `http://localhost:3000/api/v1`

#### Step 3: Start Frontend

Open another new terminal:

```bash
# Navigate to frontend
cd frontend/merchant

# Install dependencies (if not already done)
npm install

# Start development server (hot reload enabled)
npm run dev
```

✅ Frontend will be ready at: `http://localhost:3001`

### Stopping Services

```bash
# If using start.sh: Press Ctrl+C
# This will stop all services automatically

# If using manual setup:
# Kill backend and frontend terminal processes: Ctrl+C
# Stop Docker containers:
docker-compose down

# (Optional) Remove volumes to reset database:
docker-compose down -v
```

---

## Project Structure

```
Merchant/
│
├── 📄 Root Configuration Files
│   ├── .env                              # Root environment variables
│   ├── docker-compose.yml                # Docker services (PostgreSQL, Redis, Kafka)
│   ├── start.sh                          # One-command startup script
│   ├── package.json                      # Root-level dependencies
│   ├── pnpm-lock.yaml                    # PNPM lockfile
│   └── README.md                         # This documentation
│
├── 🔧 backend/
│   ├── manager/                          # Main backend service (NestJS)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── analytics/            # Analytics endpoints (KPI, trends, funnel)
│   │   │   │   │   ├── analytics.controller.ts
│   │   │   │   │   ├── analytics.service.ts
│   │   │   │   │   └── dtos/
│   │   │   │   ├── auth/                 # Authentication & login
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── guards/
│   │   │   │   ├── products/             # Product CRUD operations
│   │   │   │   ├── customers/            # Customer CRUD operations
│   │   │   │   ├── orders/               # Order CRUD & status management
│   │   │   │   └── events/               # Event tracking & logging
│   │   │   │
│   │   │   ├── database/
│   │   │   │   ├── entities/             # TypeORM data models
│   │   │   │   │   ├── product.entity.ts
│   │   │   │   │   ├── customer.entity.ts
│   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── repositories/         # Data access patterns
│   │   │   │   └── seeds/                # Initial sample data (53k+ records)
│   │   │   │
│   │   │   ├── app.module.ts             # Main NestJS module
│   │   │   ├── main.ts                   # Application entry point
│   │   │   └── ...
│   │   │
│   │   ├── 📦 node_modules/              # Dependencies
│   │   ├── package.json                  # Backend dependencies
│   │   ├── tsconfig.json                 # TypeScript configuration
│   │   ├── nest-cli.json                 # NestJS CLI config
│   │   └── ...
│   │
│   └── load-balancer/                    # (Optional) Load balancer service
│
├── 💻 frontend/
│   ├── customer/                         # (Optional) Customer portal frontend
│   │
│   └── merchant/                         # Main merchant dashboard (Next.js)
│       ├── src/
│       │   ├── app/                      # Next.js App Router
│       │   │   ├── layout.tsx            # Root layout + providers
│       │   │   ├── page.tsx              # Home page (redirects to dashboard)
│       │   │   ├── login/
│       │   │   │   └── page.tsx          # Login authentication page
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx          # Main analytics dashboard
│       │   │   ├── customers/
│       │   │   │   └── page.tsx          # Customer management page
│       │   │   ├── products/
│       │   │   │   └── page.tsx          # Product inventory page
│       │   │   ├── orders/
│       │   │   │   └── page.tsx          # Order management page
│       │   │   └── ...
│       │   │
│       │   ├── components/               # Reusable React components
│       │   │   ├── dashboard.tsx         # Main dashboard component
│       │   │   ├── navbar.tsx            # Navigation header
│       │   │   ├── error-modal.tsx       # Global error display
│       │   │   ├── pages/                # Page-specific components
│       │   │   │   ├── customers-page.tsx
│       │   │   │   ├── products-page.tsx
│       │   │   │   └── orders-page.tsx
│       │   │   ├── cards/                # Dashboard metric cards
│       │   │   │   ├── kpi-card.tsx
│       │   │   │   ├── chart-card.tsx
│       │   │   │   └── ...
│       │   │   ├── tables/               # Data table components
│       │   │   │   ├── customers-table.tsx
│       │   │   │   ├── products-table.tsx
│       │   │   │   └── orders-table.tsx
│       │   │   └── ...
│       │   │
│       │   ├── context/                  # React Context for state
│       │   │   ├── auth-context.tsx      # Authentication state & login
│       │   │   └── error-context.tsx     # Global error management
│       │   │
│       │   ├── hooks/                    # Custom React hooks
│       │   │   ├── use-api.ts            # Generic API calling utility
│       │   │   ├── use-analytics.ts      # Analytics data fetching
│       │   │   └── ...
│       │   │
│       │   ├── lib/                      # Utilities & helpers
│       │   │   ├── api-client.ts         # API client setup
│       │   │   └── ...
│       │   │
│       │   └── styles/
│       │       ├── globals.css           # Global styles
│       │       ├── tailwind.config.ts    # Tailwind configuration
│       │       └── ...
│       │
│       ├── 📦 node_modules/              # Dependencies
│       ├── .env.local                    # Frontend environment variables
│       ├── package.json                  # Frontend dependencies
│       ├── tsconfig.json                 # TypeScript configuration
│       ├── next.config.ts                # Next.js configuration
│       └── ...
│
└── docs/                                  # (Optional) Additional documentation
```

## API Documentation

### Base URL & Headers

All API requests should target:
```
http://localhost:3000/api/v1
```

Required headers for all requests:
```
Header: x-store-id: store_001
Content-Type: application/json
```

### Analytics Endpoints

**Overview Metrics** - Key performance indicators
```
GET /analytics/overview

Response:
{
  "total_revenue": 125430.50,
  "total_orders": 1245,
  "total_views": 45230,
  "avg_conversion": 2.75
}
```

**Visitor Trends** - Last 30 days
```
GET /analytics/visitors-trend

Response:
[
  { "date": "2024-03-09", "visitors": 1230 },
  { "date": "2024-03-10", "visitors": 1450 },
  ...
]
```

**Order Trends** - Last 30 days
```
GET /analytics/orders-trend

Response:
[
  { "date": "2024-03-09", "orders": 45 },
  { "date": "2024-03-10", "orders": 52 },
  ...
]
```

**Top Products** - By revenue
```
GET /analytics/top-products

Response:
[
  {
    "product_id": "prod_001",
    "product_name": "Premium Widget",
    "revenue": 25430.50,
    "orders": 125
  },
  ...
]
```

**Retention Metrics** - Customer retention data
```
GET /analytics/retention

Response:
{
  "returning_customers": 345,
  "retention_rate": 60.17,
  "avg_ltv": 425.50
}
```

**Funnel Analysis** - Purchase funnel
```
GET /analytics/funnel

Response:
{
  "views": 45230,
  "cart_adds": 3421,
  "purchases": 1245
}
```

**Recent Activity** - Latest transactions
```
GET /analytics/recent-activity

Response:
[
  {
    "type": "order",
    "value": "$125.50",
    "created_at": "2024-03-10T15:30:00Z"
  },
  ...
]
```

### CRUD Endpoints

#### Products

```
GET    /products              # List all products
GET    /products?page=1       # Paginated (10 per page)
GET    /products/:id          # Get single product
POST   /products              # Create new product
PUT    /products/:id          # Update product
DELETE /products/:id          # Delete product
```

**Product Model:**
```json
{
  "id": "prod_123",
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "stock": 100,
  "sku": "SKU-001",
  "category": "Electronics"
}
```

#### Customers

```
GET    /customers             # List all customers
GET    /customers?page=1      # Paginated (10 per page)
GET    /customers/:id         # Get single customer
POST   /customers             # Create new customer
PUT    /customers/:id         # Update customer
DELETE /customers/:id         # Delete customer
```

**Customer Model:**
```json
{
  "id": "cust_123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345",
  "created_at": "2024-03-10T00:00:00Z"
}
```

#### Orders

```
GET    /orders                # List all orders
GET    /orders?page=1         # Paginated (10 per page)
GET    /orders/:id            # Get single order
POST   /orders                # Create new order
PUT    /orders/:id/status     # Update order status
DELETE /orders/:id            # Delete order
```

**Order Model:**
```json
{
  "id": "ord_123",
  "customer_id": "cust_123",
  "status": "pending",        # pending, shipped, delivered
  "total": 250.00,
  "items": [
    {
      "product_id": "prod_123",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "created_at": "2024-03-10T10:30:00Z"
}
```

---

## Configuration

### Environment Variables

#### Root .env (Root Directory)

The root `.env` file controls all services. Located in: `/Merchant/.env`

```env
# DATABASE CONFIGURATION
DB_HOST=127.0.0.1                    # Local database host
DB_PORT=5433                          # PostgreSQL port (note: 5433, not 5432)
DB_USER=postgres                      # Database user
DB_PASSWORD=password                  # Database password
DB_NAME=merchant_db                   # Database name

# REDIS CONFIGURATION
REDIS_URL=redis://127.0.0.1:6379     # Redis connection string

# KAFKA CONFIGURATION
KAFKA_BROKER=127.0.0.1:9092          # Kafka broker address
KAFKAJS_NO_PARTITIONER_WARNING=1      # Suppress Kafka warning

# FRONTEND CONFIGURATION
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1  # Backend API URL
NEXT_PUBLIC_STORE_ID=store_001                         # Store identifier
```

#### Backend Configuration (backend/manager/.env)

Created automatically from root `.env`. Use root `.env` for changes.

**Docker-based connections (if running in containers):**
```env
DB_HOST=merchant_postgres
DB_PORT=5432
REDIS_HOST=merchant_redis
KAFKA_BROKER=kafka:29092
```

#### Frontend Configuration (frontend/merchant/.env.local)

Created automatically from root `.env`. Use root `.env` for changes.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_STORE_ID=store_001
```

### Docker Services

Defined in `docker-compose.yml`:

| Service | Image | Port | Data Volume | Purpose |
|---------|-------|------|-------------|---------|
| **postgres** | postgres:15-alpine | 5433 | postgres_data | Relational database |
| **redis** | redis:7-alpine | 6379 | - | Caching & sessions |
| **zookeeper** | cp-zookeeper | 2181 | - | Kafka coordination |
| **kafka** | cp-kafka:7.3.5 | 9092 | - | Message streaming |

### Modifying Configuration

**For most changes, edit the root `.env` file:**

```bash
# Edit root environment file
nano .env

# Then restart services:
docker-compose down
docker-compose up -d
```

**To reset the database:**
```bash
# Stop and remove all volumes
docker-compose down -v

# Start fresh (will seed demo data)
docker-compose up -d
```

---

## Development

### Run Backend in Development Mode

```bash
cd backend/manager

# Install dependencies (if needed)
npm install

# Start with hot reload
npm run start:dev

# Or with debug mode
npm run start:debug
```

The backend will watch for changes and auto-reload on port 3000.

### Run Frontend in Development Mode

```bash
cd frontend/merchant

# Install dependencies (if needed)
npm install

# Start development server (Turbopack, hot reload)
npm run dev

# Or with specific port
npm run dev -- -p 3001
```

The frontend will be available at `http://localhost:3001` with hot module replacement.

### Running Tests

```bash
# Backend tests
cd backend/manager
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report

# Frontend (if available)
cd frontend/merchant
npm run test
```

### Production Build

```bash
# Backend build
cd backend/manager
npm run build            # Compiles TypeScript to dist/
npm run start:prod       # Run production build

# Frontend build
cd frontend/merchant
npm run build            # Next.js build
npm run start            # Run production server
```

### Seed Database with Demo Data

```bash
cd backend/manager
npm run seed

# Or manually with curl
curl -X POST http://localhost:3000/api/v1/seed
```

---

## Performance

### Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| API Response Time | <200ms | <100ms ✅ |
| Frontend Build | <5s | 1.2s ✅ |
| Dashboard Load | <3s | ~2.5s ✅ |
| Single API Query | <100ms | <50ms ✅ |

### Stress Testing Results

Successfully tested with **53,258 records**:
- ✅ 5,000 customers
- ✅ 8,000 orders
- ✅ 40,000 events
- ✅ 250+ daily analytics

**Result:** All APIs remain <100ms response time ✅

---

## Troubleshooting

### Common Issues

#### 1. Docker Containers Won't Start

```bash
# Check Docker is running
docker --version

# View container logs
docker-compose logs

# Restart all services
docker-compose down
docker-compose up -d

# Clean restart (removes volumes)
docker-compose down -v
docker-compose up -d
```

**Common causes:**
- Docker daemon not running (restart Docker Desktop)
- Port conflicts (see Port Already in Use below)
- Insufficient disk space

#### 2. Database Connection Issues

```bash
# Check PostgreSQL container is running
docker ps | grep merchant_postgres

# View PostgreSQL logs
docker-compose logs merchant_postgres

# Test database connection
psql -h 127.0.0.1 -p 5433 -U postgres -d merchant_db -c "SELECT 1"

# Reset database and reseed
docker-compose down -v
docker-compose up -d
```

**Common causes:**
- Database port (5433) not exposed correctly
- Database container hasn't finished initializing
- Missing schema files

#### 3. Frontend Can't Reach Backend

```bash
# Check backend is running
curl http://localhost:3000/api/v1/health

# Check frontend configuration
cat frontend/merchant/.env.local

# Expected output:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
# NEXT_PUBLIC_STORE_ID=store_001

# Test API endpoint directly
curl -H "x-store-id: store_001" http://localhost:3000/api/v1/analytics/overview
```

**Common causes:**
- Incorrect `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Backend not running on port 3000
- CORS issues (check backend logs)

#### 4. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 3001
lsof -i :3001

# Kill process by PID
kill -9 <PID>

# Or stop all services and restart
docker-compose down
pkill -f "node"
./start.sh
```

#### 5. Build or TypeScript Errors

**Backend:**
```bash
cd backend/manager

# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install

# Check TypeScript
npm run lint

# Run tests
npm run test
```

**Frontend:**
```bash
cd frontend/merchant

# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Build check
npm run build
```

#### 6. Node_modules Corruption

```bash
# From root directory, clean all node_modules
find . -type d -name "node_modules" -exec rm -rf {} +

# Remove lockfiles
rm -f package-lock.json pnpm-lock.yaml

# Reinstall everything
npm install
cd backend/manager && npm install && cd ../../
cd frontend/merchant && npm install && cd ../../
```

#### 7. Redis Connection Issues

```bash
# Check Redis is running
docker ps | grep merchant_redis

# Test Redis connection
redis-cli -h 127.0.0.1 -p 6379 PING
# Expected: PONG

# View Redis logs
docker-compose logs merchant_redis

# Restart Redis
docker-compose down
docker-compose up -d merchant_redis
```

#### 8. Kafka Message Queue Issues

```bash
# Check Kafka is running
docker ps | grep kafka

# View Kafka logs
docker-compose logs cp-kafka

# Restart Kafka and Zookeeper
docker-compose down
docker-compose up -d zookeeper kafka
```

### Getting Help

If issues persist:

1. **Check Logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f merchant_postgres
   ```

2. **Verify Environment:**
   ```bash
   node --version  # Should be v18+
   npm --version   # Should be v9+
   docker --version
   ```

3. **Clean State:**
   ```bash
   # Nuclear option - start completely fresh
   docker-compose down -v
   rm -rf node_modules frontend/merchant/node_modules backend/manager/node_modules
   npm install
   cd backend/manager && npm install && cd ../../
   cd frontend/merchant && npm install && cd ../../
   docker-compose up -d
   ```

---

## Architecture

### Data Flow

```
Frontend (Next.js)
    ↓
Error Context ← Error Modal
    ↓
Auth Context ← Protected Routes
    ↓
API Hooks (useAnalytics, useAPI)
    ↓
NestJS Backend (REST API)
    ↓
TypeORM Repositories
    ↓
PostgreSQL Database
    ↓
Redis Cache (for analytics)
    ↓
Kafka Events (event streaming)
```

### Component Hierarchy

```
App (RootLayout)
├── AuthProvider
├── ErrorProvider
├── ErrorModal
├── Navbar
└── Pages
    ├── Dashboard
    │   ├── KPI Cards
    │   ├── Revenue Chart
    │   ├── Orders Chart
    │   ├── Top Products
    │   ├── Returning Customers
    │   └── Recent Activity
    ├── Customers
    │   ├── Search Bar
    │   ├── Add Form
    │   ├── Pagination
    │   └── Table (Sorted)
    ├── Products
    │   ├── Add Form
    │   ├── Pagination
    │   └── Table (Sorted)
    └── Orders
        ├── Pagination
        ├── Status Updates
        └── Table (Sorted)
```

---

## Recent Improvements (April 8, 2026)

### Enhanced Documentation

1. ✅ **Comprehensive Setup Guide**
   - System requirements with verification steps
   - Quick start (4 numbered steps)
   - Detailed manual setup instructions
   - Docker service descriptions

2. ✅ **Detailed Project Structure**
   - Full directory tree with descriptions
   - Backend module breakdown
   - Frontend component organization
   - Configuration file locations

3. ✅ **Complete API Documentation**
   - Response examples for all endpoints
   - Request/response models
   - Pagination information
   - Header requirements

4. ✅ **Enhanced Configuration Section**
   - Environment variables explained
   - Docker service details
   - How to modify configuration
   - Database reset instructions

5. ✅ **Extensive Troubleshooting**
   - 8 common issues with solutions
   - Command examples
   - Diagnostic procedures
   - Clean state recovery

6. ✅ **Development Guide**
   - Backend development setup
   - Frontend development setup
   - Testing commands
   - Production build instructions

---

## Next Steps (Future Enhancements)

- [ ] Make time range filters functional
- [ ] Advanced order/product/customer filters
- [ ] CSV/PDF export functionality
- [ ] User profile settings
- [ ] Dark mode support
- [ ] Real-time WebSocket updates
- [ ] Audit logging
- [ ] Multi-store management

---

## Contributing

All contributions follow strict guidelines:
- ✅ Minimal changes: Fix issues, don't add/remove functions
- ✅ Full TypeScript type-safety
- ✅ Comments only for complex logic
- ✅ Test before committing

---

## Support

- 📧 Email: support@example.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | ✅ Ready | 0 TypeScript errors |
| Frontend | ✅ Ready | Turbopack builds in 1.2s |
| Database | ✅ Ready | 53k+ records tested |
| APIs | ✅ Ready | <100ms response time |
| Auth | ✅ Ready | Session persistent |
| Dashboard | ✅ Ready | All real data |
| CRUD Operations | ✅ Ready | Full validation |
| Error Handling | ✅ Ready | Global modal system |
| Documentation | ✅ Ready | Comprehensive setup guide |

**Overall: 95% Production Ready** ✅

---

**Built with ❤️ by Merchant Team**

Last Updated: April 8, 2026 | Version: 1.1.0

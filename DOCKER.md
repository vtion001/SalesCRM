# SalesCRM Docker Setup

This document explains how to set up and run the SalesCRM application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Twilio account credentials (see `.env.example`)

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Twilio credentials:**
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_API_KEY`
   - `TWILIO_API_SECRET`
   - `TWILIO_PHONE_NUMBER`
   - `TWILIO_TWIML_APP_SID`

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## Docker Compose Services

### Frontend
- **Image:** Multi-stage build with nginx
- **Port:** 3000 (external) → 80 (internal)
- **Features:** Gzip compression, security headers, API proxy

### Backend
- **Image:** Node.js 18 Alpine
- **Port:** 4000
- **Features:** Health checks, non-root user, production optimizations

## Development vs Production

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker-compose -f docker-compose.yml up -d --build
```

## Environment Variables

Key environment variables for Docker:

- `NODE_ENV=production`
- `PORT=4000`
- `FRONTEND_URL=http://localhost:3000`
- `BACKEND_URL=http://localhost:4000`

## Health Checks

The backend service includes health checks:
- **Endpoint:** `/health`
- **Interval:** 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3

## Network Configuration

Services communicate via a dedicated Docker network:
- **Network name:** `salescrm-network`
- **Driver:** bridge

## Troubleshooting

1. **Port conflicts:** Ensure ports 3000 and 4000 are available
2. **Environment issues:** Verify `.env` file exists and contains valid credentials
3. **Build failures:** Check Docker logs with `docker-compose logs`

## Stopping the Services

```bash
docker-compose down
```

To remove volumes (not recommended for production):
```bash
docker-compose down -v
```
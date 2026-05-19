# Distributed File Storage System

A production-grade, distributed cloud storage platform written in Rust (Backend) and React (Frontend).

## Architecture

This system uses a microservices architecture:
- **API Gateway**: Routes external traffic to internal services.
- **Auth Service**: Manages user authentication (JWT + Argon2).
- **Metadata Service**: Tracks files, directories, and chunks in PostgreSQL.
- **Storage Nodes**: Distributed nodes that store actual file chunks.
- **Sync Service**: Real-time updates via WebSockets.

## Prerequisites

- Rust 1.76+
- Docker & Docker Compose
- Node.js 20+

## Getting Started

1. Set up the database and Redis using Docker:
   ```bash
   docker-compose up -d db redis
   ```

2. Run database migrations:
   ```bash
   sqlx migrate run
   ```

3. Start the backend services (in separate terminals or via `cargo-watch`):
   ```bash
   cargo run --bin auth-service
   cargo run --bin metadata-service
   cargo run --bin storage-node
   cargo run --bin gateway-service
   ```

4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Or run everything via Docker Compose
```bash
docker-compose up --build
```

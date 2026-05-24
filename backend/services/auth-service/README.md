# Auth Service

Authentication and authorization service for Nexus Storage.

## Features
- User registration
- User login with JWT tokens
- Token validation

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT signing
- `PORT`: Server port (default: 8080)

## Build
```bash
cargo build --release --package auth-service
```

## Run
```bash
./target/release/auth-service
```

---
Updated: 2026-05-24

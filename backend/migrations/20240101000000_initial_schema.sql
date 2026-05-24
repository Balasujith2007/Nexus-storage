-- Initial Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    path VARCHAR(1024) NOT NULL,
    size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_directory BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL, -- UPLOADING, READY, ERROR
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostname VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    grpc_port INTEGER NOT NULL,
    total_space_bytes BIGINT NOT NULL,
    used_space_bytes BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- ACTIVE, OFFLINE, MAINTENANCE
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    size_bytes INTEGER NOT NULL,
    hash VARCHAR(64) NOT NULL,
    node_id UUID NOT NULL REFERENCES storage_nodes(id),
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (file_id, chunk_index, node_id)
);

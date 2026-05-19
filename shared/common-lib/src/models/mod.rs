use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FileMetadata {
    pub id: Uuid,
    pub user_id: Uuid,
    pub filename: String,
    pub path: String,
    pub size_bytes: i64,
    pub mime_type: String,
    pub is_directory: bool,
    pub status: String, // UPLOADING, READY, ERROR
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChunkMetadata {
    pub id: Uuid,
    pub file_id: Uuid,
    pub chunk_index: i32,
    pub size_bytes: i32,
    pub hash: String, // sha256
    pub node_id: Uuid,
    pub is_primary: bool,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StorageNode {
    pub id: Uuid,
    pub hostname: String,
    pub port: i32,
    pub grpc_port: i32,
    pub total_space_bytes: i64,
    pub used_space_bytes: i64,
    pub status: String, // ACTIVE, OFFLINE, MAINTENANCE
    pub last_heartbeat: DateTime<Utc>,
}

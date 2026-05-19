use serde::Deserialize;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct CreateFileRequest {
    pub user_id: Uuid,
    pub filename: String,
    pub path: String,
    pub size_bytes: i64,
    pub mime_type: String,
    pub is_directory: bool,
}

#[derive(Debug, Deserialize)]
pub struct AddChunkRequest {
    pub file_id: Uuid,
    pub chunk_index: i32,
    pub size_bytes: i32,
    pub hash: String,
    pub node_id: Uuid,
    pub is_primary: bool,
}

use axum::{
    extract::{Extension, Path},
    Json,
};
use common_lib::{
    errors::AppError,
    models::{FileMetadata, ChunkMetadata},
};
use uuid::Uuid;
use crate::{AppState, models::{CreateFileRequest, AddChunkRequest}};

pub async fn list_files(
    Extension(state): Extension<AppState>,
    // Add auth extraction here to filter by user
) -> Result<Json<Vec<FileMetadata>>, AppError> {
    let files = sqlx::query_as!(
        FileMetadata,
        "SELECT * FROM files ORDER BY created_at DESC LIMIT 100"
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(files))
}

pub async fn create_file_metadata(
    Extension(state): Extension<AppState>,
    Json(payload): Json<CreateFileRequest>,
) -> Result<Json<FileMetadata>, AppError> {
    let file_id = Uuid::new_v4();
    
    let file = sqlx::query_as!(
        FileMetadata,
        r#"
        INSERT INTO files (id, user_id, filename, path, size_bytes, mime_type, is_directory, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'UPLOADING')
        RETURNING *
        "#,
        file_id,
        payload.user_id,
        payload.filename,
        payload.path,
        payload.size_bytes,
        payload.mime_type,
        payload.is_directory
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(file))
}

pub async fn get_file(
    Extension(state): Extension<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<FileMetadata>, AppError> {
    let file = sqlx::query_as!(
        FileMetadata,
        "SELECT * FROM files WHERE id = $1",
        id
    )
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::NotFound("File not found".into()))?;

    Ok(Json(file))
}

pub async fn delete_file(
    Extension(state): Extension<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<()>, AppError> {
    sqlx::query!("DELETE FROM files WHERE id = $1", id)
        .execute(&state.db)
        .await?;

    Ok(Json(()))
}

pub async fn update_file(
    Extension(state): Extension<AppState>,
    Path(id): Path<Uuid>,
    // Json(payload): Json<UpdateFileRequest>
) -> Result<Json<()>, AppError> {
    // Implement update logic (e.g., status UPLOADING -> READY)
    sqlx::query!("UPDATE files SET status = 'READY', updated_at = NOW() WHERE id = $1", id)
        .execute(&state.db)
        .await?;
        
    Ok(Json(()))
}

pub async fn add_chunk_metadata(
    Extension(state): Extension<AppState>,
    Json(payload): Json<AddChunkRequest>,
) -> Result<Json<ChunkMetadata>, AppError> {
    let chunk_id = Uuid::new_v4();
    
    let chunk = sqlx::query_as!(
        ChunkMetadata,
        r#"
        INSERT INTO chunks (id, file_id, chunk_index, size_bytes, hash, node_id, is_primary, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'READY')
        RETURNING *
        "#,
        chunk_id,
        payload.file_id,
        payload.chunk_index,
        payload.size_bytes,
        payload.hash,
        payload.node_id,
        payload.is_primary
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(chunk))
}

use axum::{
    extract::{Extension, Path, Multipart},
    response::IntoResponse,
    http::StatusCode,
    Json,
};
use common_lib::errors::AppError;
use uuid::Uuid;
use tokio::{fs::File, io::AsyncWriteExt};
use serde_json::json;

use crate::AppState;

pub async fn upload_chunk(
    Extension(state): Extension<AppState>,
    Path(chunk_id): Path<Uuid>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, AppError> {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        if name == "chunk" {
            let chunk_path = state.storage_dir.join(chunk_id.to_string());
            let mut file = File::create(&chunk_path).await.map_err(|e| AppError::InternalError(e.to_string()))?;
            
            let data = field.bytes().await.map_err(|e| AppError::BadRequest(e.to_string()))?;
            file.write_all(&data).await.map_err(|e| AppError::InternalError(e.to_string()))?;
            
            return Ok((StatusCode::OK, Json(json!({"status": "success", "chunk_id": chunk_id}))));
        }
    }

    Err(AppError::BadRequest("No chunk data found".into()))
}

pub async fn download_chunk(
    Extension(state): Extension<AppState>,
    Path(chunk_id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let chunk_path = state.storage_dir.join(chunk_id.to_string());
    
    let file = File::open(&chunk_path).await.map_err(|_| AppError::NotFound("Chunk not found".into()))?;
    
    let stream = tokio_util::io::ReaderStream::new(file);
    let body = axum::body::Body::from_stream(stream);
    
    Ok((StatusCode::OK, body))
}

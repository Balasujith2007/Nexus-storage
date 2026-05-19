use thiserror::Error;
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Authentication failed: {0}")]
    AuthError(String),
    
    #[error("Authorization failed: {0}")]
    Forbidden(String),
    
    #[error("Not found: {0}")]
    NotFound(String),
    
    #[error("Bad request: {0}")]
    BadRequest(String),
    
    #[error("Validation error: {0}")]
    ValidationError(String),
    
    #[error("Conflict: {0}")]
    Conflict(String),
    
    #[error("Database error")]
    DatabaseError(#[from] sqlx::Error),
    
    #[error("Cache error")]
    CacheError(#[from] redis::RedisError),
    
    #[error("Internal server error: {0}")]
    InternalError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::AuthError(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::Forbidden(msg) => (StatusCode::FORBIDDEN, msg),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::ValidationError(msg) => (StatusCode::UNPROCESSABLE_ENTITY, msg),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, msg),
            AppError::DatabaseError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Internal database error".to_string()),
            AppError::CacheError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Internal cache error".to_string()),
            AppError::InternalError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        let body = Json(json!({
            "error": {
                "message": error_message,
                "code": status.as_u16(),
            }
        }));

        (status, body).into_response()
    }
}

use axum::{
    extract::Extension,
    Json,
};
use common_lib::{
    auth::{hash_password, verify_password},
    errors::AppError,
    models::User,
};
use uuid::Uuid;
use validator::Validate;

use crate::{
    models::{LoginRequest, LoginResponse, RegisterRequest},
    AppState,
};

pub async fn register(
    Extension(state): Extension<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<User>, AppError> {
    payload.validate().map_err(|e| AppError::ValidationError(e.to_string()))?;

    // Check if user exists
    let user_exists = sqlx::query_scalar::<_, bool>(
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1 OR username = $2)"
    )
    .bind(&payload.email)
    .bind(&payload.username)
    .fetch_one(&state.db)
    .await?;

    if user_exists {
        return Err(AppError::Conflict("Email or username already exists".into()));
    }

    let hashed_password = hash_password(&payload.password)?;
    let user_id = Uuid::new_v4();

    let user = sqlx::query_as::<_, User>(
        r#"
        INSERT INTO users (id, username, email, password_hash, role)
        VALUES ($1, $2, $3, $4, 'user')
        RETURNING id, username, email, role, created_at, updated_at
        "#
    )
    .bind(user_id)
    .bind(&payload.username)
    .bind(&payload.email)
    .bind(&hashed_password)
    .fetch_one(&state.db)
    .await?;

    Ok(Json(user))
}

pub async fn login(
    Extension(state): Extension<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, AppError> {
    payload.validate().map_err(|e| AppError::ValidationError(e.to_string()))?;

    let record = sqlx::query_as::<_, (Uuid, String, String, String, String)>(
        r#"
        SELECT id, username, email, password_hash, role
        FROM users WHERE email = $1
        "#
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await?
    .ok_or_else(|| AppError::AuthError("Invalid credentials".into()))?;

    if !verify_password(&payload.password, &record.3)? {
        return Err(AppError::AuthError("Invalid credentials".into()));
    }

    let token = state.token_manager.generate_token(record.0, &record.4, 24 * 60 * 60)?;

    let user = User {
        id: record.0,
        username: record.1,
        email: record.2,
        role: record.4,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    Ok(Json(LoginResponse { token, user }))
}

pub async fn validate(
    Extension(state): Extension<AppState>,
    axum_extra::TypedHeader(auth_header): axum_extra::TypedHeader<axum_extra::headers::Authorization<axum_extra::headers::authorization::Bearer>>,
) -> Result<Json<common_lib::auth::Claims>, AppError> {
    let token = auth_header.token();
    let claims = state.token_manager.validate_token(token)?;
    Ok(Json(claims))
}

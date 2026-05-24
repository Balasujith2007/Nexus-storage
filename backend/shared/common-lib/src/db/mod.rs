use sqlx::{postgres::PgPoolOptions, PgPool};
use redis::{Client, aio::ConnectionManager};
use crate::errors::AppError;

pub async fn init_db(database_url: &str) -> Result<PgPool, AppError> {
    PgPoolOptions::new()
        .max_connections(50)
        .connect(database_url)
        .await
        .map_err(AppError::DatabaseError)
}

pub async fn init_redis(redis_url: &str) -> Result<ConnectionManager, AppError> {
    let client = Client::open(redis_url).map_err(AppError::CacheError)?;
    ConnectionManager::new(client).await.map_err(AppError::CacheError)
}

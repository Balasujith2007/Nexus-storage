use axum::{
    routing::{get, post},
    Router,
    Extension,
};
use std::path::PathBuf;
use tower_http::{trace::TraceLayer, cors::CorsLayer, limit::RequestBodyLimitLayer};

mod handlers;

#[derive(Clone)]
pub struct AppState {
    pub storage_dir: PathBuf,
    pub node_id: uuid::Uuid,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let storage_dir = PathBuf::from(std::env::var("STORAGE_DIR").unwrap_or_else(|_| "./data".into()));
    if !storage_dir.exists() {
        tokio::fs::create_dir_all(&storage_dir).await?;
    }

    let state = AppState {
        storage_dir,
        node_id: uuid::Uuid::new_v4(), // In production, this should be loaded from config/disk
    };

    let app = Router::new()
        .route("/health", get(|| async { "Storage Node OK" }))
        .route("/api/v1/storage/upload/:chunk_id", post(handlers::upload_chunk))
        .route("/api/v1/storage/download/:chunk_id", get(handlers::download_chunk))
        .layer(RequestBodyLimitLayer::new(100 * 1024 * 1024)) // 100MB chunk limit
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(Extension(state));

    let port = std::env::var("PORT").unwrap_or_else(|_| "8083".into());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Storage node listening on {}", addr);
    
    axum::serve(listener, app).await?;
    Ok(())
}

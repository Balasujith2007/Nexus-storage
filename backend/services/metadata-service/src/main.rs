use axum::{
    routing::{get, post},
    Router,
    Extension,
};
use common_lib::db::init_db;
use tower_http::trace::TraceLayer;
use sqlx::PgPool;

mod handlers;
mod models;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = init_db(&database_url).await?;

    let state = AppState {
        db: db_pool,
    };

    let app = Router::new()
        .route("/health", get(|| async { "Metadata Service OK" }))
        .route("/api/v1/metadata/files", get(handlers::list_files).post(handlers::create_file_metadata))
        .route("/api/v1/metadata/files/:id", get(handlers::get_file).delete(handlers::delete_file).put(handlers::update_file))
        .route("/api/v1/metadata/chunks", post(handlers::add_chunk_metadata))
        .layer(TraceLayer::new_for_http())
        .layer(Extension(state));

    let port = std::env::var("PORT").unwrap_or_else(|_| "8082".into());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Metadata service listening on {}", addr);
    
    axum::serve(listener, app).await?;
    Ok(())
}

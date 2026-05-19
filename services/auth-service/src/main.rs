use axum::{
    routing::{post, get},
    Router,
    Extension,
};
use common_lib::{
    config::AppConfig,
    db::init_db,
    auth::AuthTokenManager,
};
use std::sync::Arc;
use tower_http::{trace::TraceLayer, cors::CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use sqlx::PgPool;

mod handlers;
mod models;
// mod middleware;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub token_manager: Arc<AuthTokenManager>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "auth_service=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load config
    let config = AppConfig::from_env().unwrap_or_else(|_| {
        tracing::warn!("Failed to load config from environment, using defaults");
        AppConfig {
            server_host: "0.0.0.0".to_string(),
            server_port: 8081,
            database_url: std::env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            redis_url: "".to_string(),
            jwt_secret: std::env::var("JWT_SECRET").unwrap_or_else(|_| "dev_secret_key_change_in_prod".to_string()),
            log_level: "debug".to_string(),
        }
    });

    let db_pool = init_db(&config.database_url).await?;
    let token_manager = Arc::new(AuthTokenManager::new(&config.jwt_secret));

    let state = AppState {
        db: db_pool,
        token_manager,
    };

    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route("/api/v1/auth/register", post(handlers::register))
        .route("/api/v1/auth/login", post(handlers::login))
        .route("/api/v1/auth/validate", get(handlers::validate))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(Extension(state));

    let addr = format!("{}:{}", config.server_host, config.server_port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Auth service listening on {}", addr);
    
    axum::serve(listener, app).await?;

    Ok(())
}

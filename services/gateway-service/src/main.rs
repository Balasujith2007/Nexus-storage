use axum::{
    extract::{Request, State},
    http::{StatusCode, Uri},
    response::{IntoResponse, Response},
    routing::{any, get},
    Router,
};
use reqwest::Client;
use std::sync::Arc;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Clone)]
struct AppState {
    http_client: Client,
    auth_service_url: String,
    metadata_service_url: String,
    storage_service_url: String,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let state = AppState {
        http_client: Client::new(),
        auth_service_url: std::env::var("AUTH_SERVICE_URL").unwrap_or_else(|_| "http://localhost:8081".into()),
        metadata_service_url: std::env::var("METADATA_SERVICE_URL").unwrap_or_else(|_| "http://localhost:8082".into()),
        storage_service_url: std::env::var("STORAGE_SERVICE_URL").unwrap_or_else(|_| "http://localhost:8083".into()),
    };

    let app = Router::new()
        .route("/health", get(|| async { "Gateway OK" }))
        .route("/api/v1/auth/*path", any(proxy_auth))
        .route("/api/v1/metadata/*path", any(proxy_metadata))
        .route("/api/v1/storage/*path", any(proxy_storage))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".into());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Gateway listening on {}", addr);
    
    axum::serve(listener, app).await?;
    Ok(())
}

async fn proxy_auth(State(state): State<AppState>, req: Request) -> Result<Response, StatusCode> {
    proxy_request(state.http_client, state.auth_service_url, req).await
}

async fn proxy_metadata(State(state): State<AppState>, req: Request) -> Result<Response, StatusCode> {
    proxy_request(state.http_client, state.metadata_service_url, req).await
}

async fn proxy_storage(State(state): State<AppState>, req: Request) -> Result<Response, StatusCode> {
    proxy_request(state.http_client, state.storage_service_url, req).await
}

async fn proxy_request(client: Client, base_url: String, mut req: Request) -> Result<Response, StatusCode> {
    let path = req.uri().path();
    let query = req.uri().query().map(|q| format!("?{}", q)).unwrap_or_default();
    
    let target_url = format!("{}{}{}", base_url, path, query);
    
    *req.uri_mut() = target_url.parse::<Uri>().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let res = client
        .request(req.method().clone(), target_url)
        .headers(req.headers().clone())
        .body(req.into_body())
        .send()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let mut response_builder = Response::builder().status(res.status());
    
    if let Some(headers) = response_builder.headers_mut() {
        *headers = res.headers().clone();
    }
    
    let body = axum::body::Body::from_stream(res.bytes_stream());
    response_builder.body(body).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

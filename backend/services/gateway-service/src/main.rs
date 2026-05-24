use axum::{
    extract::{Request, State},
    http::StatusCode,
    response::Response,
    routing::{any, get},
    Router,
};
use reqwest::Client;
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

async fn proxy_request(client: Client, base_url: String, req: Request) -> Result<Response, StatusCode> {
    let path = req.uri().path();
    let query = req.uri().query().map(|q| format!("?{}", q)).unwrap_or_default();
    
    let target_url = format!("{}{}{}", base_url, path, query);

    // Convert axum request to reqwest request
    let method = match req.method().as_str() {
        "GET" => reqwest::Method::GET,
        "POST" => reqwest::Method::POST,
        "PUT" => reqwest::Method::PUT,
        "DELETE" => reqwest::Method::DELETE,
        "PATCH" => reqwest::Method::PATCH,
        "HEAD" => reqwest::Method::HEAD,
        "OPTIONS" => reqwest::Method::OPTIONS,
        _ => return Err(StatusCode::METHOD_NOT_ALLOWED),
    };

    // Convert headers
    let mut req_builder = client.request(method, &target_url);
    for (name, value) in req.headers() {
        if let Ok(val_str) = value.to_str() {
            req_builder = req_builder.header(name.as_str(), val_str);
        }
    }

    // Convert body
    let body_bytes = axum::body::to_bytes(req.into_body(), usize::MAX)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    let res = req_builder
        .body(body_bytes.to_vec())
        .send()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    // Convert response
    let status = match res.status().as_u16() {
        code => axum::http::StatusCode::from_u16(code).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
    };

    let mut response_builder = Response::builder().status(status);
    
    // Convert response headers
    if let Some(headers) = response_builder.headers_mut() {
        for (name, value) in res.headers() {
            if let Ok(header_name) = axum::http::HeaderName::from_bytes(name.as_str().as_bytes()) {
                if let Ok(header_value) = axum::http::HeaderValue::from_bytes(value.as_bytes()) {
                    headers.insert(header_name, header_value);
                }
            }
        }
    }
    
    let body = axum::body::Body::from_stream(res.bytes_stream());
    response_builder.body(body).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Extension,
    },
    response::IntoResponse,
    routing::get,
    Router,
};
use futures::sink::SinkExt;
use tower_http::trace::TraceLayer;

#[derive(Clone)]
struct AppState {
    // Keep track of connected clients
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let state = AppState {};

    let app = Router::new()
        .route("/health", get(|| async { "Sync Service OK" }))
        .route("/ws", get(ws_handler))
        .layer(TraceLayer::new_for_http())
        .layer(Extension(state));

    let port = std::env::var("PORT").unwrap_or_else(|_| "8084".into());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Sync service listening on {}", addr);
    
    axum::serve(listener, app).await?;
    Ok(())
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Extension(_state): Extension<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket))
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {
            msg
        } else {
            return;
        };

        if socket.send(Message::Text(format!("Echo: {:?}", msg))).await.is_err() {
            return;
        }
    }
}

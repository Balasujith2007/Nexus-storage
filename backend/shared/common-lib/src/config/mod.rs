use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct AppConfig {
    pub server_host: String,
    pub server_port: u16,
    pub database_url: String,
    pub redis_url: String,
    pub jwt_secret: String,
    pub log_level: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self, config::ConfigError> {
        dotenvy::dotenv().ok();
        
        config::Config::builder()
            .add_source(config::Environment::default())
            .build()?
            .try_deserialize()
    }
}

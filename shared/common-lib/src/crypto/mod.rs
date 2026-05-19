use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Key, Nonce,
};
use crate::errors::AppError;
use rand::RngCore;

pub struct Crypto {
    cipher: Aes256Gcm,
}

impl Crypto {
    pub fn new(key_hex: &str) -> Result<Self, AppError> {
        let key_bytes = hex::decode(key_hex)
            .map_err(|_| AppError::InternalError("Invalid encryption key hex".to_string()))?;
        
        if key_bytes.len() != 32 {
            return Err(AppError::InternalError("Encryption key must be 32 bytes for AES-256".to_string()));
        }

        let key = Key::<Aes256Gcm>::from_slice(&key_bytes);
        let cipher = Aes256Gcm::new(key);
        Ok(Self { cipher })
    }

    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, AppError> {
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng); // 96-bits
        
        let ciphertext = self.cipher.encrypt(&nonce, data)
            .map_err(|_| AppError::InternalError("Encryption failed".to_string()))?;
            
        let mut result = nonce.to_vec();
        result.extend_from_slice(&ciphertext);
        Ok(result)
    }

    pub fn decrypt(&self, encrypted_data: &[u8]) -> Result<Vec<u8>, AppError> {
        if encrypted_data.len() < 12 {
            return Err(AppError::InternalError("Invalid encrypted data format".to_string()));
        }

        let (nonce_bytes, ciphertext) = encrypted_data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        self.cipher.decrypt(nonce, ciphertext)
            .map_err(|_| AppError::InternalError("Decryption failed".to_string()))
    }
    
    pub fn generate_key() -> String {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        hex::encode(key)
    }
}

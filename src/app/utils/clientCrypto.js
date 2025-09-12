'use client';
import CryptoJS from 'crypto-js';

// Usar a mesma chave em ambos os lados
const SECRET_KEY = 'cuida-ai-2025-secret-key-infodental-production';

export function encryptDataClient(data) {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    throw new Error('Falha na criptografia');
  }
}
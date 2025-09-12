import CryptoJS from 'crypto-js';

// Usar a mesma chave em ambos os lados
const SECRET_KEY = 'cuida-ai-2025-secret-key-infodental-production';

export function decryptDataServer(encryptedData) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    throw new Error('Falha na descriptografia');
  }
}
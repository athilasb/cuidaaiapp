'use server'
import { decryptDataServer } from '../utils/serverCrypto';

export async function sendMessage(encryptedData) {
  try {
    const decryptedData = decryptDataServer(encryptedData);
    const { token, mensagem } = decryptedData;
    
    const formData = new FormData();
    formData.append('token', token);
    formData.append('mensage', mensagem);
    
    const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/ia.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { 
      success: false, 
      error: 'Erro na comunicação com o servidor' 
    };
  }
}
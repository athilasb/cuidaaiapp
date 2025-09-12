'use server'
import { decryptDataServer } from '../utils/serverCrypto';

export async function login(encryptedData) {
  try {
    const decryptedData = decryptDataServer(encryptedData);
    const { email, senha } = decryptedData;
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('senha', senha);
    
    const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/login.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Erro na comunicação com o servidor' };
  }
}
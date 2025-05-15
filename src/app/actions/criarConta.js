'use server'
export async function criarConta(email, senha) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('senha', senha);
  const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/criarConta.php', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data;
}
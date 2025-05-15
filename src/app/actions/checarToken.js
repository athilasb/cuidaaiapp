'use server';
export async function checarToken(token) {
  const formData = new FormData();
  formData.append('token', token);

  const response = await fetch('https://infoadmdev.infodental.dental/infoservices/cuidaai/usuarioCheca.php', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data;
}
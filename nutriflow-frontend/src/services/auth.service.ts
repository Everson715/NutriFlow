const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleResponseError(response: Response) {
  if (response.status === 500) {
    throw new Error("Erro interno no servidor. Tente novamente mais tarde.");
  }
  if (response.status === 503) {
    throw new Error("O serviço está em manutenção. Por favor, aguarde.");
  }
  
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `Erro inesperado: ${response.status}`);
}

export async function registerUser(payload: any) {
  if (!API_URL) throw new Error("API URL não configurada.");

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) await handleResponseError(response);
  return response.json();
}

export async function loginUser(payload: { email: string; password: string }) {
  if (!API_URL) throw new Error("API URL não configurada.");

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) await handleResponseError(response);
  return response.json();
}
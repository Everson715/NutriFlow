const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔴 ESSENCIAL
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Login failed');
  }

  return response.json();
}


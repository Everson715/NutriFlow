import { apiFetch } from "@/lib/api";
import { RegisterPayload, LoginPayload } from "@/types/auth";

export function registerUser(payload: RegisterPayload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(payload: LoginPayload): Promise<void> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 🔐 ESSENCIAL PARA COOKIE HTTP-ONLY
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to login");
  }
}

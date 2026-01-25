"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type User = {
  sub: string;
  email: string;
};

// 1. Adicionado "server-error" e "unavailable" ao tipo
type AuthError = {
  message: string;
  type: "unauthorized" | "forbidden" | "network" | "server-error" | "unavailable" | "unknown";
} | null;

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError;
  logout: () => Promise<void>;
  validateSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function apiCall<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  try {
    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // --- TRATAMENTO DE STATUS ESPECÍFICOS ---

    if (response.status === 401) {
      const error = new Error("Sessão expirada. Por favor, faça login novamente.");
      (error as any).status = 401;
      (error as any).type = "unauthorized";
      throw error;
    }

    if (response.status === 403) {
      const error = new Error("Acesso negado. Você não tem permissão.");
      (error as any).status = 403;
      (error as any).type = "forbidden";
      throw error;
    }

    // 2. Tratamento para Erro 500
    if (response.status === 500) {
      const error = new Error("Erro interno no servidor. Tente novamente mais tarde.");
      (error as any).status = 500;
      (error as any).type = "server-error";
      throw error;
    }

    // 3. Tratamento para Erro 503
    if (response.status === 503) {
      const error = new Error("Serviço temporariamente indisponível (manutenção).");
      (error as any).status = 503;
      (error as any).type = "unavailable";
      throw error;
    }

    if (!response.ok) {
      let errorMessage = `Erro na requisição: ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch { /* ignored */ }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).type = "unknown";
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return {} as T;
  } catch (error: any) {
    if (error.status && error.type) {
      throw error;
    }

    if (error.name === "TypeError" || error.message.includes("fetch")) {
      const networkError = new Error("Erro de rede. Verifique sua conexão.");
      (networkError as any).status = 0;
      (networkError as any).type = "network";
      throw networkError;
    }

    throw error;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError>(null);
  const router = useRouter();

  const validateSession = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const data = await apiCall<User>("/auth/validate", { method: "GET" });

      setUser(data);
    } catch (err: any) {
      setUser(null);

      // 4. Mapeamento do erro para o estado do Contexto
      if (err.type === "unauthorized") {
        setError(null); 
      } else {
        setError({
          message: err.message,
          type: err.type || "unknown",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const logout = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      await apiCall("/auth/logout", { method: "POST" });
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, logout, validateSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
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

type AuthError = {
  message: string;
  type: "unauthorized" | "forbidden" | "network" | "unknown";
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

/**
 * Helper function to make authenticated API calls with proper error handling
 * Distinguishes between 401 (unauthorized), 403 (forbidden), network errors, and other errors
 */
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

    // Handle HTTP errors with specific status codes
    if (response.status === 401) {
      const error = new Error("Session expired. Please log in again.");
      (error as any).status = 401;
      (error as any).type = "unauthorized";
      throw error;
    }

    if (response.status === 403) {
      const error = new Error("Access forbidden. You don't have permission.");
      (error as any).status = 403;
      (error as any).type = "forbidden";
      throw error;
    }

    if (!response.ok) {
      // Try to extract error message from response
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch {
        // If response is not JSON, use default message
      }
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).type = "unknown";
      throw error;
    }

    // Handle empty responses (like logout)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return {} as T;
  } catch (error: any) {
    // Re-throw known errors
    if (error.status && error.type) {
      throw error;
    }

    // Handle network errors
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      const networkError = new Error(
        "Network error. Please check your connection.",
      );
      (networkError as any).status = 0;
      (networkError as any).type = "network";
      throw networkError;
    }

    // Re-throw other errors
    throw error;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError>(null);
  const router = useRouter();

  /**
   * Validates the current session by calling /auth/validate endpoint
   * Updates user state and error state accordingly
   * Can be called manually after login or whenever session needs to be refreshed
   */
  const validateSession = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const data = await apiCall<User>(
        "/auth/validate",
        {
          method: "GET",
        },
      );

      setUser(data);
      setError(null);
    } catch (err: any) {
      // Clear user on any error during validation
      setUser(null);

      // Set appropriate error state
      if (err.type === "unauthorized") {
        // 401 is expected for unauthenticated users, not really an error state
        setError(null);
      } else if (err.type === "network") {
        // Network errors should be surfaced but shouldn't block the app
        setError({
          message: err.message,
          type: "network",
        });
      } else {
        setError({
          message: err.message || "Authentication validation failed",
          type: err.type || "unknown",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate session on mount and when component remounts
  useEffect(() => {
    validateSession();
  }, [validateSession]);

  /**
   * Logs out the user by clearing the cookie and resetting state
   * Handles errors gracefully and always redirects to login
   * Uses router.replace to prevent back button issues
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      
      // Attempt to call logout endpoint to clear server-side session
      await apiCall("/auth/logout", {
        method: "POST",
      });
    } catch (err: any) {
      // Log error but don't block logout flow
      // The cookie might still be cleared client-side by the browser
      console.error("Logout error:", err);
      
      // If it's a network error, we still want to clear local state
      if (err.type !== "network") {
        setError({
          message: "Logout request failed, but you have been signed out locally.",
          type: err.type || "unknown",
        });
      }
    } finally {
      // Always clear user state and redirect, regardless of API call success
      setUser(null);
      setError(null);
      
      // Use replace to avoid back button issues
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        logout,
        validateSession,
      }}
    >
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
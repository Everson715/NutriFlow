"use client";

import {createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type User = {
    sub: string;
    email: string;
}

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) { 
    const [User, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/validate`,
          {
            credentials: "include",
          },
        );
        if (!response.ok){
            setUser(null);
            return;
        }
        const data = await response.json();
        setUser(data);
    } catch{
        setUser(null);
    }finally{
        setIsLoading(false);
    }
}
    validateSession();
},[]);

    async function logout() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
        router.push("/login");
    }
    return (
        <AuthContext.Provider
        value={{
            user: User,
            isAuthenticated: !!User,
            isLoading,
            logout,
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
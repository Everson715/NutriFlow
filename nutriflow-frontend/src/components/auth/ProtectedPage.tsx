"use client";

import { ReactNode, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";

export function ProtectedPage({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Validating session...</p>
        </div>
        );
    }
    if (!isAuthenticated) {
        return null;
    }
    return <>{children}</>;
}
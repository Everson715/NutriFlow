"use client";
import {ReactNode} from "react";
import { useAuth } from "@/contexts/AuthContext";

export  function RootLayoutClient({
    children,
}: {
    children: ReactNode;
}) {
    const { isAuthenticated } = useAuth(); 
    if (!isAuthenticated) {
        return(
            <div className="flex min-h-screen items-center justify-center">
                <p>Initializing session...</p>
            </div>
        );
    }
    return <>{children}</>;
}
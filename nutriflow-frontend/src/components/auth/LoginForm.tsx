"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
    const router = useRouter();
    const { validateSession } = useAuth();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const payload = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };
        if (!payload.email || !payload.password) {
            setError("Please fill in all fields.");
            return;
        }
        try{
            setLoading(true);

            await loginUser(payload);

            // Validate session after successful login to update AuthContext with user data
            await validateSession();

            // Redirect to dashboard after successful login and session validation
            router.push("/dashboard");
        }catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        }finally {
            setLoading(false);
        }
    }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Input
        name="email"
        type="email"
        placeholder="Email"
      />

      <Input
        name="password"
        type="password"
        placeholder="Password"
      />

      <Button disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
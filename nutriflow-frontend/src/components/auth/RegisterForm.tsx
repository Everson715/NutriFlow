"user client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/services/auth.service";

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        const payload = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };
        if (payload.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (payload.password !== payload.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await registerUser(payload);
            router.push("/login");
        }catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }
     return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Input name="name" placeholder="Nome" />
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Senha" />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirmar senha"
      />

      <Button disabled={loading}>
        {loading ? "Cadastrando..." : "Criar conta"}
      </Button>
    </form>
  );
}
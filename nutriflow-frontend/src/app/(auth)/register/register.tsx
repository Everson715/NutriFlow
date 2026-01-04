"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "Todos os campos são obrigatórios";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Email inválido";
    }

    if (form.password.length < 6) {
      return "A senha deve ter no mínimo 6 caracteres";
    }

    if (form.password !== form.confirmPassword) {
      return "As senhas não coincidem";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao cadastrar usuário");
        return;
      }

      router.push("/login");
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Criar conta
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <input
          name="name"
          placeholder="Nome"
          onChange={handleChange}
          className="input"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
        />

        <input
          name="password"
          type="password"
          placeholder="Senha"
          onChange={handleChange}
          className="input"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar senha"
          onChange={handleChange}
          className="input"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedPage } from "@/components/auth/ProtectedPage";

export default function DashboardPage() {
  const { user, error, logout } = useAuth();

  // 1. Tratamento de Erro de Rede (UX)
  if (error && error.type === "network") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-yellow-600 font-semibold">Aviso de Conexão</p>
          <p className="text-sm text-gray-600">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 underline text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // 2. Encapsulamos todo o retorno no ProtectedPage
  // Isso garante que a lógica de redirecionamento e o loading centralizado funcionem.
  return (
    <ProtectedPage>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              {/* O 'user' aqui é garantido pelo ProtectedPage */}
              <p className="text-gray-600 mt-1">Bem-vindo, {user!.email}</p>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>

          <main>
            {/* Conteúdo Real do Dashboard */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Seus Dados</h2>
              <p className="text-gray-700">O conteúdo protegido aparece aqui.</p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
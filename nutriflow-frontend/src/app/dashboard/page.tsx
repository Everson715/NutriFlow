"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { user, error: authError, logout } = useAuth();
  const { data, isLoading, error: dashboardError } = useDashboard();

  // 1. Tratamento de Estados Iniciais (Loading e Erro Crítico)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse">Carregando dados...</p>
      </div>
    );
  }

  // Tratamento de Erro de Rede ou Geral
  const error = dashboardError || authError;
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-yellow-600 font-semibold">Erro ao carregar informações</p>
          <p className="text-sm text-gray-600">{error.message || "Erro desconhecido"}</p>
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

  // 2. Renderização Principal
  return (
    <ProtectedPage>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-1">Bem-vindo, {user?.email}</p>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>

          <main>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Seus Dados de Hoje</h2>
              
              {/* Agora os dados são renderizados com segurança dentro do JSX */}
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Refeições hoje:</span> {data?.stats?.mealsToday ?? 0}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Calorias consumidas:</span> {data?.stats?.caloriesConsumed ?? 0} kcal
                </p>
              </div>

              <hr className="my-6" />
              <p className="text-gray-500 text-sm">O conteúdo protegido aparece aqui.</p>
            </div>
          </main>
        </div>
      </div>
    </ProtectedPage>
  );
}
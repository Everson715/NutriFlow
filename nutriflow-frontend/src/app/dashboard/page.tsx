"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, isLoading, error, logout } = useAuth();

  // Prevent rendering before auth state is resolved
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Validating session...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's a network error (but user might still be authenticated)
  if (error && error.type === "network") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-yellow-600">Connection Warning</p>
          <p className="text-sm text-gray-600">{error.message}</p>
          {user && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                You are logged in as: {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no user and not loading, middleware should have redirected
  // But handle this case gracefully anyway
  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

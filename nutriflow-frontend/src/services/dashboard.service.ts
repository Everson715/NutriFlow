export type DashboardResponse = {
  mealsToday: number;
  caloriesToday: number;
  // acrescente outros campos conforme o backend evoluir
};

export async function fetchDashboard(): Promise<DashboardResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const response = await fetch(`${apiUrl}/dashboard`, {
    method: "GET",
    credentials: "include", // envia cookie HttpOnly
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // sessão inválida / expirada
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}

export async function fetchDashboard() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/dashboard`, {
    credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
}
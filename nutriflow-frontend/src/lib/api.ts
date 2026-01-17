export async function apiFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        }
    );
    const data = await response.json();
    if (!response.ok){
        throw data;
    }
    return data;
}
"use client";

import { useEffect, useState } from "react";
import { fetchDashboard } from "@/services/dashboard.service";

export function useDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const dashboardData = await fetchDashboard();
                setData(dashboardData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    return { data, isLoading, error };
}
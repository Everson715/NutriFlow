import { apiFetch } from "@/lib/api";
import {RegisterPayload} from "@/types/auth";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { promises } from "dns";

export function registerUser(payload: RegisterPayload) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

const LOGIN_URL = process.env.NEXT_PUBLIC_API_URL;

export async function  loginUser (payload: LoginPayload) : Promise<LoginResponse> {
    const response  = await fetch(`${LOGIN_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    return data;
}
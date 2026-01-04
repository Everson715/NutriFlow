import { apiFetch } from "@/lib/api";
import {RegisterPayload} from "@/types/auth";

export function registerUser(payload: RegisterPayload) {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
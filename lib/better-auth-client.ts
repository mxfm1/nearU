import { createAuthClient } from 'better-auth/react';


const API_BASE = process.env.NODE_ENV === 'development' ? process.env.API_URL : process.env.NEXT_PUBLIC_API_RAW_URL
console.log("API_BASE", API_BASE)

export const authClient = createAuthClient({
    baseURL: API_BASE
});
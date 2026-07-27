export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'develop') {
    return process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_API_RAW_URL || '';
}

export function getAuthBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'develop') {
    return process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_RAW_URL || '';
}

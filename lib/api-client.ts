type RequestOptions = {
  headers?: Record<string, string>
  cache?: RequestCache
  next?: { revalidate?: number; tags?: string[] }
}

type ApiResponse<T> = {
  data: T | null
  error: ApiError | null
  status: number
}

type ApiError = {
  message: string
  code: string
  details?: unknown
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

async function request<TResponse, TBody = unknown>(
  method: string,
  path: string,
  body?: TBody,
  options: RequestOptions = {},
): Promise<ApiResponse<TResponse>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: options.cache,
      next: options.next,
    })

    const status = res.status

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorBody.message ?? res.statusText,
          code: errorBody.code ?? `HTTP_${res.status}`,
          details: errorBody.details,
        },
        status,
      }
    }

    const data = await res.json()
    return { data: data as TResponse, error: null, status }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : 'Network error',
        code: 'NETWORK_ERROR',
      },
      status: 0,
    }
  }
}

export const api = {
  get<TResponse>(path: string, options?: RequestOptions) {
    return request<TResponse>('GET', path, undefined, options)
  },

  post<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return request<TResponse, TBody>('POST', path, body, options)
  },

  put<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return request<TResponse, TBody>('PUT', path, body, options)
  },

  patch<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return request<TResponse, TBody>('PATCH', path, body, options)
  },

  delete<TResponse>(path: string, options?: RequestOptions) {
    return request<TResponse>('DELETE', path, undefined, options)
  },
}

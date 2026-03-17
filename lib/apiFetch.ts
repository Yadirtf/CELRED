/**
 * Centralized API fetcher with standard error handling and JSON support.
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        // Try to get error message from response body
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error de servidor (HTTP ${res.status})`);
    }

    // Handle empty responses (like 204 No Content)
    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAPI(endpoint, method = 'GET', body) {
    const headers = {
        "Accept": "application/json",
        "Accept-Language": savedLanguage
    };

    if ((method === 'POST' || method === 'PUT') && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    console.log(`[FetchAPI] ${method} -> ${endpoint}`);
    console.log(`[FetchAPI] Headers:`, headers);

    try {
        const baseUrl = EXPO_PUBLIC_API_URL.endsWith('/') ? EXPO_PUBLIC_API_URL : `${EXPO_PUBLIC_API_URL}/`;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const url = `${baseUrl}${cleanEndpoint}`;

        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (res.status === 204) return null;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textError = await res.text();
            console.error(`[Fetch Error] Non-JSON response at ${url}. Status: ${res.status}`);
            return {
                error: `Server error (${res.status}). Check backend connectivity.`,
                status: res.status
            };
        }

        const data = await res.json();

        if (res.status === 401) {
            // Check if the backend provided a specific error message, otherwise fallback to "Unauthorized"
            return {
                error: data.message || data.error || 'Unauthorized', 
                status: 401
            };
        }

        if (!res.ok) {
            return { error: data.message || data.error || `Error ${res.status}`, status: res.status };
        }

        return data;
    } catch (e) {
        return {
            error: "Network error. Check your connection.",
            stack: e.message
        };
    }
}
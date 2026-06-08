const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAPI(endpoint, method = 'GET', body) {
    const headers = {
        "Accept": "application/json"
    };

    if ((method === 'POST' || method === 'PUT') && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const res = await fetch(`${EXPO_PUBLIC_API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (res.status === 204) return null;

        const data = await res.json();

        if (res.status === 401) {
            // Navigatie afhandelen via je nav ref of een auth context
            return {error: 'Unauthorized', status: 401};
        }

        return data;
    } catch (e) {
        return {
            error: "Something went wrong! Please try again later!",
            stack: e.stack
        };
    }
}
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
export async function fetchAPI(endpoint, method = 'GET', body) {
    const token = await AsyncStorage.getItem('token');

    const headers = {
        Accept: 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (
        (method === 'POST' || method === 'PUT' || method === 'PATCH') &&
        !(body instanceof FormData)
    ) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const baseUrl = EXPO_PUBLIC_API_URL.endsWith('/')
            ? EXPO_PUBLIC_API_URL
            : `${EXPO_PUBLIC_API_URL}/`;

        const cleanEndpoint = endpoint.startsWith('/')
            ? endpoint.slice(1)
            : endpoint;

        const url = `${baseUrl}${cleanEndpoint}`;

        console.log('TOKEN IN fetchAPI:', token);
        console.log('HEADERS:', headers);
        const res = await fetch(url, {
            method,
            headers,
            body: body
                ? body instanceof FormData
                    ? body
                    : JSON.stringify(body)
                : null,
        });

        if (res.status === 204) return null;

        const data = await res.json();

        if (res.status === 401) {
            await AsyncStorage.removeItem('token');

            return {
                error: data.message || data.error || 'Unauthorized',
                status: 401,
            };
        }

        if (!res.ok) {
            return {
                error: data.message || data.error || `Error ${res.status}`,
                status: res.status,
            };
        }

        return data;
    } catch (e) {
        return {
            error: 'Something went wrong! Please try again later!',
            stack: e.stack,
        };
    }
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

//dit is zegmaar een toggle zodat we jwt in 1 keer aan kunnen zetten wanneer we dat wille jatoch
export const USE_JWT = false;

export async function storeToken(token) {
    if (USE_JWT && token) {
        await SecureStore.setItemAsync('jwt_token', token);
    }
}

export async function getToken() {
    if (!USE_JWT) return null;
    return await SecureStore.getItemAsync('jwt_token');
}

export async function removeToken() {
    await SecureStore.deleteItemAsync('jwt_token');
}

export async function fetchAPI(endpoint, method = 'GET', body) {
    let savedLanguage = 'en';
    try {
        const lang = await AsyncStorage.getItem('userLanguage');
        if (lang) {
            savedLanguage = lang;
            console.log(`[FetchAPI] Language: ${savedLanguage}`);
        }
    } catch (e) {
        console.error("Language load error:", e);
    }

    const headers = {
        "Accept": "application/json",
        "Accept-Language": savedLanguage
    };

    if (USE_JWT) {
        const token = await getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

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

        if (USE_JWT && res.status === 401) {
            await removeToken();
            return { error: data.message || 'Unauthorized', status: 401 };
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
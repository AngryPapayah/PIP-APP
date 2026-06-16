import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function storeToken(token) {
    await SecureStore.setItemAsync('jwt_token', token);
}

export async function getToken() {
    return await SecureStore.getItemAsync('jwt_token');
}

export async function removeToken() {
    await SecureStore.deleteItemAsync('jwt_token');
}

export async function fetchAPI(endpoint, method = 'GET', body) {
    // We halen eerst de taal op uit de opslag.
    // Als er niets is opgeslagen, vallen we terug op 'en'.
    let savedLanguage = 'en';
    try {
        const lang = await AsyncStorage.getItem('userLanguage');
        if (lang) {
            savedLanguage = lang;
        }
    } catch (e) {
        console.error("Fetch service: Error getting language from storage", e);
    }

    const token = await getToken();
    const headers = {
        "Accept": "application/json",
        "Accept-Language": savedLanguage
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if ((method === 'POST' || method === 'PUT') && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    try {
        const baseUrl = EXPO_PUBLIC_API_URL.endsWith('/') ? EXPO_PUBLIC_API_URL : `${EXPO_PUBLIC_API_URL}/`;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const url = `${baseUrl}${cleanEndpoint}`;

        const res = await fetch(url, {
        // De handmatige vertraging van 2 seconden voor de Pip-loader
        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = await fetch(`${EXPO_PUBLIC_API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        if (res.status === 204) return null;

        const data = await res.json();

        if (res.status === 401) {
            // If unauthorized, remove the token
            await removeToken();
            // Check if the backend provided a specific error message, otherwise fallback to "Unauthorized"
            return {
                error: data.message || data.error || 'Unauthorized',
                status: 401
            };
        }

        if (!res.ok) {
            return {
                error: data.message || data.error || `Error ${res.status}`,
                status: res.status
            };
        }

        return data;
    } catch (e) {
        // Technische error log blijft in het Engels
        console.error("API Fetch Error:", e);
        return {
            error: "Something went wrong! Please try again later!",
            stack: e.stack
        };
    }
}
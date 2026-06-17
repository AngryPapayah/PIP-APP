import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

//dit is zegmaar een toggle zodat we jwt in 1 keer aan kunnen zetten wanneer we dat wille jatoch
export const USE_JWT = true;

export async function storeToken(token) {
    if (token) {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem('jwt_token', token);
        } else {
            await SecureStore.setItemAsync('jwt_token', token);
        }
    }
}

export async function getToken() {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('jwt_token');
    }
    return await SecureStore.getItemAsync('jwt_token');
}

export async function removeToken() {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('jwt_token');
    } else {
        await SecureStore.deleteItemAsync('jwt_token');
    }
}

export async function fetchAPI(endpoint, method = 'GET', body) {
    let savedLanguage = 'en';
    try {
        const lang = await AsyncStorage.getItem('userLanguage');
        if (lang) {
            savedLanguage = lang;
        }
    } catch (e) {
        console.error("[FetchAPI] Language load error:", e);
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

    if ((method === 'POST' || method === 'PUT') && body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const baseUrl = EXPO_PUBLIC_API_URL.endsWith('/') ? EXPO_PUBLIC_API_URL : `${EXPO_PUBLIC_API_URL}/`;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}${cleanEndpoint}`;

    console.log(`[FetchAPI] ${method} -> ${url}`);

    try {
        const res = await fetch(url, {
            method,
            headers,
            body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : null
        });

        if (res.status === 204) return null;

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textError = await res.text();
            console.error(`[Fetch Error] Non-JSON response at ${url}. Status: ${res.status}`);
            return {
                error: `Server error (${res.status}).`,
                status: res.status
            };
        }

        const data = await res.json();

        if (USE_JWT && res.status === 401) {
            await removeToken();
            return {error: data.message || 'Unauthorized', status: 401};
        }

        if (!res.ok) {
            return {error: data.message || data.error || `Error ${res.status}`, status: res.status};
        }

        return data;
    } catch (e) {
        console.error("[FetchAPI] Network error:", e.message);
        return {
            error: "Network error. Check your connection.",
            stack: e.message
        };
    }
}
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

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

    const headers = {
        "Accept": "application/json",
        "Accept-Language": savedLanguage // De header voor de backend vertalingen
    };

    if ((method === 'POST' || method === 'PUT') && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    try {
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
let baseURL = window.location.origin;
const STORAGE_KEY = 'auth_token';

export function getToken() {
    return localStorage.getItem(STORAGE_KEY);
}

export function setToken(token) {
    localStorage.setItem(STORAGE_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}

export async function call(endpoint, options = {}, responseType = 'json') {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers,
        });
        
        if (response.status === 401) {
            clearToken();
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `API Error: ${response.status}`);
        }
                    
        if (responseType === 'blob') {
            return response.blob();
        }
        
        return response.json();
    } catch (error) {
        if (!navigator.onLine) {
            throw new Error('Seems Like you are offline. Please confirm internet connectivity')
        }
        throw error;
    }
}
    
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
            // Token invalid or expired
            clearToken();
            throw new Error('Session expired. Please login again.');
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
        throw error;
    }
}
    
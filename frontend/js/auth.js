import {
    call, setToken, getToken, clearToken, isAuthenticated as isAuthenticatedFromClient
} from "./client.js"

/**
 * Authentication Module
 * Handles signup, login, and logout operations
 */

export async function handleProcesssAuth(hash) {
    if (!hash) {
        return { success: false, error: 'No hash value found in URL'}
    }
    try {
        const data = await call('/auth/process?' + hash)
        if (data.session && data.session.access_token) {
            setToken(data.session.access_token);
            return { success: true };
        } else {
            return { success: false, error: 'Login post signup failed' };
        }
    } catch(error) {
        return { success: false, error: error.message };
    }
}

export async function signup(email, password, confirmPassword) {
    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    try {
        const data = await call('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.session && data.session.access_token) {
            setToken(data.session.access_token);
            return { success: true, user: data.user };
        } else {
            return {
                success: false,
                error: 'Signup successful! Check your email to confirm your account.'
            };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function login(email, password) {
    if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
    }

    try {
        const data = await call('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (data.session && data.session.access_token) {
            setToken(data.session.access_token);
            return { success: true, user: data.user };
        } else {
            return { success: false, error: 'Login failed' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logout() {
    try {
        await call('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearToken();
    }
}

export async function getCurrentUser() {
    try {
        const user = await call('/auth/me');
        return user;
    } catch (error) {
        clearToken();
        throw error;
    }
}

export function isAuthenticated() {
    return isAuthenticatedFromClient();
}

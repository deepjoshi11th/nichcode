/**
 * Login API Module
 * Handles authentication API calls (login, signup, logout, getCurrentUser)
 */
import { call, setToken, clearToken, isAuthenticated as isAuthenticatedFromClient } from "./client.js"

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} confirmPassword - Password confirmation
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
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

/**
 * Log in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
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

/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export async function logout() {
    try {
        await call('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearToken();
    }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User object
 */
export async function getCurrentUser() {
    try {
        const user = await call('/auth/me');
        return user;
    } catch (error) {
        clearToken();
        throw error;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return isAuthenticatedFromClient();
}

/**
 * Handle OAuth/auth callback after redirect
 * @param {string} hash - Query hash from URL
 * @returns {Promise<{success: boolean, error?: string}>}
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

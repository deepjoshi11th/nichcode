/**
 * Auth Guard Module
 * Ensures user is authenticated and redirects to login if not
 */
import { isAuthenticated } from "./client.js"

/**
 * Check authentication and redirect to login if not authenticated
 * Call this at the start of your page that requires authentication
 * @returns {boolean} true if authenticated, false if redirected
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

/**
 * Get redirect path after login
 * Returns the page that tried to access a protected route
 * @returns {string} URL to redirect to after login
 */
export function getPostLoginRedirect() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/';
}

/**
 * Build login URL with redirect
 * @param {string} redirectTo - Where to redirect after login
 * @returns {string} Login URL with redirect parameter
 */
export function buildLoginUrl(redirectTo = window.location.pathname) {
    return `/login.html?redirect=${encodeURIComponent(redirectTo)}`;
}

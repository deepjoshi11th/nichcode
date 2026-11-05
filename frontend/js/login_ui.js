/**
 * Login UI Module
 * Manages login/signup form UI and interactions
 */

let loginForm = null;
let signupForm = null;
export let loginFormElement = null;
export let signupFormElement = null;
let showSignupBtn = null;
let showLoginBtn = null;
let errorMessage = null;

/**
 * Initialize all DOM elements
 */
export function init() {
    loginForm = document.getElementById('login-form');
    signupForm = document.getElementById('signup-form');
    loginFormElement = document.getElementById('login-form-element');
    signupFormElement = document.getElementById('signup-form-element');
    showSignupBtn = document.getElementById('show-signup-btn');
    showLoginBtn = document.getElementById('show-login-btn');
    errorMessage = document.getElementById('error-message');

    if (!loginForm || !signupForm) {
        throw new Error('Login page elements not found. Make sure you are on the login.html page.');
    }
}

/**
 * Toggle to signup form
 */
export function toggleSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

/**
 * Toggle to login form
 */
export function toggleLoginForm() {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
}

/**
 * Clear form inputs
 */
export function clearForms() {
    loginFormElement.reset();
    signupFormElement.reset();
}

/**
 * Show error message
 */
export function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

/**
 * Hide error message
 */
export function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

/**
 * Get login form values
 */
export function getLoginFormValues() {
    return {
        email: document.getElementById('login-email').value.trim(),
        password: document.getElementById('login-password').value,
    };
}

/**
 * Get signup form values
 */
export function getSignupFormValues() {
    return {
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value,
        confirmPassword: document.getElementById('signup-confirm-password').value,
    };
}

/**
 * Get form toggle buttons for event listeners
 */
export function getShowSignupBtn() {
    return showSignupBtn;
}

export function getShowLoginBtn() {
    return showLoginBtn;
}

export function getLoginFormElement() {
    return loginFormElement;
}

export function getSignupFormElement() {
    return signupFormElement;
}

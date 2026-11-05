/**
 * Login Page Main Module
 * Entrypoint and orchestrator for login/signup page
 */

import { 
    init as initUI, 
    toggleSignupForm, 
    toggleLoginForm, 
    getLoginFormValues, 
    showError, 
    clearForms,
    getSignupFormValues,
    getShowSignupBtn,
    getShowLoginBtn,
    getLoginFormElement,
    getSignupFormElement,
    hideError
} from "./login_ui.js"

import { 
    login, 
    signup, 
    isAuthenticated 
} from "./login_api.js"

/**
 * Initialize the login page
 */
async function init() {
    // Initialize UI
    initUI();

    // Check if already authenticated - redirect to home
    if (isAuthenticated()) {
        window.location.href = '/';
        return;
    }

    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Form toggle buttons
    const showSignupBtn = getShowSignupBtn();
    const showLoginBtn = getShowLoginBtn();
    const loginFormElement = getLoginFormElement();
    const signupFormElement = getSignupFormElement();

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideError();
            toggleSignupForm();
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideError();
            toggleLoginForm();
        });
    }

    // Form submissions
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }

    if (signupFormElement) {
        signupFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSignup();
        });
    }
}

/**
 * Handle login form submission
 */
async function handleLogin() {
    const { email, password } = getLoginFormValues();

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    try {
        const result = await login(email, password);

        if (result.success) {
            // Redirect to home page on successful login
            window.location.href = '/';
        } else {
            showError(result.error || 'Login failed');
        }
    } catch (error) {
        showError(error.message || 'An error occurred during login');
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup() {
    const { email, password, confirmPassword } = getSignupFormValues();

    if (!email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    try {
        const result = await signup(email, password, confirmPassword);

        if (result.success) {
            // Redirect to home page on successful signup
            window.location.href = '/';
        } else {
            showError(result.error || 'Signup failed');
            
            // If user needs to confirm email, switch to login form
            if (result.error && result.error.includes('Check your email')) {
                setTimeout(() => {
                    toggleLoginForm();
                }, 1500);
            }
        }
    } catch (error) {
        showError(error.message || 'An error occurred during signup');
    }
}

// Initialize on page load
init();

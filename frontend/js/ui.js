/**
 * UI Module
 * Manages UI state and interactions
 */

let authSection = null;
let protectedContent = null;
let userInfo = null;
let userEmail = null;
export let logoutBtn = null;
export let loginLink = null;
let loginForm = null;
let signupForm = null;
export let loginFormElement = null;
export let signupFormElement = null;
let showSignupBtn = null;
export let showLoginBtn = null;
export let fetchAllDataBtn = null;
export let fetchItemBtn = null;
export let itemIdInput = null;
let dataOutput = null;
let dataContent = null;
let loading = null;
export let profileDetailsForm = null;
let profileDetailsInput = null;
let saveProfileDetailsBtn = null;
export let viewProfileDetailsBtn = null;
export let profileDetailsDisplay = null;
export let qrForm = null;
let qrText = null;
let qrSize = null;
let qrFill = null;
let qrBack = null;
let qrResult = null;
export let qrImage = null;
export let downloadQrBtn = null;
export let shareWhatsappBtn = null;
export let pasteBtn = null;

// Initialize DOM elements
export function init() {
    this.authSection = document.getElementById('auth-section');
    this.protectedContent = document.getElementById('protected-content');
    this.userInfo = document.getElementById('user-info');
    this.userEmail = document.getElementById('user-email');
    this.logoutBtn = document.getElementById('logout-btn');
    this.loginLink = document.getElementById('login-link');
    this.loginForm = document.getElementById('login-form');
    this.signupForm = document.getElementById('signup-form');
    this.loginFormElement = document.getElementById('login-form-element');
    this.signupFormElement = document.getElementById('signup-form-element');
    this.showSignupBtn = document.getElementById('show-signup-btn');
    this.showLoginBtn = document.getElementById('show-login-btn');
    this.fetchAllDataBtn = document.getElementById('fetch-all-data-btn');
    this.fetchItemBtn = document.getElementById('fetch-item-btn');
    this.itemIdInput = document.getElementById('item-id-input');
    this.dataOutput = document.getElementById('data-output');
    this.dataContent = document.getElementById('data-content');
    this.loading = document.getElementById('loading');
    this.errorMessage = document.getElementById('error-message');
    this.profileDetailsForm = document.getElementById('profile-details-form');
    this.profileDetailsInput = document.getElementById('sensitive-part-input');
    this.saveProfileDetailsBtn = document.getElementById('save-profile-details-btn');
    this.viewProfileDetailsBtn = document.getElementById('view-profile-details-btn');
    this.profileDetailsDisplay = document.getElementById('profile-details-display');
    this.qrForm = document.getElementById('qr-form');
    this.qrText = document.getElementById('qr-text');
    this.qrSize = document.getElementById('qr-size');
    this.qrFill = document.getElementById('qr-fill');
    this.qrBack = document.getElementById('qr-back');
    this.qrResult = document.getElementById('qr-result');
    this.qrImage = document.getElementById('qr-image');
    this.downloadQrBtn = document.getElementById('download-qr');
    this.shareWhatsappBtn = document.getElementById('share-whatsapp');
    this.pasteBtn = document.getElementById('paste-btn');
}

// Show authentication UI (not logged in)
export function showAuthUI() {
    this.authSection.style.display = 'block';
    this.protectedContent.style.display = 'none';
    this.userInfo.style.display = 'none';
    this.loginLink.style.display = 'inline';
}

// Show protected content (logged in)
export function showProtectedUI() {
    this.authSection.style.display = 'none';
    this.protectedContent.style.display = 'block';
    this.userInfo.style.display = 'inline-flex';
    this.loginLink.style.display = 'none';
}

// Toggle between login and signup forms
export function toggleSignupForm() {
    this.loginForm.style.display = 'none';
    this.signupForm.style.display = 'block';
}

export function toggleLoginForm() {
    this.signupForm.style.display = 'none';
    this.loginForm.style.display = 'block';
}

// Set user email display
export function setUserEmail(email) {
    this.userEmail.textContent = email;
}

// Clear form inputs
export function clearForms() {
    this.loginFormElement.reset();
    this.signupFormElement.reset();
}

// Show data output
export function displayData(data) {
    this.loading.style.display = 'none';
    this.dataContent.textContent = JSON.stringify(data, null, 2);
    this.dataOutput.style.display = 'block';
}

// Show error message
export function showError(message) {
    if (this.errorMessage) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Show loading state
export function showLoading() {
    this.loading.style.display = 'block';
    this.dataOutput.style.display = 'none';
}

// Get form values
export function getLoginFormValues() {
    return {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value,
    };
}

export function getSignupFormValues() {
    return {
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
        confirmPassword: document.getElementById('signup-confirm-password').value,
    };
}

export function getItemId() {
    return this.itemIdInput.value;
}

export function getProfileDetailsInput() {
    return this.profileDetailsInput.value;
}

export function setProfileDetailsInput(value) {
    this.profileDetailsInput.value = value;
}

export function clearProfileDetailsInput() {
    this.profileDetailsInput.value = '';
}

export function displayProfileDetails(data) {
    if (data) {
        this.profileDetailsDisplay.innerHTML = `
            <div class="profile-details-card">
                <h4>Your Profile Details</h4>
                <p class="detail-label">Sensitive Information:</p>
                <p class="detail-value">${this.escapeHtml(data.sensitive_part)}</p>
                <p class="detail-meta">ID: ${data.id}</p>
            </div>
        `;
    } else {
        this.profileDetailsDisplay.innerHTML = '<p style="color: #888888; text-align: center;">No profile details found</p>';
    }
    this.profileDetailsDisplay.style.display = 'block';
}

export function hideProfileDetails() {
    this.profileDetailsDisplay.style.display = 'none';
}

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function getQrFormValues() {
    return {
        text: this.qrText.value,
        size: parseInt(this.qrSize.value) || 10,
        fill_color: this.qrFill.value,
        back_color: this.qrBack.value,
    };
}

export function displayQrCode(blob) {
    const url = URL.createObjectURL(blob);
    this.qrImage.src = url;
    this.qrResult.style.display = 'block';
    // Store the blob URL for download/share
    this.qrImage.dataset.blobUrl = url;
}

export function hideQrCode() {
    this.qrResult.style.display = 'none';
    if (this.qrImage.src) {
        URL.revokeObjectURL(this.qrImage.src);
    }
}

export function setQrText(value) {
    this.qrText.value = value;
}

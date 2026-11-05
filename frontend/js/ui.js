/**
 * UI Module
 * Manages UI state and interactions for protected content
 */

let protectedContent = null;
let userInfo = null;
export let userEmail = null;
export let logoutBtn = null;
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
let errorMessage = null;

// Initialize DOM elements
export function init() {
    protectedContent = document.getElementById('protected-content');
    userInfo = document.getElementById('user-info');
    userEmail = document.getElementById('user-email');
    logoutBtn = () => document.getElementById('logout-btn');
    fetchAllDataBtn = () => document.getElementById('fetch-all-data-btn');
    fetchItemBtn = document.getElementById('fetch-item-btn');
    itemIdInput = document.getElementById('item-id-input');
    dataOutput = document.getElementById('data-output');
    dataContent = document.getElementById('data-content');
    loading = document.getElementById('loading');
    errorMessage = document.getElementById('error-message');
    profileDetailsForm = document.getElementById('profile-details-form');
    profileDetailsInput = document.getElementById('sensitive-part-input');
    saveProfileDetailsBtn = document.getElementById('save-profile-details-btn');
    viewProfileDetailsBtn = document.getElementById('view-profile-details-btn');
    profileDetailsDisplay = document.getElementById('profile-details-display');
    qrForm = document.getElementById('qr-form');
    qrText = document.getElementById('qr-text');
    qrSize = document.getElementById('qr-size');
    qrFill = document.getElementById('qr-fill');
    qrBack = document.getElementById('qr-back');
    qrResult = document.getElementById('qr-result');
    qrImage = document.getElementById('qr-image');
    downloadQrBtn = document.getElementById('download-qr');
    shareWhatsappBtn = document.getElementById('share-whatsapp');
    pasteBtn = document.getElementById('paste-btn');
}

export function displayData(data) {
    loading.style.display = 'none';
    dataContent.textContent = JSON.stringify(data, null, 2);
    dataOutput.style.display = 'block';
}

// Show error message
export function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

// Show loading state
export function showLoading() {
    loading.style.display = 'block';
    dataOutput.style.display = 'none';
}

export function getItemId() {
    return itemIdInput.value;
}

export function getProfileDetailsInput() {
    return profileDetailsInput.value;
}

export function setProfileDetailsInput(value) {
    profileDetailsInput.value = value;
}

export function clearProfileDetailsInput() {
    profileDetailsInput.value = '';
}

export function displayProfileDetails(data) {
    if (data) {
        profileDetailsDisplay.innerHTML = `
            <div class="profile-details-card">
                <h4>Your Profile Details</h4>
                <p class="detail-label">Sensitive Information:</p>
                <p class="detail-value">${escapeHtml(data.sensitive_part)}</p>
                <p class="detail-meta">ID: ${data.id}</p>
            </div>
        `;
    } else {
        profileDetailsDisplay.innerHTML = '<p style="color: #888888; text-align: center;">No profile details found</p>';
    }
    profileDetailsDisplay.style.display = 'block';
}

export function hideProfileDetails() {
    profileDetailsDisplay.style.display = 'none';
}

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function getQrFormValues() {
    return {
        text: qrText.value,
        size: parseInt(qrSize.value) || 10,
        fill_color: qrFill.value,
        back_color: qrBack.value,
    };
}

export function displayQrCode(blob) {
    const url = URL.createObjectURL(blob);
    qrImage.src = url;
    qrResult.style.display = 'block';
    // Store the blob URL for download/share
    qrImage.dataset.blobUrl = url;
}

export function hideQrCode() {
    qrResult.style.display = 'none';
    if (qrImage.src) {
        URL.revokeObjectURL(qrImage.src);
    }
}

export function setQrText(value) {
    qrText.value = value;
}

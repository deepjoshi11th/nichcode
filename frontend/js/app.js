/**
 * Main Application Module
 * Orchestrates authentication and UI
 */
import { isAuthenticated, login, signup, logout, getCurrentUser} from "./auth.js";
import { fetchAllData, fetchItem, updateProfileDetails, getProfileDetails, generateQR } from "./api.js";
import { 
    init as initUI, showAuthUI, toggleSignupForm, toggleLoginForm, getLoginFormValues, showError, setUserEmail, showProtectedUI, clearForms, getSignupFormValues, showLoading, displayData, getItemId, getProfileDetailsInput, clearProfileDetailsInput, displayProfileDetails, getQrFormValues, displayQrCode, setQrText,
    showLoginBtn, loginLink, loginFormElement, signupFormElement, logoutBtn, fetchAllDataBtn, fetchItemBtn, itemIdInput, profileDetailsForm, viewProfileDetailsBtn, qrForm, downloadQrBtn, shareWhatsappBtn, pasteBtn, profileDetailsDisplay, qrImage
} from "./ui.js"

async function init() {
    // Initialize UI and attach event listeners
    initUI();
    this.setupEventListeners();

    // Initialize QR code on page load
    this.handleInitQR();

    // Check if user is already logged in
    if (isAuthenticated()) {
        await this.loadUserProfile();
    } else {
        showAuthUI();
    }
}

function setupEventListeners() {
    // Form toggle buttons
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSignupForm();
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLoginForm();
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthUI();
        toggleLoginForm();
    });

    // Form submissions
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
    });

    signupFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup();
    });

    // Logout button
    logoutBtn.addEventListener('click', () => {
        this.handleLogout();
    });

    // Data fetch buttons
    fetchAllDataBtn.addEventListener('click', () => {
        this.fetchAllData();
    });

    fetchItemBtn.addEventListener('click', () => {
        this.fetchItemById();
    });

    // Allow Enter key in item ID input to fetch
    itemIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.fetchItemById();
        }
    });

    // Profile details handlers
    profileDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveProfileDetails();
    });

    viewProfileDetailsBtn.addEventListener('click', () => {
        this.handleViewProfileDetails();
    });

    // QR code handlers
    qrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleGenerateQR();
    });

    downloadQrBtn.addEventListener('click', () => {
        this.handleDownloadQR();
    });

    shareWhatsappBtn.addEventListener('click', () => {
        this.handleShareWhatsApp();
    });

    pasteBtn.addEventListener('click', () => {
        this.pasteFromClipboard();
    });
}

async function handleLogin() {
    const { email, password } = getLoginFormValues();

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const result = await login(email, password);

    if (result.success) {
        setUserEmail(result.user.email);
        showProtectedUI();
        clearForms();
    } else {
        showError(result.error);
    }
}

async function handleSignup() {
    const { email, password, confirmPassword } = getSignupFormValues();

    if (!email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    const result = await signup(email, password, confirmPassword);

    if (result.success) {
        setUserEmail(result.user.email);
        showProtectedUI();
        clearForms();
    } else {
        showError(result.error);
        if (result.error.includes('Check your email')) {
            toggleLoginForm();
        }
    }
}

async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        await logout();
        showAuthUI();
        toggleLoginForm();
        clearForms();
    }
}

async function loadUserProfile() {
    try {
        const user = await getCurrentUser();
        setUserEmail(user.email);
        showProtectedUI();
    } catch (error) {
        // Token is invalid
        showAuthUI();
        showError('Session expired. Please login again.');
    }
}

async function fetchAllData() {
    showLoading();

    try {
        const data = await fetchAllData();
        displayData(data);
    } catch (error) {
        displayData({ error: error.message });
    }
}

async function fetchItemById() {
    const itemId = getItemId();

    if (!itemId) {
        showError('Please enter an item ID');
        return;
    }

    showLoading();

    try {
        const data = await fetchItem(itemId);
        displayData(data);
    } catch (error) {
        displayData({ error: error.message });
    }
}

async function handleSaveProfileDetails() {
    const sensitivePart = getProfileDetailsInput();

    if (!sensitivePart) {
        showError('Please enter profile details');
        return;
    }

    try {
        const result = await updateProfileDetails(sensitivePart);
        if (result.success) {
            showError('Profile details saved successfully!');
            clearProfileDetailsInput();
            // Refresh the display if it's open
            if (profileDetailsDisplay.style.display === 'block') {
                await this.handleViewProfileDetails();
            }
        }
    } catch (error) {
        showError(error.message);
    }
}

async function handleViewProfileDetails() {
    try {
        const result = await getProfileDetails();
        if (result.success) {
            displayProfileDetails(result.data);
        }
    } catch (error) {
        showError(error.message);
    }
}

async function handleGenerateQR() {
    const data = getQrFormValues();

    if (!data.text) {
        showError('Please enter a link');
        return;
    }

    try {
        const blob = await generateQR(data);
        displayQrCode(blob);
    } catch (error) {
        showError(error.message);
    }
}

async function handleInitQR() {
    const data = {
        text: window.location.href,
        size: 10,
        fill_color: "#000000",
        back_color: "#ffffff",
    };

    try {
        const blob = await generateQR(data);
        displayQrCode(blob);
    } catch (error) {
        showError(error.message);
    }
}

function handleDownloadQR() {
    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function handleShareWhatsApp() {
    try {
        // Convert blob to data URL for sharing
        const response = await fetch(qrImage.src);
        const blob = await response.blob();
        const dataUrl = await this.blobToDataURL(blob);
        
        // Try Web Share API first
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], 'qrcode.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'QR Code',
                    text: dataUrl,
                    files: [file],
                });
                return;
            }
        }
        
        // Fallback: Open WhatsApp Web with text
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Check out this QR code! ' + dataUrl)}`;
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        alert('Error sharing to WhatsApp: ' + error.message);
    }
}

function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        setQrText(text);
    } catch (error) {
        alert('Failed to read from clipboard: ' + error.message);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
});

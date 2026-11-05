/**
 * Main Application Module
 * Orchestrates data operations and QR code generation
 */
import { requireAuth } from "./auth-guard.js";
import { fetchAllData as fetchAllDataAPI, fetchItem, updateProfileDetails, getProfileDetails, generateQR } from "./api.js";
import { 
    init as initUI, showError, showLoading, displayData, getItemId, getProfileDetailsInput, clearProfileDetailsInput, displayProfileDetails, getQrFormValues, displayQrCode, setQrText,
    fetchAllDataBtn, fetchItemBtn, itemIdInput, profileDetailsForm, viewProfileDetailsBtn, qrForm, downloadQrBtn, shareWhatsappBtn, pasteBtn, profileDetailsDisplay, qrImage
} from "./ui.js"

async function init() {
    // Ensure user is authenticated, redirect to login if not
    if (!requireAuth()) {
        return;
    }

    // Initialize UI and attach event listeners
    initUI();
    setupEventListeners();

    // Initialize QR code on page load
    handleInitQR();
}

function setupEventListeners() {
    // Data fetch buttons
    var btn = fetchAllDataBtn()
    if (btn) {
        btn.addEventListener('click', () => {
            fetchAllData();
        });
    }

    fetchItemBtn.addEventListener('click', () => {
        fetchItemById();
    });

    // Allow Enter key in item ID input to fetch
    itemIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchItemById();
        }
    });

    // Profile details handlers
    profileDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSaveProfileDetails();
    });

    viewProfileDetailsBtn.addEventListener('click', () => {
        handleViewProfileDetails();
    });

    // QR code handlers
    qrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleGenerateQR();
    });

    downloadQrBtn.addEventListener('click', () => {
        handleDownloadQR();
    });

    shareWhatsappBtn.addEventListener('click', () => {
        handleShareWhatsApp();
    });

    pasteBtn.addEventListener('click', () => {
        pasteFromClipboard();
    });
}



async function fetchAllData() {
    showLoading();

    try {
        const data = await fetchAllDataAPI();
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
                await handleViewProfileDetails();
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
        const dataUrl = await blobToDataURL(blob);
        
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

document.addEventListener('DOMContentLoaded', () => {
    init();
});

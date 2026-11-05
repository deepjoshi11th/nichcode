/**
 * API Module
 * Handles HTTP requests with authentication
 */
import { call } from "./client.js"

export async function fetchAllData() {
    return call('/api/data');
}

export async function fetchItem(itemId) {
    if (!itemId) {
        throw new Error('Item ID is required');
    }
    return call(`/api/items/${itemId}`);
}

export async function getProfileDetails() {
    return call('/api/profile-details');
}

export async function updateProfileDetails(sensitivePart) {
    if (!sensitivePart) {
        throw new Error('Sensitive part is required');
    }
    return call('/api/profile-details', {
        method: 'POST',
        body: JSON.stringify({ sensitive_part: sensitivePart }),
    });
}

export async function generateQR(data) {
    if (!data) {
        throw new Error('Data is required to generate QR code');
    }
    return call('/api/qr', {
        method: 'POST',
        body: JSON.stringify(data),
    }, responseType = 'blob');
}

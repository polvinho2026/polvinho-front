import { request } from './client.js';

export function login(identifier, password) {
    return request('/auth/login', {
        method: 'POST',
        body: {
            identifier: identifier.trim(),
            password
        }
    });
}

export function logout(sessionToken) {
    return request('/auth/logout', {
        method: 'POST',
        token: sessionToken
    });
}

export function changePassword(sessionToken, newPassword) {
    return request('/auth/change-password', {
        method: 'POST',
        token: sessionToken,
        body: {
            newPassword
        }
    });
}

export function forgotPassword(identifier) {
    return request('/auth/forgot-password', {
        method: 'POST',
        body: {
            identifier: identifier.trim()
        }
    });
}

export function resetPassword(resetToken, newPassword) {
    return request('/auth/reset-password', {
        method: 'POST',
        body: {
            token: resetToken,
            newPassword
        }
    });
}
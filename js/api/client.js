import { getToken, clearSession } from '../utils/storage.js';

const BASE_URL = 'http://localhost:3000';

export async function request(
    path,
    { method = 'GET', body, token } = {}
) {
    const headers = {};

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            ...(body !== undefined
                ? { body: JSON.stringify(body) }
                : {})
        });
    } catch {
        throw new Error(
            'Não foi possível conectar ao servidor. Tente novamente.'
        );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            data?.message || 'Não foi possível concluir a solicitação.'
        );

        error.status = response.status;
        error.code = data?.code;

        throw error;
    }

    return data;
}

export async function requestAuthenticated(path, options = {}) {
    const token = getToken();

    if (!token) {
        clearSession();
        window.location.replace('./index.html');

        throw new Error('Entre na sua conta para continuar.');
    }

    try {
        return await request(path, {
            ...options,
            token
        });
    } catch (error) {
        if (error.status === 401 && getToken() === token) {
            clearSession();
            window.location.replace('./index.html');
        }

        throw error;
    }
}
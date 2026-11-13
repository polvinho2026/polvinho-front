import { requestAuthenticated } from './client.js';

export function postUser(newUser) {
    return requestAuthenticated('/users', {
        method: 'POST',
        body: newUser
    });
}

export function getUsers({
    page = 1,
    limit = 20,
    name,
    registration,
    role,
    includeExcluded
} = {}) {
    const query = new URLSearchParams({ page, limit });

    if (name) {
        query.set('name', name);
    }

    if (registration) {
        query.set('registration', registration);
    }

    if (role) {
        query.set('role', role);
    }

    if (includeExcluded !== undefined) {
        query.set('includeExcluded', includeExcluded);
    }

    return requestAuthenticated(`/users?${query}`);
}

export function deleteUser(userId) {
    return requestAuthenticated(
        `/users/${encodeURIComponent(userId)}`,
        { method: 'DELETE' }
    );
}

export function getUserById(userId) {
    return requestAuthenticated(
        `/users/${encodeURIComponent(userId)}`
    );
}

export function putUser(userId, updatedUser) {
    return requestAuthenticated(
        `/users/${encodeURIComponent(userId)}`,
        {
            method: 'PUT',
            body: updatedUser
        }
    );
}
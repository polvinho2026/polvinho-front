import { requestAuthenticated } from './client.js';

export function getDepartments({
    page = 1,
    limit = 20,
    title,
    entity_code
} = {}) {
    const query = new URLSearchParams({ page, limit });

    if (title) {
        query.set('title', title);
    }

    if (entity_code) {
        query.set('entity_code', entity_code);
    }

    return requestAuthenticated(`/departments?${query}`);
}

export function getDepartmentById(departmentId) {
    return requestAuthenticated(
        `/departments/${encodeURIComponent(departmentId)}`
    );
}

export function createDepartment({ title }) {
    return requestAuthenticated('/departments', {
        method: 'POST',
        body: { title }
    });
}

export function deleteDepartment(departmentId) {
    return requestAuthenticated(
        `/departments/${encodeURIComponent(departmentId)}`,
        { method: 'DELETE' }
    );
}
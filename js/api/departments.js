const BASE_URL = 'http://localhost:3000';

export async function getDepartments({ page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams({ page, limit });
    const response = await fetch(`${BASE_URL}/departments?${query}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Não foi possível carregar os departamentos.');
    }

    return response.json();
}

export async function getDepartmentById(departmentId) {
    const response = await fetch(`${BASE_URL}/departments/${departmentId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Não foi possível carregar o departamento.');
    }

    return response.json();
}

export async function createDepartment({ title }) {
    const response = await fetch(`${BASE_URL}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });

    if (!response.ok) {
        let message = 'Não foi possível criar o departamento.';
        try {
            const error = await response.json();
            message = error.message || message;
        } catch {
            // Mantém a mensagem padrão se a resposta não for JSON.
        }
        throw new Error(message);
    }

    return response.json();
}

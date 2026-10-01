const BASE_URL = 'http://localhost:3000'; 

export async function getUsers({
    page = 1,
    limit = 20,
    name,
    registration,
    role,
    includeExcluded
} = {}) {
    const query = new URLSearchParams({ page, limit })

    if (name) query.set('name', name)
    if (registration) query.set('registration', registration)
    if (role) query.set('role', role)
    if (includeExcluded !== undefined) {
        query.set('includeExcluded', includeExcluded)
    }

    const response = await fetch(`${BASE_URL}/users?${query}`)

    if (!response.ok) {
        let message = `Erro ao buscar usuários: ${response.status}`

        try {
            const error = await response.json()
            message = error.message || message
        } catch {
            // Mantém a mensagem padrão quando a API não retorna JSON.
        }

        throw new Error(message)
    }

    return response.json()
}

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }); 

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir o usuário.');
        }
        
        return { message: 'Usuário excluído com sucesso.' }; 
    } catch (error) {
        console.error('Erro na API ao tentar deletar:', error);
        throw error;
    }
};

export async function getUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`);

    if (!response.ok) {
        let message = `Erro ao buscar usuário: ${response.status}`;

        try {
            const error = await response.json();
            message = error.message || message;
        } catch {
            // Mantém a mensagem padrão quando a API não retorna JSON.
        }

        throw new Error(message);
    }

    return response.json();
}
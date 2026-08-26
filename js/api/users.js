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

    const response = await fetch(`http://localhost:3000/users?${query}`)

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

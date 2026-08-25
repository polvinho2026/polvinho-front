const BASE_URL = 'http://localhost:3000'; 

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


export function validateName(name){
    const allNames = name.split(' ');

    if (!allNames[1]) {
        throw new Error('Nome e sobrenome são obrigatórios.');
    };

    if (allNames[0].length <= 3) {
        throw new Error('Nome deve conter 3 ou mais caracteres.');
    };

    return true
}

export function validateRegistration(registration){

    const regex = /^\d{10}$/ 

    if(!regex.test(registration)){
        throw new Error("Matrícula inválida!")
    }

    return true
}

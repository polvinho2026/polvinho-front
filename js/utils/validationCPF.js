export function validationCpf(cpf){

    const regex = /\D/g
    const cpfReplace = cpf.replace(regex, "")

    if(cpfReplace.length !== 11){
        throw new Error("ERRO, CPF inválido.")
    }

    const testeCpfIgual = cpfReplace
        .split("",)
        .every(num => num === cpfReplace[0])

    if(testeCpfIgual){
        throw new Error("ERRO, CPF inválido.")
    }

    let multiplicador = 10
    let soma = 0
    for(let i = 0; i < cpfReplace.length - 2; i++){
        const firstChecker = cpfReplace[i] * multiplicador
        multiplicador -= 1
        soma = firstChecker + soma
    }

    let firstChecker = soma % 11

    if( firstChecker >= 2){
        firstChecker = 11 - firstChecker
    }else{
        firstChecker = 0
    }
    
    if(firstChecker != cpfReplace[9]){
        throw new Error("ERRO, CPF inválido.")
    }

    multiplicador = 11
    soma = 0
    for(let i = 0; i < cpfReplace.length - 1; i++){
        const secondChecker = cpfReplace[i] * multiplicador
        multiplicador -= 1
        soma = secondChecker + soma
    }

    let secondChecker = soma % 11

    if( secondChecker>= 2){
        secondChecker = 11 - secondChecker
    }else{
        secondChecker = 0
    }
    
    if(secondChecker != cpfReplace[10]){
        throw new Error("ERRO, CPF inválido.")
    }

    return true
}


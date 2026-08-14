export function validationCpf(cpf){

    const regex = /\D/g
    const cpfReplace = cpf.replace(regex, "")

    if(cpfReplace.length !== 11){
        throw new Error("ERRO, CPF inválido.")
    }

    const testCpfEqual = cpfReplace
        .split("",)
        .every(num => num === cpfReplace[0])

    if(testCpfEqual){
        throw new Error("ERRO, CPF inválido.")
    }

    let multiplicator = 10
    let sum = 0
    for(let i = 0; i < cpfReplace.length - 2; i++){
        const firstChecker = cpfReplace[i] * multiplicator
        multiplicador -= 1
        sum = firstChecker + soma
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

    multiplicator = 11
    sum = 0
    for(let i = 0; i < cpfReplace.length - 1; i++){
        const secondChecker = cpfReplace[i] * multiplicator
        multiplicador -= 1
        sum = secondChecker + soma
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


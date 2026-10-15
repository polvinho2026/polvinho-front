export function validationCpf(cpf){

    const regex = /\D/g
    const cpfReplace = cpf.replace(regex, "")

    if(cpfReplace.length !== 11){
        return false
    }

    const testeCpfIgual = cpfReplace
        .split("",)
        .every(num => num === cpfReplace[0])

    if(testeCpfIgual){
        return false
    }

    let multiplicator = 10
    let sum = 0
    for(let i = 0; i < cpfReplace.length - 2; i++){
        const firstChecker = cpfReplace[i] * multiplicator
        multiplicator -= 1
        sum = firstChecker + sum
    }

    let firstChecker = sum % 11

    if( firstChecker >= 2){
        firstChecker = 11 - firstChecker
    }else{
        firstChecker = 0
    }
    
    if(firstChecker != cpfReplace[9]){
        return false
    }

    multiplicator = 11
    sum = 0
    for(let i = 0; i < cpfReplace.length - 1; i++){
        const secondChecker = cpfReplace[i] * multiplicator
        multiplicator -= 1
        sum = secondChecker + sum
    }

    let secondChecker = sum % 11

    if( secondChecker>= 2){
        secondChecker = 11 - secondChecker
    }else{
        secondChecker = 0
    }
    
    if(secondChecker != cpfReplace[10]){
        return false
    }

    return true
}


function validationCpf(cpf){

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

    let multiplicador = 10
    let soma = 0
    for(let i = 0; i < cpfReplace.length - 2; i++){
<<<<<<< Updated upstream:js/utils/validationCPF.js
        const firstChecker = cpfReplace[i] * multiplicador
        multiplicador -= 1
        soma = firstChecker + soma
=======
        const firstChecker = cpfReplace[i] * multiplicator
        multiplicator -= 1
        sum = firstChecker + sum
>>>>>>> Stashed changes:src/js/utils/validationCPF.js
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

    multiplicador = 11
    soma = 0
    for(let i = 0; i < cpfReplace.length - 1; i++){
<<<<<<< Updated upstream:js/utils/validationCPF.js
        const secondChecker = cpfReplace[i] * multiplicador
        multiplicador -= 1
        soma = secondChecker + soma
=======
        const secondChecker = cpfReplace[i] * multiplicator
        multiplicator -= 1
        sum = secondChecker + sum
>>>>>>> Stashed changes:src/js/utils/validationCPF.js
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
<<<<<<< Updated upstream:js/utils/validationCPF.js

validationCpf("144.657.679-51")

console.log(validationCpf("144.657.679-51"))
=======
>>>>>>> Stashed changes:src/js/utils/validationCPF.js

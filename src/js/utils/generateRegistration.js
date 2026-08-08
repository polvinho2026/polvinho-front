function generateRegistration(){

    const gerNumRandom = []

    for(let i = 0; i < 10; i++){
        const num = Math.floor(Math.random() * 10) 
        gerNumRandom.push(num)
    }

    return gerNumRandom.join("")
}

console.log(generateRegistration())
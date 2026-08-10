async function buscarDados(){
    try{
        const resposta = await fetch('http://localhost:3000/')
        console.log(resposta)
        const dados = await resposta.json()
        console.log(dados)
    }catch(error){
        console.error(error.message)
    }
}

export default buscarDados() 
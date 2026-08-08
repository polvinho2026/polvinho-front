export function validateDate(date){

    const regex = /^\d{2}\/\d{2}\/\d{4}$/; 

    if(!regex.test(date)){
        throw new Error("Data inválida")
    };

    const dateSplit = date.split("/");

    const dia = parseInt(dateSplit[0]);
    const mes = parseInt(dateSplit[1]);
    const ano = parseInt(dateSplit[2]);

    if(mes < 1 || mes > 12 || ano < 1900 || ano > new Date().getFullYear()){
        throw new Error("Data inválida")
    }

    const dateObjeto = new Date(ano, mes - 1, dia);

    const dateNow = new Date()

    if(dateObjeto.getDate() !== dia || dateObjeto.getMonth() !== mes - 1){
        throw new Error("Data inválida")
    }
    if(dateObjeto > dateNow){
        throw new Error("Data inválida")
    }

}




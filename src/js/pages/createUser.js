import { validateDate } from "../utils/validateDate.js";
import { validateRegistration } from "../utils/validateRegistration.js";
import { generateRegistration } from "../utils/generateRegistration.js";
import { validationCpf } from "../utils/validationCPF.js";
import { dateAmerican } from "../utils/dateAmerican.js";
import { validateName } from "./validateName.js";
import { inputForm } from "../components/inputForm.js";
import { buttonForm } from "../components/buttonForm.js";

export function formCreateUser(){

    const mainContent = document.createElement('main')
    mainContent.classList.add('main-content')

    const header = document.createElement('header')
    header.classList.add('header')
    header.innerHTML = '<img src= "./src/assets/logo.png">'

    const btnExit = buttonForm(
        'btn-exit',
        'submit',
        'btn-exit',
        '<img src= "./src/assets/exit.svg">' 
    )

    const h1Header = document.createElement('h1')
    h1Header.classList.add('h1-header')
    h1Header.innerText = 'Criar'

    const mainForm = document.createElement('form')
    mainForm.classList.add('main-form')

    const ulForm = document.createElement('ul')
    ulForm.className = 'ul-form'
    const liForm = document.createElement('li')

    const hashUser = document.createElement('a')
    hashUser.href= "#Usuários"
    hashUser.innerText = "Usuários"

    const hashDep = document.createElement('a')
    hashDep.href = '#Departamentos'
    hashDep.innerText = 'Departamentos'

    
    const divInputs = document.createElement('div')

    const inputName = inputForm(

        'input-full-name',
        'text',
        'Digite o nome completo',
        'Nome Completo',
        '100'

    )

    const inputEmail = inputForm(

        'register-email',
        'email',
        'exemplo@email.co',
        'email',
        '100'
    )


    const inputDate = inputForm(
        'register-birth',
        'text',
        'dd/mm/yyyy',
        'Data de Nascimento',
        '10'
    )

    const inputRegistration = inputForm(

        'input-num-registration',
        'text',
        '0000000000',
        'Matrícula',
        '10'
    )

    const inputCpf= inputForm(

        'register-cpf',
        'text',
        '000.000.000-00',
        'CPF',
        '14',
        '\d{3}\.\d{3}\.\d{3}-\d{2}'
        
    )


    header.appendChild(btnExit)
    header.appendChild(h1Header)
    mainContent.appendChild(header)

    
    divInputs.appendChild(inputName)
    divInputs.appendChild(inputEmail)
    divInputs.appendChild(inputDate)
    divInputs.appendChild(inputRegistration)
    divInputs.appendChild(inputCpf)

    liForm.appendChild(hashUser)
    liForm.appendChild(hashDep)
    ulForm.appendChild(liForm)
    mainForm.appendChild(ulForm)
    mainForm.appendChild(hashDep)
    mainForm.appendChild(divInputs)
    mainContent.appendChild(mainForm)

    return mainContent
}


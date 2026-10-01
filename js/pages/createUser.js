import { inputForm } from "../components/inputForm.js";
import { buttonForm } from "../components/buttonForm.js";
import { inputRadius } from "../components/inputRadius.js";
import { validateDate } from "../utils/validateDate.js";
import { validateRegistration } from "../utils/validateRegistration.js";
import { validationCpf } from "../utils/validationCPF.js";

export function formCreateUser(){

    const mainContent = document.createElement('main')
    mainContent.classList.add('main-content')

    const header = document.createElement('header')
    header.classList.add('header')

    const divButtonBack = document.createElement(`div`)
    divButtonBack.classList.add(`div-button-back`)

    const btnExit = buttonForm(
        'btn-exit',
        'submit',
        'btn-exit',
        '<img src= "./assets/images/return.svg">' 
    )

    const headerConteudo = document.createElement('div')
    headerConteudo.classList.add('header-conteudo')
    headerConteudo.innerHTML = '<img src= "./assets/images/logo.png">'

    const h1Header = document.createElement('h1')
    h1Header.classList.add('h1-header')
    h1Header.innerText = 'Criar'


    const mainForm = document.createElement('form')
    mainForm.classList.add('main-form')

    const ulForm = document.createElement('ul')
    ulForm.className = 'ul-form'
    const liUser = document.createElement('li')

    const liDep = document.createElement('li')

    const hashUser = document.createElement('a')
    hashUser.href= "#Usuários"
    hashUser.innerText = "Usuário"

    const hashDep = document.createElement('a')
    hashDep.href = '#Departamentos'
    hashDep.innerText = 'Departamento'

    const divForm = document.createElement('div')
    divForm.classList.add('div-form')


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
        'exemplo@email.com',
        'Email',
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

    const divInputGroup = document.createElement('div')
    divInputGroup.classList.add('div-input-group')

    const labelGroup = document.createElement('label')
    labelGroup.classList.add('label-group')
    labelGroup.textContent = 'Papel do Usuário'

    const spanForm = document.createElement('span')
    spanForm.classList.add('required')
    spanForm.textContent = '*'

    const divSelectRole = document.createElement('div')
    divSelectRole.classList.add('div-select-role')

    const inputSelectStudant= inputRadius(
        'input-select-studant',
        'Aluno',
        'student',
        'radio',
        'role'
    )

    const inputSelectCoo = inputRadius(
        'input-select-coo',
        'Coordenadores',
        'coordinator',
        'radio',
        'role'
    )

    const inputSelectProf = inputRadius(
        'input-select-prof',
        'Professor',
        'professor',
        'radio',
        'role'
    )

    const inputSelectAdm = inputRadius(
        'input-select-adm',
        'Administrador',
        'admin',
        'radio',
        'role'
    )

    const btnCreateUser = document.createElement('button')
    btnCreateUser.classList.add('btn-create-user')
    btnCreateUser.type = 'submit'
    btnCreateUser.textContent = 'Crair Usuário'


    headerConteudo.appendChild(h1Header)
    divButtonBack.appendChild(btnExit)
    header.appendChild(divButtonBack)
    header.appendChild(headerConteudo)
    mainContent.appendChild(header)

    
    divForm.appendChild(inputName)
    divForm.appendChild(inputEmail)
    divForm.appendChild(inputDate)
    divForm.appendChild(inputRegistration)
    divForm.appendChild(inputCpf)

    liUser.appendChild(hashUser)
    liDep.appendChild(hashDep)
    ulForm.appendChild(liUser)
    ulForm.appendChild(liDep)

    divSelectRole.appendChild(inputSelectStudant)
    divSelectRole.appendChild(inputSelectCoo)
    divSelectRole.appendChild(inputSelectProf)
    divSelectRole.appendChild(inputSelectAdm)

    labelGroup.appendChild(spanForm)
    divInputGroup.appendChild(labelGroup)
    divInputGroup.appendChild(divSelectRole)


   
    mainForm.appendChild(ulForm)
    divForm.appendChild(divInputGroup)
    divForm.appendChild(btnCreateUser)
    mainForm.appendChild(divForm)
    mainContent.appendChild(mainForm)

    mainForm.addEventListener('submit', (event)=>{
        event.preventDefault()

        const user = inputName.value
        const email = inputEmail.value
        const cpf = inputCpf.value
        const date = inputDate.value
        const registration = inputRegistration.value

        try{
            if(validationCpf(cpf) === false){
                throw new Error('CPF inválido')
            }
            validateDate(date)
            validateRegistration(registration)
        }catch(erro){
            alert(erro.message)
        }
    })


    return mainContent
}




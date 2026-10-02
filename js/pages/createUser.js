import { inputForm } from "../components/inputForm.js";
import { buttonForm } from "../components/buttonForm.js";
import { inputRadius } from "../components/inputRadius.js";
import { validateDate } from "../utils/validateDate.js";
import { validateRegistration } from "../utils/validateRegistration.js";
import { validationCpf } from "../utils/validationCPF.js";
import { validationName } from "../utils/validationName.js";
import { dateAmerican } from "../utils/dateAmerican.js";
import { postUser } from "../api/users.js";
import { updateUrl } from "../core/router.js";


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
    btnExit.addEventListener('click', (e) =>{
        e.preventDefault()
        updateUrl('/usuarios')
    })

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
    hashUser.classList.add('active')

    const hashDep = document.createElement('a')
    hashDep.addEventListener('click', (e) => {
        e.preventDefault()
        updateUrl('criar-departamento')
    })
    hashDep.innerText = 'Departamento'
    hashDep.classList.add('cursor')

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
        
    )

    let cpfSubString = inputCpf.querySelector('input')
    cpfSubString.addEventListener('input', (e)=>{
        let replaceCpf = cpfSubString.value.replace(/\D/g, '')
        let formattedCpf = replaceCpf
        if(replaceCpf.length > 9){
            formattedCpf =
            replaceCpf.substring(0, 3) + '.' +
            replaceCpf.substring(3, 6) + '.' +
            replaceCpf.substring(6, 9) + '-' +
            replaceCpf.substring(9, 11);
        }else if(replaceCpf.length > 6){
            formattedCpf =
            replaceCpf.substring(0, 3) + '.' +
            replaceCpf.substring(3, 6) + '.' +
            replaceCpf.substring(6, 9)
        } else if (replaceCpf.length > 3){
            formattedCpf =
            replaceCpf.substring(0, 3) + '.' +
            replaceCpf.substring(3, 6)
        }
       
        e.target.value = formattedCpf
    })

    let dateSubstring = inputDate.querySelector('input')
    dateSubstring.addEventListener('input', (e)=>{
        let replaceDate = dateSubstring.value.replace(/\D/g, '')
        let formattedDate = replaceDate
        if(replaceDate.length > 4){
            formattedDate =
            replaceDate.substring(0, 2) + '/' +
            replaceDate.substring(2, 4) + '/'+
            replaceDate.substring(4, 8)

        }else if(replaceDate.length > 2){
            formattedDate = 
            replaceDate.substring(0, 2) + '/' +
            replaceDate.substring(2, 4)
        }

        e.target.value = formattedDate
    })

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

    mainForm.addEventListener('submit', async (event)=>{
        event.preventDefault()

        try{
            const user = inputName.querySelector('#input-full-name').value
            const email = inputEmail.querySelector('#register-email').value
            const cpf = inputCpf.querySelector('#register-cpf').value
            const date = inputDate.querySelector('#register-birth').value
            const registration = inputRegistration.querySelector('#input-num-registration').value

            const role = document.querySelector('input[name="role"]:checked')
            const roleChecked = role ? role.value : null;


            if (user === "" || email === "" ||cpf === "" || date === "" || registration === "" || roleChecked === null){
                throw new Error('Todos os campos devem ser preenchidos.')
            }
            if(validationCpf(cpf) === false){
                throw new Error('CPF inválido.')
            }
            const regex = /\D/g
            const cpfReplace = cpf.replace(regex, "")
            
            validateRegistration(registration)
            validateDate(date)
            validationName(user)

            const newUser = {
            name: user,
            email: email,
            cpf: cpfReplace, 
            birth_date: dateAmerican(date),
            registration: registration,
            role: roleChecked,
            password: registration
        }

            await postUser(newUser)

            const messageSuccess = document.createElement('div')
            messageSuccess.textContent = 'Usuário criado com sucesso!'
            messageSuccess.classList.add('message-success')

            document.body.appendChild(messageSuccess)

            setTimeout(()=> {
                messageSuccess.classList.add('show');
            }, 10)

            setTimeout(()=> {
                messageSuccess.classList.remove('show')

                setTimeout(()=>{
                    messageSuccess.remove()
                }, 500)

            }, 3000)

            mainForm.reset()

        }catch(error){
            alert(error.message)
        }

    })

    return mainContent
}




//import { generateRegistration } from "../utils/generateRegistration";
import { getUserById } from "../api/users.js";
import { createDefaultButton } from "../components/defaultButton.js";
import { inputRadius } from "../components/inputRadius.js";
import { inputForm } from "../components/inputForm.js";
import { dateBrazil } from "../utils/dateBrazil.js";
import { putUser } from "../api/users.js";
import { generateRegistration } from "../utils/generateRegistration.js";
import { validationCpf } from "../utils/validationCPF.js";
import { validateDate } from "../utils/validateDate.js";
import { dateAmerican } from "../utils/dateAmerican.js";
import { validateRegistration } from "../utils/validateRegistration.js";
import { validationName } from "../utils/validationName.js";
import { buttonForm } from "../components/buttonForm.js";
import { updateUrl } from "../core/router.js";

export async function editUser() {

    const userId = localStorage.getItem('idUserEdit');
    const page = document.createElement('main');
    page.classList.add('user-details-page');

    const header = document.createElement('header')
    header.classList.add('header-edit')

    const divButtonBack = document.createElement(`div`)
    divButtonBack.classList.add(`div-btn-back`)

    const btnExit = buttonForm(
        'btn-exit',
        'submit',
        'btn-exit',
        '<img src= "./assets/images/return.svg">' 
    )
    btnExit.addEventListener('click', (e) =>{
        e.preventDefault()
        console.log('cliquei aqui')
        updateUrl('/usuarios')
        
    })
    
    const userData = await getUserById(userId);
    const profileImageContainer = document.createElement('div');
    profileImageContainer.classList.add('details-profile-image');

    const profileImg = document.createElement('img');
    profileImg.src = 'assets/images/user-profile-placeholder.png'; 
    profileImg.style.width = '100%';
    profileImg.style.height = '100%';
    profileImageContainer.appendChild(profileImg)

    divButtonBack.appendChild(btnExit)
    header.appendChild(divButtonBack)
    header.appendChild(profileImageContainer)



    const card = document.createElement('div');
    card.classList.add('details-card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('details-card-header');

    const headerTitle = document.createElement('h3');
    headerTitle.textContent = `${userData.name} - ${userData.course}`; 
    cardHeader.appendChild(headerTitle);

    const cardBody = document.createElement('div');
    cardBody.classList.add('details-card-body');

    const fieldName = inputForm(
        'input-full-name',
        'text',
        '',
        'Nome Completo',
        '100',
        null,
        false,
        userData.name);
    const fieldEmail = inputForm('register-mail', 
        'text',
        '',
        'Email',
        '100',
        null,
        false,
        userData.email);
    const fieldBirthDate = inputForm('register-birth', 
        'text',
        '',
        'Data de Nascimento',
        '10',
        null,
        false,
        dateBrazil(userData.birth_date));
    
    const divRegistration = document.createElement('div')
    divRegistration.classList.add('div-registration')

    const fieldRegistration = inputForm('input-num-registration',
        'text',
        '',
        'Matrícula',
        '10',
        null,
        false,
        userData.registration);

    const btnRegistration = createDefaultButton({title: 'Gerar Matrícula', size: 'medium', color: 'blue'})
        btnRegistration.addEventListener('click', (e)=>{
            e.preventDefault()
            const randomRegistration = generateRegistration()
            document.querySelector('#input-num-registration').value = randomRegistration
        })
    divRegistration.appendChild(fieldRegistration)
    divRegistration.appendChild(btnRegistration)

    const fieldCpf = inputForm('register-cpf',
        'text',
        '',
        'CPF',
        '14',
        null,
        false,
        userData.cpf);

    let cpfSubString = fieldCpf.querySelector('input')
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

    let dateSubstring = fieldBirthDate.querySelector('input')
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
    const fieldRole = createIndicatorField('Papel do Usuário', userData.role);

    
    const currentDisciplines = userData.currentDisciplines || [];
    const previousDisciplines = userData.previousDisciplines || [];

    
    const currentDisciplinesSection = createDisciplineList('Disciplinas Atuais', currentDisciplines);
    const previousDisciplinesSection = createDisciplineList('Disciplinas Anteriores', previousDisciplines);


    cardBody.append(fieldName, fieldEmail, fieldBirthDate, divRegistration, fieldCpf, fieldRole, currentDisciplinesSection, previousDisciplinesSection);

    const cardActions = document.createElement('div');
    cardActions.classList.add('details-card-actions');

    const editButton = createDefaultButton({
        title: 'Salvar Edição',
        size: 'medium',
        color: 'edit', 
        borderRadius: 'border-radius-rounded',
        icon: 'assets/images/edit.svg'
    });
    editButton.type = 'submit'
    editButton.addEventListener('click', async (e) =>{
        e.preventDefault()

        try{
            const user = fieldName.querySelector('#input-full-name').value
            const email = fieldEmail.querySelector('#register-mail').value
            const date = fieldBirthDate.querySelector('#register-birth').value
            const registration = fieldRegistration.querySelector('#input-num-registration').value
            const cpf = fieldCpf.querySelector('#register-cpf').value

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
    
                const updateUser = {
                name: user,
                email: email,
                cpf: cpfReplace, 
                birth_date: dateAmerican(date),
                registration: registration,
                role: roleChecked,
                password: registration
            }

            await putUser(userId, updateUser)

            alert('Edição feita com sucesso!')

        }catch(error){
            alert(error.message)
        }

    })

        cardActions.append(editButton);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardActions);
        page.appendChild(header);
        page.appendChild(card);

    return page;
}
 

function createIndicatorField(title, userRole) {
    const divInputGroup = document.createElement('div')
    divInputGroup.classList.add('div-input-group')

    const labelGroup = document.createElement('label')
    labelGroup.classList.add('label-group')
    labelGroup.textContent = title

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
        'role',
        userRole === 'student'
    )

    const inputSelectCoo = inputRadius(
        'input-select-coo',
        'Coordenadores',
        'coordinator',
        'radio',
        'role',
        userRole === 'coordinator'
    )

    const inputSelectProf = inputRadius(
        'input-select-prof',
        'Professor',
        'professor',
        'radio',
        'role',
        userRole === 'professor'
    )

    const inputSelectAdm = inputRadius(
        'input-select-adm',
        'Administrador',
        'admin',
        'radio',
        'role',
        userRole === 'admin'
    )

    
    divSelectRole.appendChild(inputSelectStudant)
    divSelectRole.appendChild(inputSelectCoo)
    divSelectRole.appendChild(inputSelectProf)
    divSelectRole.appendChild(inputSelectAdm)
    labelGroup.appendChild(spanForm)
    divInputGroup.appendChild(labelGroup)
    divInputGroup.appendChild(divSelectRole)

    return divInputGroup;
}

function createDisciplineList(title, disciplines = []) {
    const container = document.createElement('div');
    container.classList.add('disciplines-container');

    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    container.appendChild(titleElement);

   
    if (disciplines.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Nenhuma disciplina encontrada.';
        emptyMsg.classList.add('empty-message');
        container.appendChild(emptyMsg);
        return container;
    }

    const list = document.createElement('div');
    list.classList.add('disciplines-list'); 

    
    disciplines.forEach(disc => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('indicator-wrapper');
        wrapper.classList.add('field-input');

        const dot = document.createElement('span');
        dot.classList.add('blue-dot');

        const text = document.createElement('span');
        text.textContent = disc;

        wrapper.appendChild(dot);
        wrapper.appendChild(text);
        list.appendChild(wrapper);
    });

    container.appendChild(list);
    return container;
}
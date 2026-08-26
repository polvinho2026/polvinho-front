export function inputForm(id, type, placeholder,classlist, maxlehght, pattern){
    
    const inputText = document.createElement("input")
    inputText.id = id
    inputText.type = type
    inputText.placeholder = placeholder
    inputText.classList.add("classList")
    inputText.maxLength = maxlehght
    inputText.pattern = pattern

    return inputText
}

export function inputEmailForm(){
    const registerEmail = document.createElement("div")
    registerEmail.classList.add("register-email")

    const inputEmail = document.createElement("input")
    inputEmail.id = "register-email"
    inputEmail.type = "email"
    inputEmail.placeholder = "exemplo@email.com"
    inputEmail.classList.add("input-email")

    registerEmail.appendChild(inputEmail)

    return registerEmail
}

export function InputDateBirth(){
    const registerDateBirth = document.createElement("div")
    registerDateBirth.classList.add("register-date-birth")

    const inputDate = document.createElement("input")
    inputDate.id = "Input-birth"
    inputDate.type = "text"
    inputDate.placeholder = "dd/mm/yyyy"
    inputDate.classList.add("input-date-birth")

    registerDateBirth.appendChild(inputDate)

    return registerDateBirth
}

export function inputRegistration(){
    const registration = document.createElement("div")
    registration.classList.add("registration")

    const inputRegistration = document.createElement("input")
    inputRegistration.id = "input-registration"
    inputRegistration.type = "text"
    inputRegistration.maxLength = "10"
    inputRegistration.placeholder = "0000000000"
    inputRegistration.classList.add("input-num-register")

    registration.appendChild(inputRegistration)

    return registration
}

export function inputCpfForm(){
    const divCPF = document.createElement("div")
    divCPF.classList.add("cpf")

    const inputCPF = document.createElement("input")
    inputCPF.id = "input-cpf"
    inputCPF.type = "text"
    inputCPF.maxLength = "14"
    inputCPF.pattern = "\d{3}\.\d{3}\.\d{3}-\d{2}"
    inputCPF.placeholder = "000.000.000-00"
    inputCPF.classList.add("input-num-cpf")

    divCPF.appendChild(inputCPF)

    return divCPF
}

export function inputSelectRole(){
    const divRole = document.createElement("div")
    divRole.classList.add("select-role")

    const inputCheckRole = document.createElement("input")
    inputCheckRole.id = "input-role"
    inputCheckRole.type = "checkbox"
    inputCheckRole.classList.add("inpt-check-role")

    divRole.appendChild(inputCheckRole)

    return divRole
}

export function buttonSidebar(type, innerText, classList, innerHTML){
    const divButtonSidebar = document.createElement("div")
    divButtonSidebar.classList.add("div-btn-sidebar")

    const btnSidebar = document.createElement("button")
    btnSidebar.type = "submit"
    btnSidebar.innerText = "Criar"
    btnSidebar.classList.add("btn-sidebar")

    divButtonSidebar.appendChild(btnSidebar)

    return divButtonSidebar
}

export function btnSelectEntity(){
    const divBtnEntity = document.createElement("div")
    divBtnEntity.classList.add("div-btn-select")

    const btnSelect = document.createElement("button")
    btnSelect.type = "submit"
    btnSelect.innerText = "Usuários"
    btnSelect.classList.add("btn-select-entity")

    divBtnEntity.appendChild(btnSelect)

    return divBtnEntity
}

export function buttonForm(){
    const divButtonForm = document.createElement("div")
    divButtonForm.classList.add("div-btn-form")

    const btnForm = document.createElement("button")
    btnForm.type = "submit"
    btnForm.innerText = "Criar Usuário"
    btnForm.classList.add("btn-form-create")

    divButtonForm.appendChild(btnForm)

    return divButtonForm
}

export function btnExitSidebar(){
    const divBtnExit = document.createElement("div")
    divBtnExit.classList.add("div-btn-exit")

    const btnExit = document.createElement("button")
    btnExit.type = "submit"
    btnExit.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45  
                        0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 
                        10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#334155"/>
                        </svg>`
    btnExit.innerText = "Sair"
    btnExit.classList.add("btn-exit")

    divBtnExit.appendChild(btnExit)

    return divBtnExit
}
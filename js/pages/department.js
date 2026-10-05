import { createDefaultButton } from '../components/defaultButton.js'
import { createIconButton } from '../components/iconButton.js'
import { updateUrl } from '../core/router.js'
import { createDepartment, getDepartments } from '../api/departments.js'
import { createListTable } from '../components/listTable.js'

export async function renderDepartmentsPage(userLogged) {
    const departments = await getDepartments()
    const page = document.createElement('main')
    page.classList.add('departments-page')

    const header = document.createElement('header')
    header.classList.add('page-header')
    const logo = document.createElement('img')
    logo.src = 'assets/images/logo.png'
    logo.alt = 'Polvinho'
    const heading = document.createElement('h2')
    heading.textContent = 'Departamentos'
    header.append(logo, heading)

    const content = document.createElement('div')
    content.classList.add('content')
    const card = document.createElement('section')
    card.classList.add('users-card')

    if (userLogged.role === 'administrador') {
        const toolbar = document.createElement('div')
        toolbar.classList.add('users-card-buttons')
        const createButton = createDefaultButton({ title: 'Criar', color: 'blue', size: 'small' })
        createButton.addEventListener('click', () => updateUrl('/criar-departamento'))
        toolbar.appendChild(createButton)
        card.appendChild(toolbar)
    }

    const table = createListTable({
        columns: [
            { key: 'entity_code', title: 'CÓDIGO', width: '1fr' },
            { key: 'title', title: 'TÍTULO', width: '2fr' },
            {
                title: 'AÇÕES', width: '0.5fr',
                render: department => {
                    const button = createIconButton({ icon: 'assets/images/visualize.svg', size: 'small' })
                    button.setAttribute('aria-label', `Visualizar ${department.title}`)
                    button.addEventListener('click', () => {
                        localStorage.setItem('visualizeDepartmentId', department.id)
                        updateUrl('/detalhe-departamento')
                    })
                    return button
                }
            }
        ],
        data: departments.data,
        pagination: departments.pagination,
        emptyMessage: 'Nenhum departamento encontrado.',
        onPageChange: async page => {
            table.update(await getDepartments({ page, limit: departments.pagination.limit }))
        }
    })
    card.appendChild(table)
    content.appendChild(card)
    page.append(header, content)
    return page
}

export function renderCreateDepartmentPage() {
    const page = document.createElement('main')
    page.classList.add('create-department-page')
    page.setAttribute('aria-labelledby', 'create-department-title')

    const content = document.createElement('div')
    content.classList.add('create-department-content')

    const backButton = createIconButton({
        icon: 'assets/images/arrow-left.svg',
        size: 'small'
    })
    backButton.type = 'button'
    backButton.classList.add('create-department-back')
    backButton.setAttribute('aria-label', 'Voltar para departamentos')
    backButton.addEventListener('click', () => updateUrl('/departamentos'))

    const header = document.createElement('header')
    header.classList.add('create-department-header')
    const logo = document.createElement('img')
    logo.src = 'assets/images/logo.png'
    logo.alt = 'Polvinho'
    const heading = document.createElement('h1')
    heading.id = 'create-department-title'
    heading.textContent = 'Criar'
    header.append(logo, heading)

    const card = document.createElement('section')
    card.classList.add('create-department-card')
    card.setAttribute('aria-label', 'Criar departamento')

    const tabs = document.createElement('div')
    tabs.classList.add('create-department-tabs')
    const userTab = createDefaultButton({ title: 'Usuário', color: 'white' })
    userTab.type = 'button'
    userTab.disabled = true
    userTab.title = 'Criação de usuários ainda não disponível'
    const departmentTab = createDefaultButton({ title: 'Departamento', color: 'white' })
    departmentTab.type = 'button'
    departmentTab.classList.add('is-active')
    departmentTab.setAttribute('aria-current', 'page')
    tabs.append(userTab, departmentTab)

    const form = document.createElement('form')
    form.classList.add('create-department-form')

    const nameField = createDepartmentField({
        name: 'title',
        label: 'Nome do Departamento',
        placeholder: 'Digite o nome do departamento',
        maxLength: 100
    })

    const feedback = document.createElement('p')
    feedback.classList.add('create-department-feedback')
    feedback.setAttribute('role', 'status')
    feedback.hidden = true

    const submitButton = createDefaultButton({
        title: 'Criar Departamento',
        size: 'medium',
        color: 'blue'
    })
    submitButton.type = 'submit'
    submitButton.classList.add('create-department-submit')

    form.addEventListener('submit', async event => {
        event.preventDefault()
        if (submitButton.disabled) return
        nameField.input.value = nameField.input.value.trim()
        if (!form.reportValidity()) return

        feedback.hidden = true
        submitButton.disabled = true
        submitButton.textContent = 'Criando...'
        try {
            await createDepartment({ title: nameField.input.value })
            updateUrl('/departamentos')
        } catch (error) {
            feedback.textContent = error.message || 'Não foi possível criar o departamento.'
            feedback.hidden = false
        } finally {
            submitButton.disabled = false
            submitButton.textContent = 'Criar Departamento'
        }
    })

    form.append(nameField.container, feedback, submitButton)
    card.append(tabs, form)
    content.append(backButton, header, card)
    page.appendChild(content)
    return page
}

function createDepartmentField({ name, label, placeholder, maxLength }) {
    const container = document.createElement('div')
    container.classList.add('create-department-field')
    const labelElement = document.createElement('label')
    labelElement.htmlFor = `department-${name}`
    labelElement.textContent = label
    const required = document.createElement('span')
    required.textContent = ' *'
    required.setAttribute('aria-hidden', 'true')
    labelElement.appendChild(required)

    const input = document.createElement('input')
    input.id = labelElement.htmlFor
    input.name = name
    input.type = 'text'
    input.placeholder = placeholder
    input.maxLength = maxLength
    input.required = true
    container.append(labelElement, input)
    return { container, input }
}

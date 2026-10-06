import { createDefaultButton } from '../components/defaultButton.js'
import { createIconButton } from '../components/iconButton.js'
import { updateUrl } from '../core/router.js'
import { createDepartment, getDepartments } from '../api/departments.js'
import { createListTable } from '../components/listTable.js'
import { createSelectionInfo } from '../components/selectionInfo.js'
import { createSelectionButtons } from '../components/selectionButtons.js'

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

    
    const searchBox = document.createElement('div')
    searchBox.classList.add('search-input-box')
    const searchImage = document.createElement('img')
    searchImage.src = 'assets/images/search.svg'
    const searchInput = document.createElement('input')
    searchInput.classList.add('search-input-default')
    searchInput.type = 'search'
    searchInput.placeholder = 'Pesquisar'
    searchBox.append(searchImage, searchInput)

    const card = document.createElement('section')
    card.classList.add('users-card')

    const toolbar = document.createElement('div')
    toolbar.classList.add('users-card-buttons')

    const toolbarFirstSession = document.createElement('div')
    toolbarFirstSession.classList.add('users-card-button-first-session')

    if (userLogged.role === 'administrador') {
        const createButton = createDefaultButton({ title: 'Criar', color: 'blue', size: 'small' })
        createButton.addEventListener('click', () => updateUrl('/criar-departamento'))
        toolbarFirstSession.appendChild(createButton)
    }

    const toolbarSecondSession = document.createElement('div')
    toolbarSecondSession.classList.add('users-card-button-second-session')

    
    const selectionInfo = createSelectionInfo()
    const selectedDepartments = new Set()
    toolbarSecondSession.appendChild(selectionInfo)

    toolbar.append(toolbarFirstSession, toolbarSecondSession)
    card.appendChild(toolbar)

    
    const selectionButtons = createSelectionButtons()

    function updateSelection() {
        const count = selectedDepartments.size
        selectionInfo.updateCounter(count)
        selectionButtons.updateSelection(count)
        selectionInfo.cleanButton.disabled = count === 0
    }

    
    const table = createListTable({
        columns: [
            { key: 'title', title: 'TÍTULO', width: '2fr' },
            { key: 'entity_code', title: 'CÓDIGO', width: '1fr' },
            {
                title: 'AÇÕES', width: '0.5fr',
                render: department => {
                    const rowButtons = document.createElement('div')
                    
                    rowButtons.classList.add('department-row-actions')

                    const visualizeButton = createIconButton({ icon: 'assets/images/visualize.svg', size: 'small' })
                    visualizeButton.setAttribute('aria-label', `Visualizar ${department.title}`)
                    visualizeButton.addEventListener('click', () => {
                        localStorage.setItem('visualizeDepartmentId', department.id)
                        updateUrl('/detalhe-departamento')
                    })

                    const selectInput = document.createElement('input')
                    selectInput.type = 'checkbox'
                    selectInput.classList.add('select-input')
                    selectInput.checked = selectedDepartments.has(department.id)
                    selectInput.setAttribute('aria-label', `Selecionar ${department.title}`)
                    selectInput.addEventListener('change', (event) => {
                        if (event.target.checked) selectedDepartments.add(department.id)
                        else selectedDepartments.delete(department.id)
                        updateSelection()
                    })

                    rowButtons.append(visualizeButton, selectInput)
                    return rowButtons
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

    
    selectionInfo.cleanButton.addEventListener('click', () => {
        selectedDepartments.clear()
        table.querySelectorAll('.select-input').forEach(input => input.checked = false)
        updateSelection()
    })

    updateSelection()
    card.appendChild(table)

   
    content.append(searchBox, card, selectionButtons)
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

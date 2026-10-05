import { getDepartmentById } from '../api/departments.js'
import { createDefaultButton } from '../components/defaultButton.js'
import { createIconButton } from '../components/iconButton.js'
import { createListTable } from '../components/listTable.js'
import { createUserProfileImage } from '../components/userProfileImage.js'
import { createFilterModal } from '../components/filterModal.js'
import { createSelectionInfo } from '../components/selectionInfo.js'
import { createSelectionButtons } from '../components/selectionButtons.js'
import { updateUrl } from '../core/router.js'

export async function renderDepartmentDetailsPage(userLogged) {
    const page = document.createElement('main')
    page.classList.add('department-details-page')

    const content = document.createElement('div')
    content.classList.add('department-details-content')

    const backButton = createIconButton({ icon: 'assets/images/arrow-left.svg', size: 'small' })
    backButton.setAttribute('aria-label', 'Voltar para departamentos')
    backButton.addEventListener('click', () => updateUrl('/departamentos'))

    const header = document.createElement('header')
    header.classList.add('department-details-header')
    const title = document.createElement('h1')
    title.textContent = 'Departamento'
    header.append(backButton, title)
    content.appendChild(header)
    page.appendChild(content)

    if (!['administrador', 'coordenador'].includes(userLogged.role)) {
        const message = document.createElement('p')
        message.textContent = 'Não autorizado. Apenas administradores e coordenadores podem visualizar departamentos.'
        content.appendChild(message)
        return page
    }

    const departmentId = localStorage.getItem('visualizeDepartmentId')
    if (!departmentId) {
        const message = document.createElement('p')
        message.textContent = 'Erro: Departamento não selecionado.'
        content.appendChild(message)
        return page
    }

    try {
        const department = await getDepartmentById(departmentId)
        const info = document.createElement('section')
        info.classList.add('department-details-info')
        const text = document.createElement('div')
        const name = document.createElement('h2')
        name.textContent = department.title
        const code = document.createElement('p')
        code.textContent = department.entity_code
        text.append(name, code)
        const logo = document.createElement('img')
        logo.src = 'assets/images/logo.png'
        logo.alt = 'Polvinho'
        info.append(text, logo)

        const card = document.createElement('section')
        card.classList.add('department-details-card')
        const tabs = document.createElement('div')
        tabs.classList.add('department-details-tabs')
        tabs.setAttribute('role', 'tablist')
        tabs.setAttribute('aria-label', 'Listagens do departamento')

        const coursesTab = createDefaultButton({ title: 'Cursos', color: 'white' })
        const usersTab = createDefaultButton({ title: 'Usuários', color: 'white' })
        const coursesPanel = document.createElement('div')
        const usersPanel = createDepartmentUsersPanel(department.users)
        coursesPanel.classList.add('department-details-panel')

        const coursesList = document.createElement('div')
        coursesList.classList.add('department-list-area', 'department-courses-list')
        const coursesToolbar = document.createElement('div')
        coursesToolbar.classList.add('department-list-toolbar')
        coursesToolbar.appendChild(createDepartmentSearch('Pesquisar curso'))

        const coursesTable = createListTable({
            columns: [
                { key: 'entity_code', title: 'CÓDIGO', width: '1fr' },
                { key: 'title', title: 'TÍTULO', width: '2fr' },
                { title: '', width: '0.5fr' }
            ],
            hideSinglePagePagination: true,
            emptyMessage: 'Esse departamento não possui cursos.'
        })
        coursesList.append(coursesToolbar, coursesTable)
        const coursesActions = createSelectionButtons()
        coursesActions.editButton.title = 'Edição de cursos ainda não disponível'
        coursesActions.deleteButton.title = 'Exclusão de cursos ainda não disponível'
        coursesPanel.append(coursesList, coursesActions)

        const tabEntries = [
            { tab: coursesTab, panel: coursesPanel, id: 'courses' },
            { tab: usersTab, panel: usersPanel, id: 'users' }
        ]

        function selectTab(selectedTab) {
            tabEntries.forEach(({ tab, panel }) => {
                const active = tab === selectedTab
                tab.classList.toggle('is-active', active)
                tab.setAttribute('aria-selected', String(active))
                tab.tabIndex = active ? 0 : -1
                panel.hidden = !active
            })
        }

        tabEntries.forEach(({ tab, panel, id }, index) => {
            tab.id = `department-${id}-tab`
            tab.type = 'button'
            tab.setAttribute('role', 'tab')
            tab.setAttribute('aria-controls', `department-${id}-panel`)
            panel.id = `department-${id}-panel`
            panel.setAttribute('role', 'tabpanel')
            panel.setAttribute('aria-labelledby', tab.id)
            tab.addEventListener('click', () => selectTab(tab))
            tab.addEventListener('keydown', event => {
                let nextIndex
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') nextIndex = 1 - index
                if (event.key === 'Home') nextIndex = 0
                if (event.key === 'End') nextIndex = 1
                if (nextIndex === undefined) return
                event.preventDefault()
                const nextTab = tabEntries[nextIndex].tab
                selectTab(nextTab)
                nextTab.focus()
            })
        })

        selectTab(coursesTab)
        tabs.append(coursesTab, usersTab)
        card.append(tabs, coursesPanel, usersPanel)
        content.append(info, card)
    } catch (error) {
        const message = document.createElement('p')
        message.classList.add('create-department-feedback')
        message.setAttribute('role', 'alert')
        message.textContent = error.message || 'Não foi possível carregar o departamento.'
        content.appendChild(message)
    }

    return page
}

function createDepartmentUsersPanel(users = []) {
    const panel = document.createElement('div')
    panel.classList.add('department-details-panel')
    let search = ''
    let roles = []
    const limit = 20
    const selectedUsers = new Set()
    const selectionInfo = createSelectionInfo()
    const selectionButtons = createSelectionButtons()
    selectionButtons.editButton.title = 'Edição de usuários ainda não disponível nesta tela'
    selectionButtons.deleteButton.title = 'Exclusão de usuários ainda não disponível nesta tela'

    function updateSelection() {
        selectionInfo.updateCounter(selectedUsers.size)
        selectionInfo.cleanButton.disabled = selectedUsers.size === 0
    }

    const listArea = document.createElement('div')
    listArea.classList.add('department-list-area')

    const toolbar = document.createElement('div')
    toolbar.classList.add('department-list-toolbar', 'department-users-toolbar')
    const createButton = createDefaultButton({ title: 'Criar usuário', size: 'small', color: 'blue' })
    createButton.disabled = true
    createButton.title = 'Criação de usuários ainda não disponível'
    const tools = document.createElement('div')
    tools.classList.add('department-list-tools')
    const filterContainer = document.createElement('div')
    filterContainer.classList.add('filter-menu-container')
    const filterButton = createIconButton({ icon: 'assets/images/filter.svg', size: 'medium' })
    filterButton.setAttribute('aria-label', 'Filtrar usuários por papel')
    const filterModal = createFilterModal({
        sessions: [{
            name: 'role', title: 'Papel', filters: [
                { title: 'Administrador', value: 'admin' },
                { title: 'Coordenador', value: 'coordinator' },
                { title: 'Professor', value: 'professor' },
                { title: 'Aluno', value: 'student' }
            ]
        }],
        onFilter: filters => {
            roles = filters.role
            refreshTable()
        }
    })
    filterButton.addEventListener('click', filterModal.open)
    filterContainer.append(filterButton, filterModal)

    const searchBox = createDepartmentSearch('Pesquisar usuário', value => {
        search = value.trim().toLocaleLowerCase('pt-BR')
        refreshTable()
    })
    tools.append(filterContainer, searchBox)
    toolbar.append(createButton, tools)
    const selectionBar = document.createElement('div')
    selectionBar.classList.add('department-selection-bar')
    selectionBar.appendChild(selectionInfo)

    function getPage(page = 1) {
        const filtered = users.filter(user =>
            [user.name, user.email, user.registration].some(value =>
                value.toLocaleLowerCase('pt-BR').includes(search)
            ) && (roles.length === 0 || roles.includes(user.role))
        )
        return {
            data: filtered.slice((page - 1) * limit, page * limit),
            pagination: { page, totalPages: Math.max(1, Math.ceil(filtered.length / limit)) }
        }
    }

    const table = createListTable({
        columns: [
            { title: '', width: '0.5fr', render: () => createUserProfileImage({ size: 'small' }) },
            {
                title: 'NOME', width: '2fr', render: user => {
                    const container = document.createElement('div')
                    container.classList.add('name-email')
                    const name = document.createElement('p')
                    name.textContent = user.name
                    const email = document.createElement('p')
                    email.textContent = user.email
                    container.append(name, email)
                    return container
                }
            },
            { key: 'registration', title: 'MATRÍCULA', width: '1fr' },
            {
                title: '', width: '0.75fr', render: user => {
                    const actions = document.createElement('div')
                    actions.classList.add('department-row-actions')
                    const button = createIconButton({ icon: 'assets/images/visualize.svg', size: 'small' })
                    button.setAttribute('aria-label', `Visualizar ${user.name}`)
                    button.addEventListener('click', () => {
                        localStorage.setItem('visualizeUserId', user.id)
                        updateUrl('/detalhe-usuario')
                    })
                    const checkbox = document.createElement('input')
                    checkbox.type = 'checkbox'
                    checkbox.classList.add('select-input')
                    checkbox.checked = selectedUsers.has(user.id)
                    checkbox.setAttribute('aria-label', `Selecionar ${user.name}`)
                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) selectedUsers.add(user.id)
                        else selectedUsers.delete(user.id)
                        updateSelection()
                    })
                    actions.append(button, checkbox)
                    return actions
                }
            }
        ],
        ...getPage(),
        hideSinglePagePagination: true,
        emptyMessage: users.length ? 'Nenhum usuário encontrado.' : 'Esse departamento não possui usuários.',
        onPageChange: page => table.update(getPage(page))
    })

    function refreshTable() {
        table.update(getPage())
    }

    selectionInfo.cleanButton.addEventListener('click', () => {
        selectedUsers.clear()
        table.querySelectorAll('.select-input').forEach(input => { input.checked = false })
        updateSelection()
    })
    updateSelection()
    listArea.append(toolbar, selectionBar, table)
    panel.append(listArea, selectionButtons)
    return panel
}

function createDepartmentSearch(placeholder, onSearch = () => {}) {
    const searchBox = document.createElement('div')
    searchBox.classList.add('search-input-box')
    const icon = document.createElement('img')
    icon.src = 'assets/images/search.svg'
    icon.alt = ''
    const input = document.createElement('input')
    input.classList.add('search-input-default')
    input.type = 'search'
    input.placeholder = placeholder
    input.setAttribute('aria-label', placeholder)
    input.addEventListener('input', () => onSearch(input.value))
    searchBox.append(icon, input)
    return searchBox
}

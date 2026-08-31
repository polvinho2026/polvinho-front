import { createDefaultButton } from "../components/defaultButton.js";
import { createIconButton } from "../components/iconButton.js";
import { createListTable } from "../components/listTable.js";
import { createSelectionButtons } from "../components/selectionButtons.js";
import { createSelectionInfo } from "../components/selectionInfo.js";
import { createUserProfileImage } from "../components/userProfileImage.js";
import { getUsers, deleteUser } from "../api/users.js";
import { createFilterModal } from "../components/filterModal.js";

export function renderUsersPage(userLogged, usersResponse) {

    const usersPage = document.createElement('main')

    const pageHeader = document.createElement('div')
    pageHeader.classList.add('page-header')

    const logo = document.createElement('img')
    logo.src = 'assets/images/logo.png'

    const pageTitle = document.createElement('h2')
    pageTitle.innerText = 'Usuários'

    pageHeader.appendChild(logo)
    pageHeader.appendChild(pageTitle)

    const content = document.createElement('div')
    content.classList.add('content')

    const searchBox = document.createElement('div')
    searchBox.classList.add('search-input-box')

    const searchImage = document.createElement('img')
    searchImage.src = 'assets/images/search.svg'

    const searchInput = document.createElement('input')
    searchInput.classList.add('search-input-default')
    searchInput.type = 'search'
    searchInput.name = 'search-input'
    searchInput.placeholder = 'Pesquisar usuário'

    searchBox.appendChild(searchImage)
    searchBox.appendChild(searchInput)

    const usersCard = document.createElement('div')
    usersCard.classList.add('users-card')

    const usersCardButtons = document.createElement('div')
    usersCardButtons.classList.add('users-card-buttons')

    const usersCardButtonsFirstSession = document.createElement('div')
    usersCardButtonsFirstSession.classList.add('users-card-button-first-session')

    if(userLogged.role === 'administrador') {
        const createUserButton = createDefaultButton({
            title: 'Criar usuário',
            size: 'small',
            color: 'blue',
            borderRadius: 'border-radius-rounded'
        })
        usersCardButtonsFirstSession.appendChild(createUserButton)
    }

    const usersCardButtonsSecondSession = document.createElement('div')
    usersCardButtonsSecondSession.classList.add('users-card-button-second-session')

    const filterUsersButton = createIconButton({icon: 'assets/images/filter.svg', size: 'medium'})

    const filterMenuContainer = document.createElement('div')
    filterMenuContainer.classList.add('filter-menu-container')
    filterMenuContainer.appendChild(filterUsersButton)

    const selectionInfo = createSelectionInfo()
    const selectedUsers = new Set()
    const selectionButtons = createSelectionButtons()

    function updateSelection() {
        const selectionCount = selectedUsers.size
        selectionInfo.updateCounter(selectionCount)
        selectionButtons.updateSelection(selectionCount)
        selectionInfo.cleanButton.disabled = selectionCount === 0
    }

    usersCardButtonsSecondSession.appendChild(filterMenuContainer)
    usersCardButtonsSecondSession.appendChild(selectionInfo)

    usersCardButtons.appendChild(usersCardButtonsFirstSession)
    usersCardButtons.appendChild(usersCardButtonsSecondSession)

    const columns = [
        {
            key: 'profileImage',
            title: '',
            width: '0.5fr',
            render: user => {
                return createUserProfileImage({
                    src: user.profileImage,
                    size: 'small'
                })
            }
        },
        {
            key: 'user',
            title: 'NOME',
            width: '2fr',
            render: user => {
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
        {
            key: 'role',
            title: 'PAPEL',
            width: '1fr'
        },
        {
            key: 'registration',
            title: 'MATRÍCULA',
            width: '1fr'
        },
        {
            key: 'actions',
            title: 'AÇÕES',
            width: '0.5fr',
            render: user => {
                const rowButtons = document.createElement('div')
                rowButtons.classList.add('row-buttons')

                const visualizeButton = document.createElement('button')
                visualizeButton.classList.add('visualize-button')

                const visualizeIcon = document.createElement('img')
                visualizeIcon.src = 'assets/images/visualize.svg'

                visualizeButton.appendChild(visualizeIcon)

                const selectInput = document.createElement('input')
                selectInput.type = 'checkbox'
                selectInput.name = 'select-input'
                selectInput.classList.add('select-input')
                selectInput.checked = selectedUsers.has(user.id)
                selectInput.setAttribute('aria-label', `Selecionar ${user.name}`)

                selectInput.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        selectedUsers.add(user.id)
                    } else {
                        selectedUsers.delete(user.id)
                    }

                    updateSelection()
                })

                rowButtons.appendChild(visualizeButton)
                rowButtons.appendChild(selectInput)

                return rowButtons
            }
        }
    ]


    const usersTable = createListTable({
        columns,
        data: usersResponse.data,
        pagination: usersResponse.pagination,
        visibleRows: 4,
        onPageChange: async (page) => {
            const response = await getUsers({
                page,
                limit: usersResponse.pagination.limit
            })

            usersTable.update(response)
        }
    })

    selectionInfo.cleanButton.addEventListener('click', () => {
        selectedUsers.clear()
        usersTable.querySelectorAll('.select-input').forEach(input => {
            input.checked = false
        })
        updateSelection()
    })

    const deleteButton = selectionButtons.querySelector('.red');

    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            if (selectedUsers.size === 0) return;

            const confirmacao = confirm(`Tem certeza que deseja excluir ${selectedUsers.size} usuário(s)?`);

            if (confirmacao) {
                try {
                    for (const user of selectedUsers) {
                        await deleteUser(user.id);
                }

                alert('Usuários excluídos com sucesso!');
                window.location.reload();

                } catch (error) {
                    alert('Erro ao excluir usuário. Verifique a conexão com o backend.');
                }
            }
        });
    }

    const filterSessions = [
        {
            name: 'role',
            title: 'Papel',
            filters: [
                {title: 'Administrador', value: 'admin'},
                {title: 'Coordenador', value: 'coordinator'},
                {title: 'Professor', value: 'professor'},
                {title: 'Aluno', value: 'student'},
            ]
        },
        {
            name: 'status',
            title: 'Status',
            filters: [
                {title: 'Ativos', value: 'active', buttonType: 'radio'},
                {title: 'Excluídos', value: 'excluded', buttonType: 'radio'},
            ]
        }
    ]

    const filterModal = createFilterModal({sessions: filterSessions})

    filterUsersButton.addEventListener('click', filterModal.open)
    filterMenuContainer.appendChild(filterModal)

    usersCard.appendChild(usersCardButtons)
    usersCard.appendChild(usersTable)

    updateSelection()

    content.appendChild(searchBox)
    content.appendChild(usersCard)
    content.appendChild(selectionButtons)

    usersPage.appendChild(pageHeader)
    usersPage.appendChild(content)

    return usersPage
}

import { createIconButton } from "./iconButton.js"
import { createUserProfileImage } from "./userProfileImage.js"
import { createDefaultButton } from "./defaultButton.js"

export function createSidebar(user = {}) {
    const aside = document.createElement('aside')
    aside.classList.add('aside-default')

    const asideHeader = document.createElement('div')
    asideHeader.classList.add('aside-header')

    const toggleSideBar = createIconButton({icon: 'assets/images/menuButton.svg', size: 'medium'})

    toggleSideBar.addEventListener('click', () => {
        aside.classList.toggle('collapsed-sidebar')
    })

    asideHeader.appendChild(toggleSideBar)

    const asideUserInfo = document.createElement('div')
    asideUserInfo.classList.add('aside-user-info')

    const userInfoAvatar = createUserProfileImage({
        src: user.profileImage,
        size: 'large',
        border: true
    })

    const userInfoMessage = document.createElement('h2')
    userInfoMessage.innerText = `Olá, ${user.name}!`

    const userInfoRole = document.createElement('p')
    userInfoRole.innerText = `(${user.role})` ?? '(aluno)'

    asideUserInfo.appendChild(userInfoAvatar)
    asideUserInfo.appendChild(userInfoMessage)
    asideUserInfo.appendChild(userInfoRole)

    const asideNavigationMenu = document.createElement('div')
    asideNavigationMenu.classList.add('aside-navigation-menu')

    const allMenuItems = [
        {
            label: 'Início',
            selected: false,
            roles: ['administrador', 'coordenador', 'professor', 'aluno']
        },
        {
            label: 'Usuários',
            selected: false,
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Departamentos',
            selected: false,
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Cursos',
            selected: false,
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Disciplinas',
            selected: false,
            roles: ['administrador', 'coordenador', 'professor', 'aluno']
        },
    ]

    const menuItems = allMenuItems.filter(item => item.roles.includes(user.role))

    let currentSelectedButton = null

    menuItems.forEach(item => {

        const button = createDefaultButton({
            title: item.label,
            size: 'medium',
            color: 'white'
        })

        if (item.selected) {
            button.classList.add('blue')
            button.classList.remove('white')
            currentSelectedButton = button
        }

        asideNavigationMenu.appendChild(button)

        button.addEventListener('click', () => {
            if (currentSelectedButton) {
                currentSelectedButton.classList.remove('blue')
                currentSelectedButton.classList.add('white')
            }

            button.classList.add('blue')
            button.classList.remove('white')
            currentSelectedButton = button
        })
    })

    const asideFooter = document.createElement('div')
    asideFooter.classList.add('aside-footer')

    const createButton = createDefaultButton({title: 'Criar', size: 'medium', color: 'blue'})

    const logoutButton = createDefaultButton({
        title: 'Sair',
        size: 'medium',
        color: 'transparent',
        icon: 'assets/images/logout.svg',
        iconPosition: 'before'
    })

    asideFooter.appendChild(createButton)
    asideFooter.appendChild(logoutButton)

    aside.appendChild(asideHeader)
    aside.appendChild(asideUserInfo)
    aside.appendChild(asideNavigationMenu)
    aside.appendChild(asideFooter)

    return aside
}

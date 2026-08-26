import { createIconButton } from "./iconButton.js"
import { createUserProfileImage } from "./userProfileImage.js"
import { createDefaultButton } from "./defaultButton.js"
import { getCurrentRoutePath, updateUrl } from "../core/router.js"

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
            path: '/',
            roles: ['administrador', 'coordenador', 'professor', 'aluno']
        },
        {
            label: 'Usuários',
            path: '/usuarios',
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Departamentos',
            path: '/departamentos',
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Cursos',
            path: '/cursos',
            roles: ['administrador', 'coordenador']
        },
        {
            label: 'Disciplinas',
            path: '/disciplinas',
            roles: ['administrador', 'coordenador', 'professor', 'aluno']
        },
    ]

    const menuItems = allMenuItems.filter(item => item.roles.includes(user.role))

    const buttonsByPath = new Map()

    menuItems.forEach(item => {

        const button = createDefaultButton({
            title: item.label,
            size: 'medium',
            color: 'white'
        })

        asideNavigationMenu.appendChild(button)
        buttonsByPath.set(item.path, button)

        button.addEventListener('click', (event) => {
            event.preventDefault()
            updateUrl(item.path)
        })
    })

    function updateSelectedButton() {
        const currentPath = getCurrentRoutePath()

        buttonsByPath.forEach((button, path) => {
            const isSelected = path === currentPath
            button.classList.toggle('blue', isSelected)
            button.classList.toggle('white', !isSelected)
        })
    }

    window.addEventListener('hashchange', updateSelectedButton)
    updateSelectedButton()

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

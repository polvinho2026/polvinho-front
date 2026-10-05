import { createIconButton } from "./iconButton.js"
import { createUserProfileImage } from "./userProfileImage.js"
import { createDefaultButton } from "./defaultButton.js"
import { getCurrentRoutePath, updateUrl } from "../core/router.js"

export function createSidebar(user = {}) {
    const aside = document.createElement('aside')
    aside.classList.add('aside-default')
    const mobileScreen = window.matchMedia('(max-width: 48rem)')

    const asideHeader = document.createElement('div')
    asideHeader.classList.add('aside-header')

    const toggleSideBar = createIconButton({icon: 'assets/images/menuButton.svg', size: 'medium'})
    toggleSideBar.type = 'button'
    toggleSideBar.setAttribute('aria-controls', 'sidebar-content')

    function setCollapsed(collapsed) {
        aside.classList.toggle('collapsed-sidebar', collapsed)
        toggleSideBar.setAttribute('aria-expanded', String(!collapsed))
        toggleSideBar.setAttribute('aria-label', collapsed ? 'Abrir menu' : 'Recolher menu')
    }

    toggleSideBar.addEventListener('click', () => {
        setCollapsed(!aside.classList.contains('collapsed-sidebar'))
    })
    setCollapsed(mobileScreen.matches)
    mobileScreen.addEventListener('change', event => setCollapsed(event.matches))

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
    userInfoRole.innerText = `(${user.role ?? 'aluno'})`

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
            if (mobileScreen.matches) setCollapsed(true)
        })
    })

    function updateSelectedButton() {
        const currentPath = getCurrentRoutePath()

        buttonsByPath.forEach((button, path) => {
            const isSelected = path === currentPath ||
                (path === '/departamentos' && currentPath === '/detalhe-departamento')
            button.classList.toggle('blue', isSelected)
            button.classList.toggle('white', !isSelected)
        })
    }

    window.addEventListener('hashchange', updateSelectedButton)
    updateSelectedButton()

    const asideFooter = document.createElement('div')
    asideFooter.classList.add('aside-footer')

    const createButton = createDefaultButton({title: 'Criar', size: 'medium', color: 'blue'})
    createButton.addEventListener('click', () => {
        updateUrl('/criar-departamento')
        if (mobileScreen.matches) setCollapsed(true)
    })

    const logoutButton = createDefaultButton({
        title: 'Sair',
        size: 'medium',
        color: 'transparent',
        icon: 'assets/images/logout.svg',
        iconPosition: 'before'
    })

    asideFooter.appendChild(createButton)
    asideFooter.appendChild(logoutButton)

    const sidebarContent = document.createElement('div')
    sidebarContent.id = 'sidebar-content'
    sidebarContent.classList.add('aside-content')
    sidebarContent.append(asideUserInfo, asideNavigationMenu, asideFooter)
    aside.append(asideHeader, sidebarContent)

    return aside
}

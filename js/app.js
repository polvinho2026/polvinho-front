import { renderUsersPage } from "./pages/users.js"
import { createSidebar } from "./components/sidebar.js"
import { getUsers } from "./api/users.js"
import { startRouter } from "./core/router.js"
import { renderUserDetailsPage } from "./pages/userDetails.js";
import { renderCreateDepartmentPage, renderDepartmentsPage } from "./pages/department.js"

const app = document.getElementById('app')

const user = {
    name: "Ramiro",
    email: "ramiro@gmail.com",
    role: "administrador",
}

async function startApp() {
    const sidebarElement = createSidebar(user)
    app.appendChild(sidebarElement)

    const pageContent = document.createElement('div')
    pageContent.classList.add('page-content')
    app.appendChild(pageContent)

    const routes = {
        '/': () => {
            const home = document.createElement('main')
            home.textContent = 'Página inicial'
            return home
        },
        '/usuarios': async () => {
            const users = await getUsers()
            return renderUsersPage(user, users)
        },

       '/detalhe-usuario': async () => {
            return await renderUserDetailsPage(user);
        },

        '/criar-departamento': () => renderCreateDepartmentPage(),
        '/departamentos': () => renderDepartmentsPage(),

        '*': () => {
            const notFound = document.createElement('main')
            notFound.textContent = 'Página não encontrada'
            return notFound
        }
    }

    startRouter(routes, async (route) => {
        pageContent.replaceChildren()

        try {
            const page = await route()
            pageContent.appendChild(page)
        } catch (error) {
            console.error(error)

            const errorMessage = document.createElement('p')
            errorMessage.textContent = 'Não foi possível carregar esta página.'
            pageContent.appendChild(errorMessage)
        }
    })
}

startApp()

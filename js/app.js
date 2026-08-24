import { renderUsersPage } from "./pages/users.js"
import { createSidebar } from "./components/sidebar.js"

const app = document.getElementById('app')

const user = {
    name: "Ramiro",
    email: "ramiro@gmail.com",
    role: "administrador",
}

const sidebarElement = createSidebar(user)
const usersPage = renderUsersPage(user)

app.appendChild(sidebarElement)
app.appendChild(usersPage)

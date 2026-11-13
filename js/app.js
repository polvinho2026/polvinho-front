import { renderUsersPage } from './pages/users.js';
import { createSidebar } from './components/sidebar.js';
import { getUsers } from './api/users.js';
import { startRouter } from './core/router.js';
import { renderUserDetailsPage } from './pages/userDetails.js';
import {renderCreateDepartmentPage, renderDepartmentsPage} from './pages/department.js';
import { formCreateUser } from './pages/createUser.js';
import { editUser } from './pages/editUser.js';
import {renderDepartmentDetailsPage} from './pages/departmentDetails.js';
import { getSession } from './utils/storage.js';

const app = document.getElementById('app');

async function startApp() {
    const session = getSession();

    if (!session || session.requiresPasswordChange) {
        window.location.replace('./index.html');
        return;
    }

    const roleLabels = {
        admin: 'administrador',
        coordinator: 'coordenador',
        professor: 'professor',
        student: 'aluno'
    };

    const user = {
        ...session.user,
        apiRole: session.user.role,
        role: roleLabels[session.user.role]
    };

    const sidebarElement = createSidebar(user);
    app.appendChild(sidebarElement);

    const pageContent = document.createElement('div');
    pageContent.classList.add('page-content');
    app.appendChild(pageContent);

    const routes = {
        '/': () => {
            const home = document.createElement('main');
            home.textContent = 'Página inicial';
            return home;
        },

        '/criar-usuario': () => formCreateUser(),

        '/usuarios': async () => {
            const users = await getUsers();
            return renderUsersPage(user, users);
        },

        '/detalhe-usuario': async () => {
            return await renderUserDetailsPage(user);
        },

        '/editar-usuario': async () => {
            return await editUser();
        },

        '/criar-departamento': () => renderCreateDepartmentPage(),

        '/departamentos': () => renderDepartmentsPage(user),

        '/detalhe-departamento': () => {
            return renderDepartmentDetailsPage(user);
        },

        '*': () => {
            const notFound = document.createElement('main');
            notFound.textContent = 'Página não encontrada';
            return notFound;
        }
    };

    startRouter(routes, async (route) => {
        pageContent.replaceChildren();

        try {
            const page = await route();
            pageContent.appendChild(page);
        } catch (error) {
            console.error(error);

            const errorMessage = document.createElement('p');
            errorMessage.textContent =
                'Não foi possível carregar esta página.';

            pageContent.appendChild(errorMessage);
        }
    });
}

startApp();
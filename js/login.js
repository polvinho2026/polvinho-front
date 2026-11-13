import { renderLoginPage } from './pages/login.js';
import { renderChangePasswordPage } from './pages/changePassword.js';
import { renderForgotPasswordPage } from './pages/forgotPassword.js';
import { renderResetPasswordPage } from './pages/resetPassword.js';
import { getSession, clearSession } from './utils/storage.js';
import { logout } from './api/auth.js';

const app = document.getElementById('app');

function openApp() {
    window.location.replace('./app.html');
}

async function exitAccount() {
    const session = getSession();

    try {
        if (session) {
            await logout(session.token);
        }
    } catch {
        console.error(
            'Não foi possível confirmar o encerramento no servidor.'
        );
    } finally {
        clearSession();
        window.location.replace('./index.html');
    }
}

function finishPasswordReset() {
    // Exige um novo login neste navegador após a recuperação.
    clearSession();

    // Retira o token do endereço após a confirmação do backend.
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('token');
    cleanUrl.hash = '';

    window.history.replaceState(null, '', cleanUrl.href);
}

function startLogin() {
    const params = new URLSearchParams(window.location.search);

    // O link de recuperação tem prioridade sobre uma sessão existente.
    if (
        params.has('token') ||
        window.location.hash === '#/redefinir-senha'
    ) {
        const resetPage = renderResetPasswordPage({
            token: params.get('token') || '',
            onPasswordReset: finishPasswordReset
        });

        app.replaceChildren(resetPage);
        return;
    }

    const session = getSession();

    if (session?.requiresPasswordChange) {
        const passwordPage = renderChangePasswordPage({
            onPasswordChanged: openApp,
            onLogout: exitAccount
        });

        app.replaceChildren(passwordPage);
        return;
    }

    if (session) {
        openApp();
        return;
    }

    if (window.location.hash === '#/recuperar-senha') {
        app.replaceChildren(renderForgotPasswordPage());
        return;
    }

    const loginPage = renderLoginPage({
        onLogin: () => {
            startLogin();
        }
    });

    app.replaceChildren(loginPage);
}

window.addEventListener('hashchange', startLogin);

startLogin();
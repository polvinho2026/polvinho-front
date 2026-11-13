import { changePassword } from '../api/auth.js';
import { getSession, saveSession } from '../utils/storage.js';

export function renderChangePasswordPage({
    onPasswordChanged = () => {},
    onLogout = () => {}
} = {}) {
    const page = document.createElement('main');
    page.className = 'auth-page';

    page.innerHTML = `
        <section class="auth-card" aria-labelledby="password-title">
            <img
                class="auth-logo"
                src="assets/images/logo.png"
                alt="Polvinho"
            >

            <h1 id="password-title">Defina sua nova senha</h1>

            <p class="auth-description">
                Este é seu primeiro acesso.
                Substitua a senha inicial para continuar.
            </p>

            <form class="auth-form">
                <label class="auth-field" for="new-password">
                    <span>Nova senha</span>
                    <input
                        id="new-password"
                        type="password"
                        autocomplete="new-password"
                        aria-describedby="password-rules"
                        required
                    >
                </label>

                <p id="password-rules" class="auth-description">
                    Use pelo menos 8 caracteres, uma letra
                    maiúscula e um caractere especial.
                </p>

                <label class="auth-field" for="confirm-password">
                    <span>Confirmar nova senha</span>
                    <input
                        id="confirm-password"
                        type="password"
                        autocomplete="new-password"
                        required
                    >
                </label>

                <p
                    class="auth-feedback"
                    role="status"
                    aria-live="polite"
                    hidden
                ></p>

                <button class="auth-submit" type="submit">
                    Salvar senha e continuar
                </button>

                <button class="auth-link" type="button" id="exit-account">
                    Sair desta conta
                </button>
            </form>
        </section>
    `;

    const form = page.querySelector('form');
    const passwordInput = page.querySelector('#new-password');
    const confirmationInput = page.querySelector('#confirm-password');
    const submitButton = page.querySelector('.auth-submit');
    const exitButton = page.querySelector('#exit-account');
    const feedback = page.querySelector('.auth-feedback');

    exitButton.addEventListener('click', async () => {
        exitButton.disabled = true;

        try {
            await onLogout();
        } finally {
            exitButton.disabled = false;
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (submitButton.disabled || !form.reportValidity()) {
            return;
        }

        feedback.hidden = true;
        feedback.dataset.type = 'error';

        const newPassword = passwordInput.value;
        const confirmation = confirmationInput.value;

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[^a-zA-Z0-9]/.test(newPassword)
        ) {
            feedback.textContent =
                'Use pelo menos 8 caracteres, uma letra maiúscula e um caractere especial.';
            feedback.hidden = false;
            return;
        }

        if (newPassword !== confirmation) {
            feedback.textContent = 'As senhas não coincidem.';
            feedback.hidden = false;
            confirmationInput.focus();
            return;
        }

        const session = getSession();

        if (!session) {
            await onLogout();
            return;
        }

        submitButton.disabled = true;
        exitButton.disabled = true;
        submitButton.textContent = 'Salvando...';
        form.setAttribute('aria-busy', 'true');

        try {
            await changePassword(session.token, newPassword);

            // Só libera a interface após a confirmação do backend.
            saveSession({
                ...session,
                requiresPasswordChange: false
            });

            form.reset();

            await onPasswordChanged();
        } catch (error) {
            if (error.status === 401) {
                await onLogout();
                return;
            }

            feedback.textContent =
                error.message || 'Não foi possível alterar a senha.';
            feedback.hidden = false;
        } finally {
            submitButton.disabled = false;
            exitButton.disabled = false;
            submitButton.textContent = 'Salvar senha e continuar';
            form.removeAttribute('aria-busy');
        }
    });

    return page;
}
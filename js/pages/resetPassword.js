import { resetPassword } from '../api/auth.js';

export function renderResetPasswordPage({
    token,
    onPasswordReset = () => {}
} = {}) {
    const page = document.createElement('main');
    page.className = 'auth-page';

    page.innerHTML = `
        <section class="auth-card" aria-labelledby="reset-title">
            <img
                class="auth-logo"
                src="assets/images/logo.png"
                alt="Polvinho"
            >

            <h1 id="reset-title">Redefinir senha</h1>

            <p class="auth-description">
                Defina uma nova senha para sua conta.
            </p>

            <form class="auth-form">
                <label class="auth-field" for="reset-password">
                    <span>Nova senha</span>

                    <input
                        id="reset-password"
                        name="newPassword"
                        type="password"
                        autocomplete="new-password"
                        aria-describedby="reset-rules"
                        required
                    >
                </label>

                <p id="reset-rules" class="auth-description">
                    Use pelo menos 8 caracteres, uma letra
                    maiúscula e um caractere especial.
                </p>

                <label class="auth-field" for="reset-confirmation">
                    <span>Confirmar nova senha</span>

                    <input
                        id="reset-confirmation"
                        name="confirmation"
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
                    Salvar nova senha
                </button>

                <a
                    class="auth-link"
                    href="./index.html#/recuperar-senha"
                    id="request-new-link"
                >
                    Solicitar outro link
                </a>

                <a class="auth-link" href="./index.html">
                    Voltar para o login
                </a>
            </form>
        </section>
    `;

    const form = page.querySelector('form');
    const passwordInput = page.querySelector('#reset-password');
    const confirmationInput = page.querySelector('#reset-confirmation');
    const submitButton = page.querySelector('.auth-submit');
    const feedback = page.querySelector('.auth-feedback');
    const requestNewLink = page.querySelector('#request-new-link');

    let completed = false;

    function showError(message) {
        feedback.dataset.type = 'error';
        feedback.textContent = message;
        feedback.hidden = false;
    }

    // Seu backend gera tokens com 64 caracteres hexadecimais.
    const validFormat =
        typeof token === 'string' &&
        /^[a-f0-9]{64}$/i.test(token);

    if (!validFormat) {
        showError(
            'O link está incompleto ou inválido. Solicite outro link.'
        );

        passwordInput.disabled = true;
        confirmationInput.disabled = true;
        submitButton.disabled = true;

        return page;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (
            completed ||
            submitButton.disabled ||
            !form.reportValidity()
        ) {
            return;
        }

        feedback.hidden = true;

        const newPassword = passwordInput.value;
        const confirmation = confirmationInput.value;

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[^a-zA-Z0-9]/.test(newPassword)
        ) {
            showError(
                'Use pelo menos 8 caracteres, uma letra maiúscula ' +
                'e um caractere especial.'
            );
            passwordInput.focus();
            return;
        }

        if (newPassword !== confirmation) {
            showError('As senhas não coincidem.');
            confirmationInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';
        form.setAttribute('aria-busy', 'true');

        try {
            await resetPassword(token, newPassword);

            if (!page.isConnected) {
                return;
            }

            completed = true;
            form.reset();

            passwordInput.disabled = true;
            confirmationInput.disabled = true;
            submitButton.textContent = 'Senha redefinida';
            requestNewLink.hidden = true;

            feedback.dataset.type = 'success';
            feedback.textContent =
                'Senha redefinida com sucesso! ' +
                'Clique em “Voltar para o login” e entre com a nova senha.';
            feedback.hidden = false;

            onPasswordReset();
        } catch (error) {
            if (page.isConnected) {
                showError(
                    error.message ||
                    'Não foi possível redefinir a senha. Tente novamente.'
                );
            }
        } finally {
            form.removeAttribute('aria-busy');

            if (!completed) {
                submitButton.disabled = false;
                submitButton.textContent = 'Salvar nova senha';
            }
        }
    });

    return page;
}
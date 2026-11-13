import { login } from '../api/auth.js';
import { saveSession } from '../utils/storage.js';

export function renderLoginPage({ onLogin = () => {} } = {}) {
    const page = document.createElement('main');
    page.className = 'auth-page';

    page.innerHTML = `
        <section class="auth-card" aria-labelledby="login-title">
            <img
                class="auth-logo"
                src="assets/images/logo.png"
                alt="Polvinho"
            >

            <h1 id="login-title">Entrar no Polvinho</h1>

            <p class="auth-description">
                Informe seu e-mail ou CPF e sua senha.
            </p>

            <form class="auth-form">
                <label class="auth-field" for="login-identifier">
                    <span>E-mail ou CPF</span>

                    <input
                        id="login-identifier"
                        name="identifier"
                        type="text"
                        autocomplete="username"
                        autocapitalize="none"
                        spellcheck="false"
                        placeholder="Digite seu e-mail ou CPF"
                        required
                    >
                </label>

                <label class="auth-field" for="login-password">
                    <span>Senha</span>

                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        placeholder="Digite sua senha"
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
                    Entrar
                </button>

                <a class="auth-link" href="#/recuperar-senha">
                    Esqueci minha senha
                </a>
            </form>
        </section>
    `;

    const form = page.querySelector('form');
    const identifierInput = page.querySelector('#login-identifier');
    const passwordInput = page.querySelector('#login-password');
    const submitButton = page.querySelector('.auth-submit');
    const feedback = page.querySelector('.auth-feedback');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (submitButton.disabled || !form.reportValidity()) {
            return;
        }

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;

        feedback.hidden = true;
        feedback.dataset.type = 'error';

        if (!identifier) {
            feedback.textContent = 'Informe seu e-mail ou CPF.';
            feedback.hidden = false;
            identifierInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
        form.setAttribute('aria-busy', 'true');

        try {
            const result = await login(identifier, password);

            // Evita atualizar uma tela que já foi abandonada.
            if (!page.isConnected) {
                return;
            }

            saveSession(result);
            passwordInput.value = '';

            feedback.dataset.type = 'success';
            feedback.textContent = result.requiresPasswordChange
                ? 'Login confirmado. Você precisa definir uma nova senha.'
                : 'Login realizado com sucesso.';
            feedback.hidden = false;

            await onLogin(result);
        } catch (error) {
            if (page.isConnected) {
                feedback.textContent =
                    error.message || 'Não foi possível entrar. Tente novamente.';

                feedback.dataset.type = 'error';
                feedback.hidden = false;
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
            form.removeAttribute('aria-busy');
        }
    });

    return page;
}
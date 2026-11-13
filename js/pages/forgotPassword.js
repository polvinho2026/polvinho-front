import { forgotPassword } from '../api/auth.js';

export function renderForgotPasswordPage() {
    const page = document.createElement('main');
    page.className = 'auth-page';

    page.innerHTML = `
        <section class="auth-card" aria-labelledby="forgot-title">
            <img
                class="auth-logo"
                src="assets/images/logo.png"
                alt="Polvinho"
            >

            <h1 id="forgot-title">Recuperar senha</h1>

            <p class="auth-description">
                Informe seu e-mail ou CPF. Se houver uma conta
                cadastrada, enviaremos as instruções para o
                e-mail vinculado a ela.
            </p>

            <form class="auth-form">
                <label class="auth-field" for="forgot-identifier">
                    <span>E-mail ou CPF</span>

                    <input
                        id="forgot-identifier"
                        name="identifier"
                        type="text"
                        autocomplete="username"
                        autocapitalize="none"
                        spellcheck="false"
                        placeholder="Digite seu e-mail ou CPF"
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
                    Enviar link de recuperação
                </button>

                <a class="auth-link" href="#/">
                    Voltar para o login
                </a>
            </form>
        </section>
    `;

    const form = page.querySelector('form');
    const identifierInput = page.querySelector('#forgot-identifier');
    const submitButton = page.querySelector('.auth-submit');
    const feedback = page.querySelector('.auth-feedback');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (submitButton.disabled || !form.reportValidity()) {
            return;
        }

        const identifier = identifierInput.value.trim();

        feedback.hidden = true;
        feedback.dataset.type = 'error';

        if (!identifier) {
            feedback.textContent = 'Informe seu e-mail ou CPF.';
            feedback.hidden = false;
            identifierInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Solicitando...';
        form.setAttribute('aria-busy', 'true');

        try {
            await forgotPassword(identifier);

            if (!page.isConnected) {
                return;
            }

            feedback.dataset.type = 'success';
            feedback.textContent =
                'Se houver uma conta cadastrada com esses dados, ' +
                'você receberá um e-mail com as instruções. ' +
                'Confira também a pasta de spam.';
            feedback.hidden = false;
        } catch (error) {
            if (page.isConnected) {
                feedback.dataset.type = 'error';
                feedback.textContent =
                    error.message ||
                    'Não foi possível solicitar a recuperação.';
                feedback.hidden = false;
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar link de recuperação';
            form.removeAttribute('aria-busy');
        }
    });

    return page;
}
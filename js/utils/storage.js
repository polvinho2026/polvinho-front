const SESSION_KEY = 'polvinho.session';

export function saveSession({ token, user, requiresPasswordChange }) {
    if (typeof token !== 'string' || !token || !user?.id) {
        throw new Error('Os dados da sessão são inválidos.');
    }

    const session = {
        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        },
        requiresPasswordChange: requiresPasswordChange === true
    };

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}

export function getSession() {
    const storedSession = sessionStorage.getItem(SESSION_KEY);

    if (!storedSession) {
        return null;
    }

    try {
        const session = JSON.parse(storedSession);

        if (
            typeof session?.token !== 'string' ||
            !session.token ||
            !session.user?.id
        ) {
            clearSession();
            return null;
        }

        return session;
    } catch {
        clearSession();
        return null;
    }
}

export function getToken() {
    return getSession()?.token ?? null;
}

export function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}
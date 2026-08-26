export function getCurrentRoutePath() {
    const routePath = window.location.hash.slice(1)
    return routePath || '/'
}

export function updateUrl(url) {
    const routePath = new URL(url, window.location.origin).pathname

    if (routePath === getCurrentRoutePath()) {
        return
    }

    window.location.hash = routePath
}

export function startRouter(routes, renderRoute) {
    async function handleRoute() {
        const path = getCurrentRoutePath()
        const route = routes[path] || routes['*']

        if (route) {
            await renderRoute(route, path)
        }
    }

    window.addEventListener('hashchange', handleRoute)
    handleRoute()
}

# Rotas do front-end

Este projeto usa um sistema simples de rotas feito com JavaScript puro, sem uma biblioteca como React Router.

Uma rota liga um endereço da aplicação a uma página. Por exemplo:

- `/` representa a página inicial;
- `/usuarios` representa a página de usuários;
- `*` é a rota de fallback, usada quando o endereço não existe.

Na prática, o fluxo acontece assim:

1. a pessoa clica em um botão da sidebar;
2. o endereço depois do `#` é alterado;
3. o navegador dispara o evento `hashchange`;
4. o router procura a rota correspondente;
5. a função da rota cria a página;
6. o conteúdo antigo é substituído pelo novo.

## Por que a URL usa `#`?

Ao abrir a aplicação com uma extensão como o Live Server, a URL pode ficar parecida com esta:

```text
http://127.0.0.1:5500/polvinho-front/app.html#/usuarios
```

Nesse endereço:

- `/polvinho-front/app.html` é o arquivo HTML aberto pelo navegador;
- `#/usuarios` representa a rota interna da aplicação.

Tudo o que vem depois de `#` pode ser lido por meio de `window.location.hash`. Alterar somente o hash não recarrega o arquivo HTML inteiro, por isso ele funciona bem para este projeto e não exige uma configuração especial de rotas no servidor.

> `window.location.pathname` retorna o caminho real do arquivo, como `/polvinho-front/app.html`. Já `window.location.hash` retorna o hash, como `#/usuarios`.

## Onde cada parte fica

O sistema está dividido em três arquivos principais:

- `js/core/router.js`: lê e altera a rota da URL e observa mudanças no hash;
- `js/app.js`: registra as rotas e renderiza a página correspondente;
- `js/components/sidebar.js`: cria os botões do menu, navega para uma rota e destaca o botão da página atual.

O `app.html` contém apenas o elemento `<div id="app"></div>`. O JavaScript coloca a sidebar e o conteúdo das páginas dentro dele.

## 1. Lendo a rota atual

No arquivo `js/core/router.js`, a função `getCurrentRoutePath` descobre qual rota está aberta:

```js
export function getCurrentRoutePath() {
    const routePath = window.location.hash.slice(1)
    return routePath || '/'
}
```

Se `window.location.hash` for `#/usuarios`, o método `slice(1)` remove o caractere `#` e o resultado é `/usuarios`.

Se o hash estiver vazio, a função retorna `/`, que é a rota inicial. Esse `|| '/'` é um valor padrão para hash vazio; ele não é um tratamento de erro.

## 2. Alterando a rota da URL

A função `updateUrl` é usada pelos botões da sidebar:

```js
export function updateUrl(url) {
    const routePath = new URL(url, window.location.origin).pathname

    if (routePath === getCurrentRoutePath()) {
        return
    }

    window.location.hash = routePath
}
```

Ela recebe um caminho, como `/usuarios`, e usa `new URL` para obter somente o `pathname`. Depois compara esse caminho com a rota atual:

- se a pessoa já estiver nessa rota, nada precisa ser feito;
- se for outra rota, `window.location.hash` é atualizado.

Ao mudar o hash, o navegador dispara automaticamente o evento `hashchange`. É esse evento que avisa ao router que chegou a hora de renderizar outra página.

## 3. Iniciando o router

A função `startRouter` conecta a URL às funções que criam as páginas:

```js
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
```

A função interna `handleRoute`:

1. lê o caminho atual;
2. procura esse caminho no objeto `routes`;
3. usa `routes['*']` quando não encontra a rota;
4. entrega a função encontrada para `renderRoute`.

Além de ouvir o evento `hashchange`, `startRouter` chama `handleRoute()` imediatamente. Isso é necessário para mostrar a página correta assim que a aplicação abre, antes de qualquer clique.

O uso de `async` e `await` permite que uma rota espere uma operação assíncrona, como buscar usuários na API.

## 4. Registrando e renderizando as páginas

As rotas são definidas dentro de `startApp`, no arquivo `js/app.js`:

```js
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
    '*': () => {
        const notFound = document.createElement('main')
        notFound.textContent = 'Página não encontrada'
        return notFound
    }
}
```

Cada chave é o caminho de uma rota e cada valor é uma função que devolve um elemento HTML:

- a rota `/` cria um conteúdo simples para a página inicial;
- a rota `/usuarios` espera a resposta de `getUsers()` e cria a página com `renderUsersPage(user, users)`;
- a rota `*` cria a mensagem de página não encontrada.

Depois, o router é iniciado com o objeto de rotas e uma função responsável por colocar a página na tela:

```js
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
```

`pageContent.replaceChildren()` remove o conteúdo da rota anterior. Em seguida, `route()` executa a função da nova rota e o elemento retornado é adicionado em `pageContent`.

O bloco `try...catch` evita que a área fique quebrada se ocorrer um erro, por exemplo, se a busca de usuários falhar. Nesse caso, uma mensagem de erro é exibida.

A sidebar é criada antes de `pageContent` e não é recriada a cada navegação. Assim, somente a área principal muda quando a rota muda.

## 5. Ligando as rotas aos botões da sidebar

No arquivo `js/components/sidebar.js`, cada item do menu possui um texto, um caminho e os perfis que podem visualizá-lo:

```js
const allMenuItems = [
    {
        label: 'Início',
        path: '/',
        roles: ['administrador', 'coordenador', 'professor', 'aluno']
    },
    {
        label: 'Usuários',
        path: '/usuarios',
        roles: ['administrador', 'coordenador']
    }
]
```

Antes de criar os botões, a lista é filtrada pela função do usuário:

```js
const menuItems = allMenuItems.filter(item => item.roles.includes(user.role))
```

Por exemplo, o botão **Usuários** aparece para `administrador` e `coordenador`, mas não para `professor` ou `aluno`.

> Esse filtro controla apenas o que aparece na interface. Esconder um botão não protege dados por si só. As permissões importantes também precisam ser verificadas pelo back-end.

Para cada item permitido, a sidebar cria um botão e associa o clique ao caminho daquele item:

```js
button.addEventListener('click', (event) => {
    event.preventDefault()
    updateUrl(item.path)
})
```

O botão não precisa criar a página diretamente. Ele somente chama `updateUrl`, que muda o hash. A mudança do hash é percebida pelo router, e o router escolhe a página correta.

Essa separação é útil porque cada parte tem uma responsabilidade:

- o botão pede a navegação;
- o router descobre qual rota foi pedida;
- o `app.js` cria e exibe a página.

## 6. Destacando o botão da rota atual

Durante a criação da sidebar, cada botão é guardado em um `Map`. O caminho é a chave e o elemento do botão é o valor:

```js
const buttonsByPath = new Map()

buttonsByPath.set(item.path, button)
```

Depois, `updateSelectedButton` compara a rota atual com o caminho de cada botão:

```js
function updateSelectedButton() {
    const currentPath = getCurrentRoutePath()

    buttonsByPath.forEach((button, path) => {
        const isSelected = path === currentPath
        button.classList.toggle('blue', isSelected)
        button.classList.toggle('white', !isSelected)
    })
}
```

Quando os caminhos são iguais, o botão recebe a classe `blue`. Os outros recebem a classe `white`. Dessa forma, a pessoa consegue ver em qual página está.

A atualização ocorre em dois momentos:

```js
window.addEventListener('hashchange', updateSelectedButton)
updateSelectedButton()
```

- no carregamento inicial, com a chamada direta de `updateSelectedButton()`;
- sempre que a rota mudar, por meio do evento `hashchange`.

## Rotas que existem atualmente

No estado atual do projeto, o `app.js` registra estas rotas:

| Caminho | Conteúdo |
| --- | --- |
| `/` | Página inicial provisória |
| `/usuarios` | Lista de usuários obtida pela API |
| `*` | Página não encontrada |

A sidebar também possui itens para `/departamentos`, `/cursos` e `/disciplinas`, mas essas rotas ainda não foram adicionadas ao objeto `routes`. Por isso, clicar nesses botões leva, por enquanto, à página não encontrada.

## Como adicionar uma nova rota

Para criar uma página de departamentos, por exemplo:

1. crie ou importe uma função que devolva o elemento da página;
2. registre `/departamentos` no objeto `routes` de `js/app.js`;
3. garanta que exista um item com o mesmo `path` em `allMenuItems`, caso a rota deva aparecer na sidebar;
4. informe em `roles` quais perfis podem ver o botão.

Exemplo de registro:

```js
const routes = {
    // outras rotas...
    '/departamentos': async () => {
        const departments = await getDepartments()
        return renderDepartmentsPage(departments)
    },
    '*': () => {
        const notFound = document.createElement('main')
        notFound.textContent = 'Página não encontrada'
        return notFound
    }
}
```

O texto usado em `path` precisa ser exatamente igual ao caminho registrado em `routes`. Se a sidebar usar `/departamentos` e o objeto registrar `/departamento`, o router não encontrará a página e usará a rota `*`.

## Resumo do fluxo

```text
Clique no botão da sidebar
        ↓
updateUrl('/usuarios')
        ↓
URL passa a ter #/usuarios
        ↓
Evento hashchange
        ↓
startRouter procura routes['/usuarios']
        ↓
getUsers busca os dados da API
        ↓
renderUsersPage cria o elemento da página
        ↓
pageContent exibe o novo conteúdo
        ↓
Sidebar destaca o botão Usuários
```

Assim, a URL, o conteúdo principal e o botão selecionado da sidebar permanecem sincronizados.

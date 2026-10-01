# Documentação do front-end

## Sistema de rotas

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

### Por que a URL usa `#`?

Ao abrir a aplicação com uma extensão como o Live Server, a URL pode ficar parecida com esta:

```text
http://127.0.0.1:5500/polvinho-front/app.html#/usuarios
```

Nesse endereço:

- `/polvinho-front/app.html` é o arquivo HTML aberto pelo navegador;
- `#/usuarios` representa a rota interna da aplicação.

Tudo o que vem depois de `#` pode ser lido por meio de `window.location.hash`. Alterar somente o hash não recarrega o arquivo HTML inteiro, por isso ele funciona bem para este projeto e não exige uma configuração especial de rotas no servidor.

> `window.location.pathname` retorna o caminho real do arquivo, como `/polvinho-front/app.html`. Já `window.location.hash` retorna o hash, como `#/usuarios`.

### Onde cada parte fica

O sistema está dividido em três arquivos principais:

- `js/core/router.js`: lê e altera a rota da URL e observa mudanças no hash;
- `js/app.js`: registra as rotas e renderiza a página correspondente;
- `js/components/sidebar.js`: cria os botões do menu, navega para uma rota e destaca o botão da página atual.

O `app.html` contém apenas o elemento `<div id="app"></div>`. O JavaScript coloca a sidebar e o conteúdo das páginas dentro dele.

### 1. Lendo a rota atual

No arquivo `js/core/router.js`, a função `getCurrentRoutePath` descobre qual rota está aberta:

```js
export function getCurrentRoutePath() {
    const routePath = window.location.hash.slice(1)
    return routePath || '/'
}
```

Se `window.location.hash` for `#/usuarios`, o método `slice(1)` remove o caractere `#` e o resultado é `/usuarios`.

Se o hash estiver vazio, a função retorna `/`, que é a rota inicial. Esse `|| '/'` é um valor padrão para hash vazio; ele não é um tratamento de erro.

### 2. Alterando a rota da URL

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

### 3. Iniciando o router

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

### 4. Registrando e renderizando as páginas

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

### 5. Ligando as rotas aos botões da sidebar

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

### 6. Destacando o botão da rota atual

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

### Rotas que existem atualmente

No estado atual do projeto, o `app.js` registra estas rotas:

| Caminho | Conteúdo |
| --- | --- |
| `/` | Página inicial provisória |
| `/usuarios` | Lista de usuários obtida pela API |
| `*` | Página não encontrada |

A sidebar também possui itens para `/departamentos`, `/cursos` e `/disciplinas`, mas essas rotas ainda não foram adicionadas ao objeto `routes`. Por isso, clicar nesses botões leva, por enquanto, à página não encontrada.

### Como adicionar uma nova rota

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

### Resumo do fluxo

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

---

## Componente de filtro

O componente de filtro foi criado para montar um menu de opções sem deixar as regras da página presas dentro do próprio componente. Ele fica em `js/components/filterModal.js` e é usado na página de usuários, em `js/pages/users.js`.

Neste projeto, o nome usado é “modal”, mas visualmente ele funciona como um menu flutuante: aparece abaixo do botão de filtro e não cobre a tela inteira.

O fluxo atual acontece assim:

1. a página de usuários define quais grupos e opções devem aparecer;
2. `createFilterModal` cria o formulário do filtro;
3. o modal é colocado ao lado do botão de filtro;
4. um clique no botão chama `filterModal.open`;
5. a pessoa marca as opções desejadas;
6. **Filtrar** confirma a seleção e **Cancelar** recupera a última seleção aplicada.

No momento, a parte visual e o controle das seleções estão prontos. A página ainda não usa o resultado para buscar novamente os usuários ou atualizar a tabela.

### Onde cada parte fica

- `js/components/filterModal.js`: cria o modal e controla suas seleções;
- `js/pages/users.js`: define os filtros de usuários e conecta o modal ao botão;
- `css/components/filterModal.css`: cuida da aparência e do posicionamento;
- `js/api/users.js`: contém a função `getUsers`, que poderá receber os filtros quando a integração for concluída;
- `js/components/listTable.js`: mostra os dados e oferece o método `update` para atualizar a tabela.

### 1. Dados recebidos pelo componente

A função `createFilterModal` recebe um objeto com duas propriedades:

```js
export function createFilterModal({ sessions = [], onFilter = () => {} } = {}) {
    // criação do componente...
}
```

- `sessions`: lista dos grupos de filtros que serão exibidos;
- `onFilter`: função chamada quando a pessoa confirma os filtros.

As duas propriedades possuem valores padrão. Dessa forma, chamar `createFilterModal()` sem argumentos não causa erro: o modal será criado sem opções e usará uma função vazia ao confirmar.

Cada item de `sessions` pode ter este formato:

```js
{
    name: 'role',
    title: 'Papel',
    filters: [
        {
            title: 'Administrador',
            value: 'admin',
            buttonType: 'checkbox',
            checked: false
        }
    ]
}
```

As propriedades servem para:

- `name`: definir o nome da propriedade devolvida pelo componente;
- `title`: mostrar o título do grupo na tela;
- `filters`: guardar as opções daquele grupo;
- `filter.title`: mostrar o texto da opção;
- `filter.value`: definir o valor usado pelo código;
- `filter.buttonType`: escolher entre `radio` e `checkbox`;
- `filter.checked`: indicar se a opção deve começar marcada.

`buttonType` e `checked` são opcionais. Quando `buttonType` não é `radio`, o componente cria um `checkbox`. Quando `checked` não é informado, a opção começa desmarcada.

Se `name` não for informado, o título da seção será usado como chave. Se `value` não for informado, o texto visível da opção será usado como valor.

### 2. Criando as seções e os campos

O componente percorre as seções recebidas com `forEach`:

```js
sessions.forEach((session, sessionIndex) => {
    const container = document.createElement('section')
    container.classList.add('filter-session')

    const title = document.createElement('h3')
    title.textContent = session.title
    container.appendChild(title)

    const filters = session.filters ?? []

    // criação das opções da seção...
})
```

Para cada seção, ele cria um elemento `<section>`, adiciona o título e percorre a lista de filtros. O operador `?? []` garante uma lista vazia caso `session.filters` não tenha sido informado.

Cada opção vira um `input` e um `label`:

```js
const input = document.createElement('input')
const inputId = `filter-${sessionIndex}-${filterIndex}`

input.id = inputId
input.type = filter.buttonType === 'radio' ? 'radio' : 'checkbox'
input.name = `filter-${sessionIndex}`
input.value = filter.value ?? filter.title
input.checked = filter.checked ?? false

const label = document.createElement('label')
label.htmlFor = inputId
label.textContent = filter.title
```

O `id` único liga cada `label` ao seu respectivo `input` por meio de `htmlFor`. Assim, também é possível marcar uma opção clicando no texto dela.

Todos os campos da mesma seção recebem o mesmo `name`. Isso é especialmente importante para os campos do tipo `radio`, porque o navegador permite marcar apenas um radio com o mesmo nome. Já os checkboxes continuam permitindo várias escolhas.

### 3. Diferença entre checkbox e radio

Na página de usuários, o grupo **Papel** usa checkboxes:

```js
{
    name: 'role',
    title: 'Papel',
    filters: [
        {title: 'Administrador', value: 'admin'},
        {title: 'Coordenador', value: 'coordinator'},
        {title: 'Professor', value: 'professor'},
        {title: 'Aluno', value: 'student'},
    ]
}
```

Como `buttonType` não foi informado, essas opções viram checkboxes e permitem selecionar vários papéis ao mesmo tempo.

O grupo **Status** usa radios:

```js
{
    name: 'status',
    title: 'Status',
    filters: [
        {title: 'Ativos', value: 'active', buttonType: 'radio'},
        {title: 'Excluídos', value: 'excluded', buttonType: 'radio'},
    ]
}
```

Nesse caso, somente um status pode ficar marcado por vez.

Os textos em português são usados na interface. Valores como `admin`, `coordinator` e `active` são usados pelo código e podem ser enviados para a API sem depender do texto que aparece para a pessoa.

### 4. Abrindo o modal pelo botão da página

Na página de usuários, primeiro são criados o botão e um contêiner para o menu:

```js
const filterUsersButton = createIconButton({
    icon: 'assets/images/filter.svg',
    size: 'medium'
})

const filterMenuContainer = document.createElement('div')
filterMenuContainer.classList.add('filter-menu-container')
filterMenuContainer.appendChild(filterUsersButton)
```

Depois de definir `filterSessions`, a página cria o modal, conecta o clique e coloca o modal no mesmo contêiner do botão:

```js
const filterModal = createFilterModal({ sessions: filterSessions })

filterUsersButton.addEventListener('click', filterModal.open)
filterMenuContainer.appendChild(filterModal)
```

O método `open` foi acrescentado ao elemento do modal dentro de `createFilterModal`:

```js
modal.open = event => {
    triggerElement = event?.currentTarget ?? null
    modal.hidden = false
    document.addEventListener('click', handleClickOutside)
}
```

Ele faz três coisas:

1. guarda em `triggerElement` o botão que abriu o modal;
2. altera `hidden` para `false`, deixando o modal visível;
3. começa a observar cliques no documento para permitir o fechamento ao clicar fora.

O botão e o modal ficam dentro de `.filter-menu-container`. No CSS, esse contêiner usa `position: relative`, enquanto o modal usa `position: absolute`. Por isso, o modal consegue aparecer logo abaixo e alinhado à direita do botão:

```css
.filter-menu-container {
    position: relative;
}

.filter-modal {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
}
```

### 5. Lendo os filtros selecionados

A função `getSelectedFilters` procura os campos marcados de cada seção:

```js
function getSelectedFilters() {
    return Object.fromEntries(sessions.map((session, sessionIndex) => {
        const selectedValues = [...content.querySelectorAll(
            `input[name="filter-${sessionIndex}"]:checked`
        )].map(input => input.value)

        return [session.name ?? session.title, selectedValues]
    }))
}
```

O seletor `:checked` encontra apenas os inputs marcados. Em seguida, `map` pega o `value` de cada um e `Object.fromEntries` transforma os pares em um objeto.

Por exemplo, se a pessoa marcar **Administrador**, **Professor** e **Ativos**, o resultado será:

```js
{
    role: ['admin', 'professor'],
    status: ['active']
}
```

Mesmo quando nenhuma opção de um grupo está marcada, esse grupo aparece no resultado com um array vazio.

O componente também disponibiliza essa leitura para outros arquivos:

```js
modal.getFilters = getSelectedFilters
```

Assim, a página pode consultar `filterModal.getFilters()` quando precisar.

### 6. Aplicando os filtros

O conteúdo do modal é um `<form>`, e o botão **Filtrar** possui `type="submit"`. Ao enviar o formulário, o componente executa este código:

```js
content.addEventListener('submit', event => {
    event.preventDefault()
    appliedInputIds = getCheckedInputIds()
    onFilter(getSelectedFilters())
    closeModal()
})
```

O `event.preventDefault()` impede o comportamento padrão do formulário, que recarregaria a página. Depois disso:

1. os campos marcados são salvos como a seleção aplicada;
2. `onFilter` recebe o objeto com os filtros;
3. o modal é fechado.

O componente não decide como os usuários serão filtrados. Essa decisão pertence à página que usa o componente. Essa separação permite reutilizar o mesmo modal em outras páginas, com outras opções e outras ações.

### 7. Cancelando alterações

O componente guarda os identificadores dos campos confirmados em um `Set`:

```js
let appliedInputIds = getCheckedInputIds()
```

Quando a pessoa confirma o formulário, esse `Set` é atualizado. Se ela abrir o modal novamente, alterar algumas opções e clicar em **Cancelar**, as mudanças ainda não confirmadas são desfeitas:

```js
function cancelFilters() {
    content.querySelectorAll('input').forEach(input => {
        input.checked = appliedInputIds.has(input.id)
    })

    closeModal()
}
```

Portanto, **Cancelar** não limpa todos os filtros. Ele recupera a última seleção aplicada.

O mesmo comportamento acontece ao clicar fora do modal:

```js
function handleClickOutside(event) {
    if (!modal.contains(event.target) && !triggerElement?.contains(event.target)) {
        cancelFilters()
    }
}
```

A condição verifica se o clique aconteceu fora do modal e fora do botão que o abriu. Se as duas verificações forem verdadeiras, as alterações são canceladas e o modal é fechado.

Ao fechar, o evento temporário também é removido:

```js
function closeModal() {
    modal.hidden = true
    document.removeEventListener('click', handleClickOutside)
}
```

Isso evita manter um observador de cliques desnecessário enquanto o modal está escondido.

### 8. O que já funciona e o que falta integrar

Atualmente, já funciona:

- abrir e fechar o menu;
- criar grupos de filtros a partir de dados;
- selecionar vários papéis com checkbox;
- selecionar somente um status com radio;
- obter as opções marcadas em um objeto;
- confirmar uma seleção;
- cancelar alterações ainda não aplicadas;
- fechar e cancelar ao clicar fora;
- manter a última seleção confirmada ao abrir novamente.

O modal é criado na página desta forma:

```js
const filterModal = createFilterModal({ sessions: filterSessions })
```

Como nenhum `onFilter` é passado, o componente usa o valor padrão `() => {}`. Por isso, o botão **Filtrar** ainda não altera a tabela nem realiza uma nova requisição. Ele apenas confirma internamente as opções marcadas e fecha o modal.

### 9. Como conectar o filtro à tabela futuramente

A integração poderá ser feita passando uma função `onFilter` ao criar o modal. Essa função deverá transformar a seleção do componente nos parâmetros esperados por `getUsers`, buscar os dados e atualizar a tabela.

Uma versão simplificada para filtrar por um único papel poderia seguir esta ideia:

```js
const filterModal = createFilterModal({
    sessions: filterSessions,
    onFilter: async filters => {
        const response = await getUsers({
            page: 1,
            limit: usersResponse.pagination.limit,
            role: filters.role[0]
        })

        usersTable.update(response)
    }
})
```

Esse código é apenas um exemplo da próxima etapa. O componente permite selecionar vários papéis, mas `getUsers` recebe atualmente um único valor em `role`. Para aceitar vários papéis, será necessário escolher uma destas soluções:

- mudar o grupo **Papel** para radio e permitir somente uma escolha;
- adaptar o front-end e o back-end para enviar e receber vários papéis;
- filtrar no próprio front-end, caso todos os usuários necessários já estejam carregados.

O status também precisa ser convertido para o formato esperado pela API. Hoje `getUsers` possui o parâmetro `includeExcluded`, enquanto o modal devolve `status: ['active']` ou `status: ['excluded']`. Além disso, “incluir excluídos” não significa necessariamente “mostrar somente excluídos”. Essa regra deve ser definida antes da integração para que o nome da opção corresponda ao resultado exibido.

Também será importante guardar os filtros ativos para reutilizá-los na paginação. Atualmente, `onPageChange` chama `getUsers` apenas com `page` e `limit`. Sem guardar os filtros, ir para a próxima página faria a tabela voltar à listagem sem filtro.

### Resumo do fluxo do filtro

```text
Página de usuários define filterSessions
        ↓
createFilterModal cria o formulário
        ↓
Clique no botão de filtro
        ↓
filterModal.open exibe o menu
        ↓
Pessoa marca checkboxes e/ou radios
        ↓
Clique em Filtrar
        ↓
getSelectedFilters cria o objeto de filtros
        ↓
onFilter recebe esse objeto
        ↓
No futuro: getUsers busca os dados filtrados
        ↓
No futuro: usersTable.update atualiza a tabela
```

Com essa estrutura, o componente cuida da interface e das seleções, enquanto a página de usuários fica responsável por decidir o que fazer com os filtros escolhidos.

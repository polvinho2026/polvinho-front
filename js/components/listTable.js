export function createListTable({
    columns = [],
    data = [],
    pagination = {},
    visibleRows = 4,
    emptyMessage = 'Nenhum usuário encontrado.',
    hideSinglePagePagination = false,
    onPageChange
}) {
    let currentData = data
    let currentPage = pagination.page ?? 1
    let totalPages = Math.max(1, pagination.totalPages ?? 1)
    let isLoading = false
    let loadError = ''

    const table = document.createElement('div')
    table.classList.add('list-table')

    const gridTemplateColumns = columns
        .map(column => column.width || '1fr')
        .join(' ')

    table.style.setProperty('--table-columns', gridTemplateColumns)
    table.style.setProperty('--visible-rows', visibleRows)

    const viewPort = document.createElement('div')
    viewPort.classList.add('list-table-viewport')

    const header = document.createElement('div')
    header.classList.add('list-table-header')
    header.setAttribute('role', 'row')

    columns.forEach(column => {
        const cell = document.createElement('div')
        cell.classList.add('list-table-cell')
        cell.textContent = column.title
        header.appendChild(cell)
    })

    viewPort.appendChild(header)

    const tableBody = document.createElement('div')
    tableBody.classList.add('list-table-body')

    viewPort.appendChild(tableBody)

    const paginationControls = document.createElement('div')
    paginationControls.classList.add('list-table-pagination')

    const previousButton = document.createElement('button')
    previousButton.textContent = 'Anterior'

    const pageInformation = document.createElement('span')
    pageInformation.setAttribute('aria-live', 'polite')
    
    const nextButton = document.createElement('button')
    nextButton.textContent = 'Próxima'

    paginationControls.append(
        previousButton,
        pageInformation,
        nextButton
    )

    function renderRows() {
        tableBody.replaceChildren()
        table.classList.toggle('is-empty', currentData.length === 0)

        currentData.forEach(item => {
            const row = document.createElement('div')
            row.classList.add('list-table-row')
            row.setAttribute('role', 'row')

            columns.forEach(column => {
                const cell = document.createElement('div')
                cell.classList.add('list-table-cell')

                if (column.render) {
                    const renderedValue = column.render(item)

                    if (renderedValue instanceof Node) {
                        cell.appendChild(renderedValue)
                    } else {
                        cell.innerHTML = renderedValue
                    }
                } else {
                    cell.textContent = item[column.key] ?? ''
                }

                row.appendChild(cell)
            })

            tableBody.appendChild(row)
        })

        if (currentData.length === 0) {
            const message = document.createElement('p')
            message.classList.add('list-table-empty')
            message.textContent = emptyMessage
            tableBody.appendChild(message)
        }

        pageInformation.textContent = loadError || `Página ${currentPage} de ${totalPages}`
        paginationControls.hidden = hideSinglePagePagination && totalPages === 1 && !loadError

        previousButton.disabled = isLoading || currentPage === 1
        nextButton.disabled = isLoading || currentPage === totalPages

        viewPort.scrollTop = 0
    }

    async function requestPage(page) {
        if (isLoading || typeof onPageChange !== 'function') {
            return
        }

        isLoading = true
        loadError = ''
        pageInformation.textContent = 'Carregando...'
        previousButton.disabled = true
        nextButton.disabled = true

        try {
            await onPageChange(page)
        } catch (error) {
            console.error(error)
            loadError = 'Erro ao carregar a página.'
        } finally {
            isLoading = false
            renderRows()
        }
    }

    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            requestPage(currentPage - 1)
        }
    })

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            requestPage(currentPage + 1)
        }
    })

    table.appendChild(viewPort)
    table.appendChild(paginationControls)

    table.update = ({ data: newData = [], pagination: newPagination = {} }) => {
        currentData = newData
        currentPage = newPagination.page ?? currentPage
        totalPages = Math.max(1, newPagination.totalPages ?? totalPages)
        loadError = ''
        renderRows()
    }

    renderRows()

    return table
}

import { createSelectionButtons } from "./selectionButtons.js"

export function createListTable({
    columns = [],
    data = [],
    rowsPerPage = 20,
    visibleRows = 4
}) {
    let currentPage = 1

    const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage))

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

    const pagination = document.createElement('div')
    pagination.classList.add('list-table-pagination')

    const previousButton = document.createElement('button')
    previousButton.textContent = 'Anterior'

    const pageInformation = document.createElement('span')
    
    const nextButton = document.createElement('button')
    nextButton.textContent = 'Próxima'

    pagination.append(
        previousButton,
        pageInformation,
        nextButton
    )

    function renderRows() {
        tableBody.replaceChildren()

        const startIndex = (currentPage - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage

        const currentPageData = data.slice(startIndex, endIndex)

        currentPageData.forEach(item => {
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

        pageInformation.textContent = `Página ${currentPage} de ${totalPages}`

        previousButton.disabled = currentPage === 1
        nextButton.disabled = currentPage === totalPages

        viewPort.scrollTop = 0
    }

    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--
            renderRows()
        }
    })

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++
            renderRows()
        }
    })

    table.appendChild(viewPort)
    table.appendChild(pagination)

    renderRows()

    return table
}

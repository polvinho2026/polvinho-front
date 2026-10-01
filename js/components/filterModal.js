export function createFilterModal({ sessions = [], onFilter = () => {} } = {}) {
    const modal = document.createElement('div')
    modal.classList.add('filter-modal')
    modal.hidden = true

    let triggerElement = null

    const content = document.createElement('form')
    content.classList.add('filter-modal-content')

    const header = document.createElement('div')
    header.classList.add('filter-modal-header')

    const modalTitle = document.createElement('h2')
    modalTitle.textContent = 'Filtros'

    header.appendChild(modalTitle)
    content.appendChild(header)

    const filtersContent = document.createElement('div')
    filtersContent.classList.add('filter-modal-body')

    sessions.forEach((session, sessionIndex) => {
        const container = document.createElement('section')
        container.classList.add('filter-session')

        const title = document.createElement('h3')
        title.textContent = session.title
        container.appendChild(title)

        const filters = session.filters ?? []

        filters.forEach((filter, filterIndex) => {
            const filterContainer = document.createElement('div')
            filterContainer.classList.add('filter-container')

            const input = document.createElement('input')
            const inputId = `filter-${sessionIndex}-${filterIndex}`

            input.id = inputId
            input.type = filter.buttonType === 'radio' ? 'radio' : 'checkbox'
            input.name = `filter-${sessionIndex}`
            input.value = filter.value ?? filter.title
            input.checked = filter.checked ?? false
            input.classList.add(`filter-button-${input.type}`)

            const label = document.createElement('label')
            label.htmlFor = inputId
            label.textContent = filter.title
            label.classList.add('filter-title')

            filterContainer.append(input, label)
            container.appendChild(filterContainer)
        })

        filtersContent.appendChild(container)
    })

    content.appendChild(filtersContent)

    const actions = document.createElement('div')
    actions.classList.add('filter-modal-actions')

    const cancelButton = document.createElement('button')
    cancelButton.classList.add('filter-modal-button', 'cancel')
    cancelButton.type = 'button'
    cancelButton.textContent = 'Cancelar'

    const filterButton = document.createElement('button')
    filterButton.classList.add('filter-modal-button', 'apply')
    filterButton.type = 'submit'
    filterButton.textContent = 'Filtrar'

    actions.append(cancelButton, filterButton)
    content.appendChild(actions)

    let appliedInputIds = getCheckedInputIds()

    function getCheckedInputIds() {
        return new Set(
            [...content.querySelectorAll('input:checked')].map(input => input.id)
        )
    }

    function getSelectedFilters() {
        return Object.fromEntries(sessions.map((session, sessionIndex) => {
            const selectedValues = [...content.querySelectorAll(
                `input[name="filter-${sessionIndex}"]:checked`
            )].map(input => input.value)

            return [session.name ?? session.title, selectedValues]
        }))
    }

    function closeModal() {
        modal.hidden = true
        document.removeEventListener('click', handleClickOutside)
    }

    function cancelFilters() {
        content.querySelectorAll('input').forEach(input => {
            input.checked = appliedInputIds.has(input.id)
        })

        closeModal()
    }

    function handleClickOutside(event) {
        if (!modal.contains(event.target) && !triggerElement?.contains(event.target)) {
            cancelFilters()
        }
    }

    modal.open = event => {
        triggerElement = event?.currentTarget ?? null
        modal.hidden = false
        document.addEventListener('click', handleClickOutside)
    }

    modal.close = cancelFilters
    modal.getFilters = getSelectedFilters

    content.addEventListener('submit', event => {
        event.preventDefault()
        appliedInputIds = getCheckedInputIds()
        onFilter(getSelectedFilters())
        closeModal()
    })

    cancelButton.addEventListener('click', cancelFilters)

    modal.appendChild(content)

    return modal
}

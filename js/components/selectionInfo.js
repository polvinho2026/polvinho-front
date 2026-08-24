import { createLinkButton } from "./linkButton.js"

export function createSelectionInfo(counter = 0) {  

    const container = document.createElement('div')
    container.classList.add('selection-info-container')

    const selectionQuantity = document.createElement('p')
    selectionQuantity.classList.add('selection-quantity')

    const selectionNumber = document.createElement('span')
    selectionNumber.classList.add('selection-number')

    const selectionText = document.createTextNode(' selecionado')

    selectionQuantity.append(
        document.createTextNode('('),
        selectionNumber,
        selectionText,
        document.createTextNode(')')
    )

    const cleanSelectionButton = createLinkButton({
        title: 'Limpar Seleção'
    })

    container.append(selectionQuantity, cleanSelectionButton)

    function updateCounter(value) {
        selectionNumber.textContent = value
        selectionText.textContent = value === 1
            ? ' selecionado'
            : ' selecionados'
    }

    container.updateCounter = updateCounter
    container.cleanButton = cleanSelectionButton

    updateCounter(counter)

    return container
}

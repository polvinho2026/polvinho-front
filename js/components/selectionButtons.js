import { createDefaultButton } from "./defaultButton.js"

export function createSelectionButtons({ onEdit, onDelete } = {}) {
    const selectionButtons = document.createElement('div')
    selectionButtons.classList.add('selection-buttons')

    const editButton = createDefaultButton({
        title: 'Editar',
        size: 'small',
        color: 'edit',
        border: 'border-tertiary',
        borderRadius: 'border-radius-rounded',
        icon: 'assets/images/edit.svg'
    })

    const deleteButton = createDefaultButton({
        title: 'Excluir',
        size: 'small',
        color: 'red',
        borderRadius: 'border-radius-rounded',
        icon: 'assets/images/delete.svg'
    })

    editButton.disabled = true
    deleteButton.disabled = true

    if (onEdit) editButton.addEventListener('click', onEdit)
    if (onDelete) deleteButton.addEventListener('click', onDelete)

    selectionButtons.appendChild(editButton)
    selectionButtons.appendChild(deleteButton)

    selectionButtons.updateSelection = selectionCount => {
        editButton.disabled = selectionCount !== 1
        deleteButton.disabled = selectionCount === 0
    }

    selectionButtons.editButton = editButton
    selectionButtons.deleteButton = deleteButton

    return selectionButtons
}

import { createDefaultButton } from "./defaultButton.js";

export function createConfirmModal({ title, message, onConfirm, onCancel }) {
    const overlay = document.createElement('div');
    overlay.classList.add('confirm-modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('confirm-modal-content');

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('confirm-modal-actions');

    const cancelButton = createDefaultButton({
        title: 'Cancelar',
        size: 'medium',
        color: 'white',
        border: 'border-primary',
        borderRadius: 'border-radius-rounded'
    });

    const confirmButton = createDefaultButton({
        title: 'Excluir',
        size: 'medium',
        color: 'red',
        borderRadius: 'border-radius-rounded'
    });

    
    cancelButton.addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });

    
    confirmButton.addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });

    actionsContainer.appendChild(cancelButton);
    actionsContainer.appendChild(confirmButton);

    modal.appendChild(titleElement);
    modal.appendChild(messageElement);
    modal.appendChild(actionsContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
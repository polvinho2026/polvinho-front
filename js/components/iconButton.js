export function createIconButton(props) {

    const {
        icon = {},
        size = 'small'
    } = props

    const iconButtonElement = document.createElement('button')
    iconButtonElement.classList.add('iconButtonElement', size)

    const iconElement = document.createElement('img')
    iconElement.src = icon

    iconButtonElement.appendChild(iconElement)

    return iconButtonElement
}

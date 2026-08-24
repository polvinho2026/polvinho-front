export function createDefaultButton(props) {

    const {
        title = {},
        size = 'medium',
        color = 'transparent',
        border = null,
        borderRadius = 'border-radius-rounded',
        icon = null,
        iconPosition = 'after',
    } = props

    const buttonElement = document.createElement('button')
    buttonElement.classList.add('default-button', size, color, border, borderRadius)

    const buttonTitle = document.createTextNode(title)

    buttonElement.appendChild(buttonTitle)
    
    if(icon) {
        const buttonImg = document.createElement('img')
        buttonImg.src = icon

        buttonElement.appendChild(buttonImg)

        buttonElement.classList.add('icon-position')
    }

    return buttonElement
}

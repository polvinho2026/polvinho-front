export function createLinkButton(props) {

    const {
        title = {},
        size = 'small',
        color = 'blue'
    } = props

    const linkElement = document.createElement('button')
    linkElement.innerText = title
    linkElement.classList.add('linkButton', size, color)

    return linkElement

}
export function inputRadius(id, label, value, type, name){
    const labelRadius = document.createElement('label')
    labelRadius.classList.add('label-radius')
    labelRadius.htmlFor = id 
    
    const inputSelect = document.createElement('input')
    inputSelect.classList.add('input-radius')
    inputSelect.id = id
    inputSelect.value = value
    inputSelect.type = type
    inputSelect.name = name

    const textSpan = document.createElement('span')
    textSpan.textContent = label
    
    labelRadius.appendChild(inputSelect)
    labelRadius.appendChild(textSpan)

    return labelRadius
}
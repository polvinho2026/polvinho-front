export function inputForm(id, type, placeholder, label, maxLenght = null, pattern = null){

   const labelForm = document.createElement('label')
    labelForm.textContent = label
    labelForm.htmlFor = id
    
    const inputText = document.createElement("input")
    inputText.id = id
    inputText.type = type
    inputText.maxLength = maxLenght
    inputText.pattern = pattern
    inputText.placeholder = placeholder
    inputText.className = "input-form"

    labelForm.appendChild(inputText)
    
    return labelForm
}
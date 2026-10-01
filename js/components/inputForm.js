export function inputForm(id, type, placeholder, label, maxLenght = null, pattern = null, required = false){

   const labelForm = document.createElement('label')
    labelForm.classList.add('label-form')
    labelForm.htmlFor = id

    const spanForm = document.createElement('span')
    spanForm.innerHTML = `<span>${label}</span> <span class= 'required'> * </span>`
    
    const inputText = document.createElement("input")
    inputText.id = id
    inputText.type = type
    inputText.maxLength = maxLenght
    inputText.pattern = pattern
    inputText.placeholder = placeholder
    inputText.className = "input-form"

    labelForm.appendChild(spanForm)
    labelForm.appendChild(inputText)
    
    return labelForm
}
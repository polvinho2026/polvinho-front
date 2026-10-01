export function buttonForm(id, type, className, innerHTML = null){
    const btnForm = document.createElement('button')

    btnForm.id = id
    btnForm.type = type
    btnForm.innerHTML = innerHTML
    btnForm.className = "btn-form"

    return btnForm
}
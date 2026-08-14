import { btnExitSidebar, btnSelectEntity, buttonForm, buttonSidebar, inputCpfForm, InputDateBirth, inputEmailForm, inputRegistration, inputSelectRole, inputTxtForm } from "./js/pages/createUser.js"

const app = document.querySelector("#app")

app.appendChild(inputTxtForm())

app.appendChild(inputEmailForm())

app.appendChild(InputDateBirth())

app.appendChild(inputRegistration())

app.appendChild(inputCpfForm())

app.appendChild(inputSelectRole())

app.appendChild(buttonSidebar())

app.appendChild(btnSelectEntity())

app.appendChild(buttonForm())

app.appendChild(btnExitSidebar())
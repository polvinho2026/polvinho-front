import { getUserById, deleteUser } from "../api/users.js";
import { createDefaultButton } from "../components/defaultButton.js";
import { updateUrl } from "../core/router.js";

export async function renderUserDetailsPage(userLogged) {

    const userId = localStorage.getItem('visualizeUserId');
    const page = document.createElement('main');
    page.classList.add('user-details-page');

    if (!userId) {
        page.textContent = 'Erro: Usuário não selecionado.';
        return page;
    }

    try {
        const userData = await getUserById(userId);
        const profileImageContainer = document.createElement('div');
        profileImageContainer.classList.add('details-profile-image');

        const profileImg = document.createElement('img');
        profileImg.src = 'assets/images/user-profile-placeholder.png'; 
        profileImg.style.width = '100%';
        profileImg.style.height = '100%';
        profileImageContainer.appendChild(profileImg)

        const card = document.createElement('div');
        card.classList.add('details-card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('details-card-header');

        const headerTitle = document.createElement('h3');
        headerTitle.textContent = `${userData.name} - ${userData.course}`; 
        cardHeader.appendChild(headerTitle);

        const cardBody = document.createElement('div');
        cardBody.classList.add('details-card-body');

        const fieldName = createField('Nome Completo', userData.name);
        const fieldEmail = createField('E-mail', userData.email);
        const fieldBirthDate = createField('Data de Nascimento', userData.birth_date);
        const fieldRegistration = createField('Matrícula', userData.registration);
        const fieldCpf = createField('CPF', userData.cpf);
        const fieldRole = createIndicatorField('Papel do Usuário', userData.role);

      
        const currentDisciplines = userData.currentDisciplines || [];
        const previousDisciplines = userData.previousDisciplines || [];

        
        const currentDisciplinesSection = createDisciplineList('Disciplinas Atuais', currentDisciplines);
        const previousDisciplinesSection = createDisciplineList('Disciplinas Anteriores', previousDisciplines);

  
        cardBody.append(fieldName, fieldEmail, fieldBirthDate, fieldRegistration, fieldCpf, fieldRole, currentDisciplinesSection, previousDisciplinesSection);

        const cardActions = document.createElement('div');
        cardActions.classList.add('details-card-actions');

        const editButton = createDefaultButton({
            title: 'Editar Usuário',
            size: 'medium',
            color: 'edit', 
            borderRadius: 'border-radius-rounded',
            icon: 'assets/images/edit.svg'
        });

        const deleteButton = createDefaultButton({
            title: 'Excluir Usuário',
            size: 'medium',
            color: 'red',
            borderRadius: 'border-radius-rounded',
            icon: 'assets/images/delete.svg'
        });

        deleteButton.addEventListener('click', async () => {
            const confirmacao = confirm('Tem certeza que deseja excluir este usuário?');
            
            if (confirmacao) {
                try {
                    await deleteUser(userId);
                    alert('Usuário excluído com sucesso!');
                    updateUrl('/usuarios'); // Redireciona de volta para a lista de usuários
                } catch (error) {
                    console.error(error);
                    alert('Erro ao excluir usuário. Verifique a conexão com o backend.');
                }
            }
        });

        cardActions.append(editButton, deleteButton);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        card.appendChild(cardActions);
        page.appendChild(profileImageContainer);
        page.appendChild(card);

        } catch (error) {
        console.error(error);
        page.textContent = 'Erro ao carregar detalhes do usuário.';
    }

    return page;
}

function createField(labelText, value) {
    const container = document.createElement('div');
    container.classList.add('field-container');

    const label = document.createElement('label');
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value || '';
    input.disabled = true; 
    input.classList.add('field-input');

    container.appendChild(label);
    container.appendChild(input);

    return container;
}

// cria aquelas bolinhas azuis com o papel do usuário ao lado, para ficar mais visual. se for usado mais futuramente coloco em components. 

function createIndicatorField(labelText, value) {
    const container = document.createElement('div');
    container.classList.add('indicator-field-container');

    const label = document.createElement('label');
    label.textContent = labelText;

    const valueWrapper = document.createElement('div');
    valueWrapper.classList.add('indicator-wrapper');
    valueWrapper.classList.add('field-input');

    const dot = document.createElement('span');
    dot.classList.add('blue-dot');

    const text = document.createElement('span');
    text.textContent = value.charAt(0).toUpperCase() + value.slice(1);

    valueWrapper.appendChild(dot);
    valueWrapper.appendChild(text);

    container.appendChild(label);
    container.appendChild(valueWrapper);

    return container;
}

function createDisciplineList(title, disciplines = []) {
    const container = document.createElement('div');
    container.classList.add('disciplines-container');

    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    container.appendChild(titleElement);

   
    if (disciplines.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'Nenhuma disciplina encontrada.';
        emptyMsg.classList.add('empty-message');
        container.appendChild(emptyMsg);
        return container;
    }

    const list = document.createElement('div');
    list.classList.add('disciplines-list'); 

    
    disciplines.forEach(disc => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('indicator-wrapper');
        wrapper.classList.add('field-input');

        const dot = document.createElement('span');
        dot.classList.add('blue-dot');

        const text = document.createElement('span');
        text.textContent = disc;

        wrapper.appendChild(dot);
        wrapper.appendChild(text);
        list.appendChild(wrapper);
    });

    container.appendChild(list);
    return container;
}
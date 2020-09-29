import { table } from './elements.js';
import { personData } from './index.js';
import { addData } from './script.js';
import { removeEditPopup } from './remove-popup.js';

export async function editPopup(id) {
    // Find the person by his/her id
    const findPers = personData.find(person => person.id == id);
    // Create an element to store an html
    const form = document.createElement('form');
    form.classList.add('edit-form');
    const formHtml = `
    <fieldset class="edit-field">
        <label for="first-name">First name
            <input type="text" name="firstname" id="firstname" value="${findPers.firstName}">
        </label>
        <label for="last-name">Last name
            <input type="text" name="lastname" id="lastname" value="${findPers.lastName}">
        </label>
        <label for="birthday">Birthday
            <input type="text" name="birthday" id="birthday" value="${(new Date(findPers.birthday)).getDate()}-${new Date(findPers.birthday).toLocaleString('default', { month: 'long' })}-${(new Date(findPers.birthday)).getFullYear()}">
        </label>
        <label for="picture">Picture
            <input type="url" name="picture" id="picture" value="${findPers.picture}">
        </label>
        <div class="buttons">
            <button class="save" type="submit" id=${findPers.id}>Save</button>
            <button class="cancel" id=${findPers.id}>cancel</button>
        </div>
    </fieldset>
    `;
    form.innerHTML = formHtml;

    // If save is clicked
    const editConfirm = (e) => {
        const confirm = e.target.closest('.save');
        if (confirm) {
            const formData = e.currentTarget;
            console.log('form', formData);
            removeEditPopup(form);
            e.preventDefault();

            let myPeople = {
                firstname: formData.firstname.value,
                lastname: formData.lastname.value,
                picture: formData.picture.value,
                birthday: formData.birthday.value,
                id: findPers.id,
            }

            findPers.lastName = myPeople.lastname;
            findPers.firstName = myPeople.firstname;
            findPers.picture = myPeople.picture;
            findPers.birthday = myPeople.birthday;
            findPers.id = myPeople.id;

            addData(personData);
            table.dispatchEvent(new CustomEvent('updateList'));
        }
    };

     // If the empty space or the cancel button is clicked
     const cancelEdit = e => {
        const cancel = e.target.closest('.cancel');
        const removeForm = e.target.matches('.edit-form');
        if (cancel || removeForm) {
            removeEditPopup(form);
            table.dispatchEvent(new CustomEvent('updateList'));
        }
    };

    // Add to the body
    document.body.appendChild(form);
    form.classList.add('open');
    form.addEventListener('click', editConfirm);
    window.addEventListener('click', cancelEdit);
}
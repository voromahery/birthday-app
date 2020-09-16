// Grab all necessary elements and files
const myData = "./people.json";
const table = document.querySelector('tbody');

let personData = [];

// Fetch the data
async function fetchData() {
    const response = await fetch(myData);

    // Convert the string into an object 
    const resource = await response.json();
    personData = [...resource];

    restoreData(personData);
    addData(personData);
    table.dispatchEvent(new CustomEvent('updateList'));
    return personData;
}

fetchData();

// Add to local storage
async function addToLocalStorage() {
    localStorage.setItem('personData', JSON.stringify(personData));
};

// Even if the page is refreshed, our object is stil there.
async function restoreData() {
    // changes a string into an object.
    const people = JSON.parse(localStorage.getItem('personData'));

    // Check if there is something in the local storage
    if (people) {
        personData = people;
    }

    table.dispatchEvent(new CustomEvent('updateList'));

}

async function addData(personData) {

    // Sort the date by those who have birthday sooner
    const sortBirthdate = await personData.sort((a, b) => a.birthday - b.birthday);

    // Create an html
    const html = await sortBirthdate.map(person => `
			  <tr>
                <td>
                <img src="${person.picture}" alt="person-avatar" class="rounded-circle">
                </td>
				<td>${person.firstName}</td>
				<td>${person.birthday}</td>
                <td>
                    <button class="edit" id=${person.id}>Edit</button>
                </td>
                <td>
                    <button class="delete" id=${person.id}>Delete</button>
                </td>
			  </tr>
    `).join('');
    // Insert it into the DOM
    table.innerHTML = html;
}

// Remove popup
async function removeEditPopup(form) {
    form.classList.remove('open');

    // Delete the popup right after
    form.remove();

    // Remove it from javascript memory
    form = null;
}

// Edit person 
async function editPers(e) {

    // Grab the edit button
    const editButton = e.target.closest('.edit');

    if (editButton) {
        const buttonId = editButton.id;
        editPopup(buttonId);
        table.dispatchEvent(new CustomEvent('updateList'));
    }
}


async function editPopup(id) {
    const findPers = personData.find(person => person.id === id);

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
            <input type="text" name="birthday" id="birthday" value="${findPers.birthday}">
        </label>
        <label for="picture">Picture
            <input type="url" name="picture" id="picture" value="${findPers.picture}">
        </label>
        <div class="buttons">
            <button class="save" type="submit" id=${findPers.id}>Save</button>
            <button class="cancel" type="button" id=${findPers.id}>cancel</button>
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
            console.log('FindPers', findPers);
        }
    };

    // If the empty space or the cancel button is clicked
    window.addEventListener('click', e => {
        e.preventDefault();
        const removeForm = e.target.matches('.edit-form');
        const cancel = e.target.closest('.cancel');

        if (cancel || removeForm) {
            removeEditPopup(form);
            table.dispatchEvent(new CustomEvent('updateList'));
        }
    });

    // Add to the body
    document.body.appendChild(form);
    form.classList.add('open');
    form.addEventListener('click', editConfirm);
}

// Delete icon
async function deletePers(e) {

    // Grab the delete button
    const deleteButton = await e.target.closest('.delete');

    if (deleteButton) {
        const buttonId = deleteButton.id;
        deleteId(buttonId);
        table.dispatchEvent(new CustomEvent('updateList'));
    }
}

// Remove popup
async function removeDeletePopup(container) {
    container.classList.remove('open');

    // Delete the popup right after
    container.remove();

    // Remove it from javascript memory
    container = null;
}

async function deleteId(id) {
    const findPers = personData.find(person => person.id === id);

    // Create an element to insert the card
    const container = document.createElement('div');
    container.classList.add('container');

    const html = `
        <div class="card">
            <h3>Are you sure that you want to delete ${findPers.firstName}?</h3>
        <div>
            <button class="delete-confirm">Yes</button>
            <button class="undelete">No</button>
        </div>
        `;

    container.innerHTML = html;

    // Add to the body
    document.body.appendChild(container);
    container.classList.add('open');

    async function deleteConfirmation(e) {

        // If yes is clicked.
        const confirmButton = e.target.matches('.delete-confirm');
        if (confirmButton) {
            const personId = personData.filter(person => person.id !== id);
            personData = personId;
            addData(personId);
            removeDeletePopup(container);
            console.log(personId);
            table.dispatchEvent(new CustomEvent('updateList'));
        }

        // If no and the empty space are clicked
        const remove = e.target.matches('.container');
        const cancelButton = e.target.matches('.undelete');

        if (cancelButton || remove) {
            removeDeletePopup(container);
            table.dispatchEvent(new CustomEvent('updateList'));
        }
    }

    // Event for the button Yes and No
    window.addEventListener('click', deleteConfirmation);
    table.addEventListener('updateList', deleteConfirmation);
}

// Event listener
table.addEventListener('click', deletePers);
table.addEventListener('click', editPers);

table.addEventListener('updateList', addToLocalStorage);
table.addEventListener('updateList', deletePers);
table.addEventListener('updateList', editPers);

restoreData();
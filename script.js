// Grab all necessary elements and files
const myData = "./people.json";
const table = document.querySelector('tbody');

// Fetch the data
async function fetchData() {
    const response = await fetch(myData);
    // Convert the string into an object 
    const resource = await response.json(myData);
    let persons = Array.from({ length: 10 }, () => {
        return {
            firstName: resource.firstName,
            picture: resource.picture,
            birthday: resource.birthday,
            id: resource.id
        };
    });
    addData(resource);
    return resource;
}


fetchData();

async function addData(resource) {
    // Sort the date by those who have birthday sooner
    const sortBirthdate = await resource.sort((a, b) => a.birthday - b.birthday);
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
    }
}


async function editPopup(id) {
    const response = await fetch(myData);
    const resource = await response.json(myData);
    const findPers = resource.find(person => person.id === id);

    // Create an element to store an html
    const form = document.createElement('form');
    form.classList.add('edit-form');
    const formHtml = `
    <fieldset class="edit-field">
        <label for="first-name">First name
            <input type="text" name="first-name" id="firstname" value="${findPers.firstName}">
        </label>
        <label for="last-name">Last name
            <input type="text" name="last-name" id="lastname" value="${findPers.lastName}">
        </label>
        <label for="birthday">Birthday
            <input type="text" name="birthday" id="birthday" value="${findPers.birthday}">
        </label>
        <label for="picture">Picture
            <input type="url" name="picture" id="picture" value="${findPers.picture}">
        </label>
        <div class="buttons">
            <button class="save">Save</button>
            <button class="cancel">cancel</button>
        </div>
    </fieldset>
    `;
    form.innerHTML = formHtml;

    // If save is clicked
    form.addEventListener('click', e => {
        const formData = e.currentTarget;
        console.log(formData);
        console.log('jhadf');
        removeEditPopup(form);
        e.preventDefault();
    });

    // If the empty space or the cancel button is clicked
    window.addEventListener('click', e => {
        e.preventDefault();
        const removeForm = e.target.matches('.edit-form');
        const cancel = e.target.closest('.cancel');
        if (cancel || removeForm) {
            console.log('jshjkfhj');
            removeEditPopup(form);
        }
    });

    // Add to the body
    document.body.appendChild(form);
    form.classList.add('open');
}

// Delete icon
async function deletePers(e) {
    // Grab the delete button
    const deleteButton = await e.target.closest('.delete');
    if (deleteButton) {
        const buttonId = deleteButton.id;
        deleteId(buttonId);
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
    const response = await fetch(myData);
    const resource = await response.json(myData);
    const findPers = resource.find(person => person.id === id);
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
            const personId = await resource.filter(person => person.id !== id);
            persons = personId;
            console.log('personId', personId);
            addData(personId);
            removeDeletePopup(container);
        }

        // If no and the empty space are clicked
        const remove = e.target.matches('.container');
        const cancelButton = e.target.matches('.undelete');
        if (cancelButton || remove) {
            console.log('cancelButton');
            removeDeletePopup(container);
        }
    }

    // Event for the button Yes and No
    window.addEventListener('click', deleteConfirmation);
}

// Event listener
window.addEventListener('click', deletePers);
window.addEventListener('click', editPers);
// create an html

// Insert the html to the DOM
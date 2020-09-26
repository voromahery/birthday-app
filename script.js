// Grab all necessary elements and files
const myData = "./people.json";
const table = document.querySelector('tbody');
const addButton = document.querySelector('.add-button');

// Created an empty array to store the data.
let personData = [];

////////////////////////////////LOCAL STORAGE//////////////////////////////////////////////////
// Add to local storage
async function addToLocalStorage() {
    // Change the array of object into string in order to display it on local storage
    localStorage.setItem('personData', JSON.stringify(personData));
};

// Even if the page is refreshed, our object is stil there.
async function restoreData() {
    // changes a string into an object.
    const people = JSON.parse(localStorage.getItem('personData'));
    // Check if there is something in the local storage
    if (people) {
        personData = people;
    } if (!people) {
        // Fetch the data
        const response = await fetch(myData);
        // Convert the string into an object 
        const resource = await response.json();
        // Store the resource in the empty array
        personData = [...resource];
        addData(personData);
    }
    table.dispatchEvent(new CustomEvent('updateList'));
}

async function fetchData() {
    // Fetch the data
    const response = await fetch(myData);
    // Convert the string into an object 
    const resource = await response.json();
    // Store the resource in the empty array
    personData = [...resource];
    restoreData(personData);
    addData(personData);
    table.dispatchEvent(new CustomEvent('updateList'));
    return personData;
}

fetchData();

//////////////////////////////////////// EDIT A PERSON ///////////////////////////////////////////////////////

async function addData(personData) {
    const dateNow = new Date(Date.now());
    const time = personData.map(person => {
        const dateBirthday = new Date(person.birthday);
        const timeDiff = Math.abs(dateBirthday.getTime() - dateNow.getTime());

        // 1000 * 3600 * 24 millisecond per day
        let dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // if (dayDiff < 0) {
        //     dayDiff =  dayDiff + 365;
        //  }
        console.log(dayDiff);
        const daysLeft = dayDiff;
        const age = dateNow.getFullYear() - new Date(person.birthday).getFullYear();
        const month = new Date(person.birthday).toLocaleString('default', { month: 'long' });

        let days = new Date(person.birthday).getDate();

        if (days === 1 || days === 21 || days === 31) {
            days = `${days}st`;
        } else if (days === 2 || days === 22) {
            days = `${days}nd`;
        } else if (days === 3 || days === 23) {
            days = `${days}rd`;
        } else {
            days = `${days}th`;
        };

        const date = {
            picture: person.picture,
            firstName: person.firstName,
            lastName: person.lastName,
            birthday: person.birthday,
            id: person.id,
            month: month,
            age: age,
            days: days,
            daysLeft: daysLeft,
        }
        return date;
    });
    console.log(time);
    // Sort the date by those who have birthday sooner
    const sortBirthdate = await time.sort((a, b) => a.daysLeft - b.daysLeft);
    // Create an html
    const html = await sortBirthdate.map(person => `
			  <tr>
                <td>
                <img src="${person.picture}" alt="${person.firstName}-avatar" class="rounded-circle">
                </td>
                <td>
                    <h3>${person.firstName}</h3>
                    Turns ${person.age}
                     on ${person.month}
                     ${person.days} 
                </td>
                <td>
                    <h3>${person.daysLeft}<br> Days</h3>
                </td>
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
    table.dispatchEvent(new CustomEvent('updateList'));
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
        }
    };

    // If the empty space or the cancel button is clicked
    const cancelEdit = (e) => {
        e.preventDefault();
        const removeForm = e.target.matches('.edit-form');
        const cancel = e.target.closest('.cancel');

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

//////////////////////////////// DELETE PERSON /////////////////////////////////////////////

// Remove popup
async function removeDeletePopup(container) {
    container.classList.remove('open');

    // Delete the popup right after
    container.remove();

    // Remove it from javascript memory
    container = null;
}

async function deleteId(id) {
    const findPers = personData.find(person => person.id == id);

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
            const personId = personData.filter(person => person.id != id);
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
    // table.addEventListener('updateList', deleteConfirmation);
    table.dispatchEvent(new CustomEvent('updateList'));
}

/////////////////////////////////////////// ADD A NEW PERSON /////////////////////////////////////

// Remove popup
async function removeAddPopup(newForm) {
    newForm.classList.remove('open');

    // Delete the popup right after
    newForm.remove();

    // Remove it from javascript memory
    newForm = null;
}

// Add a new person 
addButton.addEventListener('click', e => {
    e.preventDefault();
    // Create an element to store an html
    const newForm = document.createElement('form');
    newForm.classList.add('add-new-person');
    const newFormHtml = `
     <fieldset class="edit-field">
         <label for="first-name">First name
             <input type="text" name="firstname" id="firstname" value="">
         </label>
         <label for="last-name">Last name
             <input type="text" name="lastname" id="lastname" value="">
         </label>
         <label for="birthday">Birthday
             <input type="date" name="birthday" id="birthday" value="">
         </label>
         <label for="picture">Picture
             <input type="url" name="picture" id="picture" value="">
         </label>
         <div class="buttons">
             <button class="add save" type="submit" id="">Save</button>
             <button class="cancel-add" type="button" id="">cancel</button>
         </div>
     </fieldset>
     `;
    newForm.innerHTML = newFormHtml;
    // Add to the body
    document.body.appendChild(newForm);
    newForm.classList.add('open');

    // Add an event for the newForm
    newForm.addEventListener('submit', e => {
        e.preventDefault();
        const addForm = e.currentTarget;

        let myPerson = {
            id: Date.now(),
            firstName: addForm.firstname.value,
            lastName: addForm.lastname.value,
            picture: addForm.picture.value,
            birthday: addForm.birthday.value,
        }

        // Add the new person to the Array: personData
        personData.push(myPerson);
        console.log(personData);

        addData(personData);
        table.dispatchEvent(new CustomEvent('updateList'));
        removeAddPopup(newForm);
    }
    );

    // When the empty space or the cancel button is clicked
    window.addEventListener('click', e => {
        const removeForm = e.target.matches('.add-new-person');
        const cancelAdd = e.target.closest('.cancel-add');
        if (cancelAdd || removeForm) {
            removeAddPopup(newForm);
            console.log('cancelled');
        }
    });
});


// Event listener
table.addEventListener('click', deletePers);
table.addEventListener('click', editPers);

table.addEventListener('updateList', addToLocalStorage);
table.addEventListener('updateList', deletePers);
table.addEventListener('updateList', editPers);

restoreData();

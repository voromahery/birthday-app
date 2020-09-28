import { table } from './elements.js';
import { removeAddPopup } from './remove-popup.js';
import { personData } from './index.js';
import { addData } from './script.js';

// Add a new person 
 export const addPers = (e) => {
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
};


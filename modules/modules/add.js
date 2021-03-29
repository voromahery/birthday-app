import { addButton, body, table } from "./elements.js";
import { addData } from './displayPeople.js';
import { removeAddPopup } from "./addPopup.js";
import {
  hideScrollBar,
  showScrollBar,
  personData,
  dateMax,
} from "../script.js";
export const newForm = document.createElement("form");

// Add a new person
addButton.addEventListener("click", (e) => {
  // Create an element to store an html
  newForm.classList.add("add-new-person");
  const newFormHtml = `
       <fieldset class="edit-field">
       <img src="./icons/clear.svg" class="clear" alt="clear-icon" />
       <div class="add-wrapper">
           <label for="first-name">First name
               <input type="text" name="firstname" id="firstname" placeholder="Enter a firstname" value="" required>
           </label>
           <label for="last-name">Last name
               <input type="text" name="lastname" id="lastname" placeholder="Enter a lastname" value="" required>
           </label>
           <label for="birthday">Birthday
               <input type="date" name="birthday" id="birthday" max="${dateMax}" value="" required>
           </label>
           <label for="picture">Picture
               <input type="url" name="picture" id="picture" placeholder="Enter an image url" value="" required>
           </label>
           <div class="buttons">
               <button class="add save" type="submit">Save</button>
               <button class="cancel-add" type="button">cancel</button>
           </div>
           </div>
       </fieldset>
       `;
  newForm.innerHTML = newFormHtml;
  // Add to the body
  body.appendChild(newForm);
  newForm.classList.add("open");
  hideScrollBar();

  // Add an event for the newForm
  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const addForm = e.currentTarget;

    let myPerson = {
      id: Date.now(),
      firstName: addForm.firstname.value,
      lastName: addForm.lastname.value,
      picture: addForm.picture.value,
      birthday: addForm.birthday.value,
    };

    // Add the new person to the Array: personData
    personData.push(myPerson);
    addData(personData);
    table.dispatchEvent(new CustomEvent("updateList"));
    removeAddPopup(newForm);
  });

  // When the empty space or the cancel button is clicked
  window.addEventListener("click", (e) => {
    const removeForm = e.target.matches(".add-new-person");
    const cancelAdd = e.target.closest(".cancel-add");
    const clearIcon = e.target.closest(".clear");
    if (cancelAdd || removeForm || clearIcon) {
      removeAddPopup(newForm);
      showScrollBar();
    }
  });
});

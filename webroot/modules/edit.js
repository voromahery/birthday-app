import { addData } from "./displayPeople.js";
import { removeEditPopup } from "./editPopup.js";
import { table, body } from "./elements.js";
import { dateMax, hideScrollBar, showScrollBar } from "./utils.js";
import { personData } from "../script.js";

export function editPopup(id) {
  // Find the person by his/her id
  const findPers = personData.find((person) => person.id == id);
  // Create an element to store an html
  const form = document.createElement("form");
  form.classList.add("edit-form");
  const formHtml = `
      <fieldset class="edit-field">
      <img src="./icons/clear.svg" class="clear" alt="clear-icon" />
      <div class="edit-field-wrapper">
      <h2 class="person-name">Edit ${findPers.firstName} ${
    findPers.lastName
  }</h2>
          <label for="first-name">First name 
              <input type="text" name="firstname" id="firstname" placeholder="First Name" value="${
                findPers.firstName
              }">
          </label>
          <label for="last-name">Last names
              <input type="text" name="lastname" id="lastname" value="${
                findPers.lastName
              }">
          </label>
          <label for="birthday">Birthday
              <input type="date" name="birthday" id="birthday" max="${dateMax}" value="${
    new Date(findPers.birthday).toISOString().split("T")[0]
  }">
          </label>
          <label for="picture">Picture
              <input type="url" name="picture" id="picture" value="${
                findPers.picture
              }">
          </label>
          <div class="buttons">
              <button class="save" type="submit" id=${
                findPers.id
              }>Save changes</button>
              <button class="cancel" type="submit" id=${
                findPers.id
              }>cancel</button>
          </div>
          </div>
      </fieldset>
      `;
  form.innerHTML = formHtml;

  hideScrollBar();

  // If save is clicked
  const editConfirm = (e) => {
    const confirm = e.target.closest(".save");
    if (confirm) {
      const formData = e.currentTarget;
      removeEditPopup(form);
      e.preventDefault();

      let myPeople = {
        firstname: formData.firstname.value,
        lastname: formData.lastname.value,
        picture: formData.picture.value,
        birthday: formData.birthday.value,
        id: findPers.id,
      };

      findPers.lastName = myPeople.lastname;
      findPers.firstName = myPeople.firstname;
      findPers.picture = myPeople.picture;
      findPers.birthday = myPeople.birthday;
      findPers.id = myPeople.id;

      addData(personData);
      table.dispatchEvent(new CustomEvent("updateList"));
      showScrollBar();
    }
  };

  // If the empty space or the cancel button is clicked
  const cancelEdit = (e) => {
    const cancel = e.target.closest(".cancel") || e.target.matches(".clear");
    const removeForm = e.target.matches(".edit-form");
    if (cancel || removeForm) {
      removeEditPopup(form);
      table.dispatchEvent(new CustomEvent("updateList"));
      showScrollBar();
    }
  };

  // Add to the body
  body.appendChild(form);
  form.classList.add("open");
  form.addEventListener("click", editConfirm);
  window.addEventListener("click", cancelEdit);
}

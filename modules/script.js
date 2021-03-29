import { hideScrollBar, showScrollBar} from "./modules/utils.js";
import { removeDeletePopup } from "./modules/deletePopup.js";
import { newForm } from "./modules/add.js";
import { filterData } from "./modules/search.js";
import { editPers } from "./modules/editPopup.js";
import { addData } from "./modules/displayPeople.js";
import { table, body } from "./modules/elements.js";

const myData = "./people.json";
export let personData = [];

// Add to local storage
async function addToLocalStorage() {
  localStorage.setItem("personData", JSON.stringify(personData));
}

// Even if the page is refreshed, our object is stil there.
async function restoreData() {
  // changes a string into an object.
  const people = JSON.parse(localStorage.getItem("personData"));
  // Check if there is something in the local storage
  if (people) {
    personData = people;
  }
  if (!people) {
    // Fetch the data
    const response = await fetch(myData);
    // Convert the string into an object
    const resource = await response.json();
    // Store the resource in the empty array
    personData = [...resource];
    addData(personData);
  }
  table.dispatchEvent(new CustomEvent("updateList"));
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
  table.dispatchEvent(new CustomEvent("updateList"));
  return personData;
}

export function deleteId(id) {
  const findPers = personData.find((person) => person.id == id);

  // Create an element to insert the card
  const container = document.createElement("div");
  container.classList.add("container");

  const html = `
          <div class="delete-card">
            <div class="clear-wrapper">
              <img src="./icons/clear.svg" class="clear" alt="clear-icon" />
            </div>
              <h3 class="confirmation">Are you sure that you want to delete ${findPers.firstName} ${findPers.lastName}?</h3>
              <div class="buttons">
                <button class="delete-confirm">Yes</button>
                <button class="undelete">No</button>
              </div>
          </div>
          `;

  container.innerHTML = html;

  // Add to the body
  body.appendChild(container);
  container.classList.add("open");
  hideScrollBar();

  function deleteConfirmation(e) {
    // If yes is clicked.
    const confirmButton = e.target.matches(".delete-confirm");
    if (confirmButton) {
      const personId = personData.filter((person) => person.id != id);
      personData = personId;
      addData(personId);
      removeDeletePopup(container);
      table.dispatchEvent(new CustomEvent("updateList"));
      showScrollBar();
    }

    // If no and the empty space are clicked
    const remove = e.target.matches(".container");
    const cancelButton = e.target.matches(".undelete");
    const clearIcon = e.target.closest(".clear");

    if (cancelButton || remove || clearIcon) {
      removeDeletePopup(container);
      table.dispatchEvent(new CustomEvent("updateList"));
      showScrollBar();
    }
  }

  // Event for the button Yes and No
  window.addEventListener("click", deleteConfirmation);
  // table.addEventListener('updateList', deleteConfirmation);
  table.dispatchEvent(new CustomEvent("updateList"));
}

export function deletePers(e) {
  // Grab the delete button
  const deleteButton = e.target.closest(".delete");

  if (deleteButton) {
    const buttonId = deleteButton.id;
    deleteId(buttonId);
    table.dispatchEvent(new CustomEvent("updateList"));
  }
}


table.addEventListener("click", deletePers);
table.addEventListener("click", editPers);
table.addEventListener("updateList", addToLocalStorage);
table.addEventListener("updateList", deletePers);
table.addEventListener("updateList", editPers);

restoreData();
fetchData();

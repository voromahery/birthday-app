import { personData, hideScrollBar, showScrollBar } from "../script.js";
import { removeDeletePopup } from './deletePopup.js';
import { table } from "./elements.js";
import { addData } from './displayPeople.js';

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
  document.body.appendChild(container);
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

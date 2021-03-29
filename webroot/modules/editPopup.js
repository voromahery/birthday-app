import { editPopup } from './edit.js';
import { table } from './elements.js';

// Remove popup
export function removeEditPopup(form) {
    form.classList.remove("open");
    // Delete the popup right after
    form.remove();
    // Remove it from javascript memory
    form = null;
  }
  
  // Edit person
   export function editPers(e) {
    // Grab the edit button
    const editButton = e.target.closest(".edit");
  
    if (editButton) {
      const buttonId = editButton.id;
      editPopup(buttonId);
      table.dispatchEvent(new CustomEvent("updateList"));
    }
  }
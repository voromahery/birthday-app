import { table } from './elements.js';
import { deleteId } from './deleteModal.js';

export function deletePers(e) {
    // Grab the delete button
    const deleteButton = e.target.closest(".delete");
  
    if (deleteButton) {
      const buttonId = deleteButton.id;
      deleteId(buttonId);
      table.dispatchEvent(new CustomEvent("updateList"));
    }
  }
  
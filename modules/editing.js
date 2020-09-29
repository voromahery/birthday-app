import { table } from './elements.js';
import { editPopup } from './edit-popup.js';

// Edit person 
export async function editPers(e) {
    // Grab the edit button
    const editButton = e.target.closest('.edit');

    if (editButton) {
        const buttonId = editButton.id;
        editPopup(buttonId);
        table.dispatchEvent(new CustomEvent('updateList'));
    }
}
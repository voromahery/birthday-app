import { editPopup } from './edit-popup.js';
import { table } from './elements.js';

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
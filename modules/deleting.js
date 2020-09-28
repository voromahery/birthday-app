import { table } from './elements.js';
import { deleteId } from './index.js';

// Delete icon
export async function deletePers(e) {
    // Grab the delete button
    const deleteButton = await e.target.closest('.delete');

    if (deleteButton) {
        const buttonId = deleteButton.id;
        deleteId(buttonId);
        table.dispatchEvent(new CustomEvent('updateList'));
    }
}

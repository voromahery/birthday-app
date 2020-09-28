// Remove popup
export async function removeEditPopup(form) {
    form.classList.remove('open');
    // Delete the popup right after
    form.remove();
    // Remove it from javascript memory
    form = null;
}

export async function removeDeletePopup(container) {
    container.classList.remove('open');

    // Delete the popup right after
    container.remove();

    // Remove it from javascript memory
    container = null;
}

export async function removeAddPopup(newForm) {
    newForm.classList.remove('open');

    // Delete the popup right after
    newForm.remove();

    // Remove it from javascript memory
    newForm = null;
}

export function removeAddPopup(newForm) {
  newForm.classList.remove("open");

  // Delete the popup right after
  newForm.remove();

  // Remove it from javascript memory
  newForm = null;
}

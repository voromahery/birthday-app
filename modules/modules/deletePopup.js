export function removeDeletePopup(container) {
  container.classList.remove("open");

  // Delete the popup right after
  container.remove();

  // Remove it from javascript memory
  container = null;
}

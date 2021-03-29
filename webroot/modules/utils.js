import { body } from './elements.js';

// Convert the date into two digits month and day
export const dateToday = new Date(Date.now());
export const dateMax = `${dateToday.getFullYear()}-${(
  "0" +
  (dateToday.getMonth() + 1)
).slice(-2)}-${("0" + dateToday.getDate()).slice(-2)}`;

// Styling the scroll
export function hideScrollBar() {
  body.style.overflowY = "hidden";
}

export function showScrollBar() {
  body.style.overflowY = "visible";
}

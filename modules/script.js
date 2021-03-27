import { addData } from "./modules/displayPeople.js";
import { deletePers } from "./modules/deletePerson.js";
import { editPers } from "./modules/editPopup.js";
import {
  table,
  addButton,
  searchName,
  searchMonth,
  body,
} from "./modules/elements.js";

// Grab all necessary elements and files
const myData = "./people.json";

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

// Created an empty array to store the data.
export let personData = [];

////////////////////////////////LOCAL STORAGE//////////////////////////////////////////////////
// Add to local storage
async function addToLocalStorage() {
  // Change the array of object into string in order to display it on local storage
  localStorage.setItem("personData", JSON.stringify(personData));
}

// Even if the page is refreshed, our object is stil there.
async function restoreData() {
  // changes a string into an object.
  const people = JSON.parse(localStorage.getItem("personData"));
  // Check if there is something in the local storage
  if (people) {
    personData = people;
  }
  if (!people) {
    // Fetch the data
    const response = await fetch(myData);
    // Convert the string into an object
    const resource = await response.json();
    // Store the resource in the empty array
    personData = [...resource];
    addData(personData);
  }
  table.dispatchEvent(new CustomEvent("updateList"));
}

async function fetchData() {
  // Fetch the data
  const response = await fetch(myData);
  // Convert the string into an object
  const resource = await response.json();
  // Store the resource in the empty array
  personData = [...resource];
  restoreData(personData);
  addData(personData);
  table.dispatchEvent(new CustomEvent("updateList"));
  return personData;
}

fetchData();

//////////////////////////////////////// EDIT A PERSON ///////////////////////////////////////////////////////


/////////////////////////////////////////// ADD A NEW PERSON /////////////////////////////////////

// Remove popup
async function removeAddPopup(newForm) {
  newForm.classList.remove("open");

  // Delete the popup right after
  newForm.remove();

  // Remove it from javascript memory
  newForm = null;
}

//////////////////////// SEARCH BAR ///////////////////////////////////////////////

const filterData = () => {
  const searchByName = searchName.value.toLowerCase();
  const searchByMonth = searchMonth.value.toLowerCase();
  const filteredPeople = personData.filter((person) => {
    return (
      person.firstName.toLowerCase().includes(searchByName) ||
      person.lastName.toLowerCase().includes(searchByName)
    );
  });

  const filterByMonth = filteredPeople.filter((person) => {
    const month = new Date(person.birthday).toLocaleString("default", {
      month: "long",
    });
    return month.toLowerCase().includes(searchByMonth);
  });
  addData(filterByMonth);
};

// Event listener
searchName.addEventListener("keyup", filterData);
searchMonth.addEventListener("change", filterData);

table.addEventListener("click", deletePers);
table.addEventListener("click", editPers);

table.addEventListener("updateList", addToLocalStorage);
table.addEventListener("updateList", deletePers);
table.addEventListener("updateList", editPers);

restoreData();

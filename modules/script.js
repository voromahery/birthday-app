import { addData } from "./modules/displayPeople.js";
import { deletePers } from "./modules/deletePerson.js";
import { editPers } from "./modules/editPopup.js";
import { filterData } from "./modules/search.js";
import {
  table,
  searchName,
  searchMonth,
  // body,
  // addButton,
} from "./modules/elements.js";
import { newForm } from "./modules/add.js";
const myData = "./people.json";
export let personData = [];

////////////////////////////////LOCAL STORAGE//////////////////////////////////////////////////
// Add to local storage
async function addToLocalStorage() {
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

searchName.addEventListener("keyup", filterData);
searchMonth.addEventListener("change", filterData);

table.addEventListener("click", deletePers);
table.addEventListener("click", editPers);

table.addEventListener("updateList", addToLocalStorage);
table.addEventListener("updateList", deletePers);
table.addEventListener("updateList", editPers);

restoreData();
fetchData();

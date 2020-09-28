import { table } from './elements.js';
import { addData } from './script.js';
import { removeDeletePopup } from './remove-popup.js';

const myData = "./people.json";

// Created an empty array to store the data.
export let personData = [];

// Add to local storage
export async function addToLocalStorage() {
    // Change the array of object into string in order to display it on local storage
    localStorage.setItem('personData', JSON.stringify(personData));
};

export async function fetchData() {
    // Fetch the data
    const response = await fetch(myData);
    // Convert the string into an object 
    const resource = await response.json();
    // Store the resource in the empty array
    personData = [...resource];
    restoreData(personData);
    addData(personData);
    table.dispatchEvent(new CustomEvent('updateList'));
    return personData;
}

fetchData();

// Even if the page is refreshed, our object is stil there.
export async function restoreData() {
    // changes a string into an object.
    const people = JSON.parse(localStorage.getItem('personData'));
    // Check if there is something in the local storage
    if (people) {
        personData = people;
    } if (!people) {
        // Fetch the data
        const response = await fetch(myData);
        // Convert the string into an object 
        const resource = await response.json();
        // Store the resource in the empty array
        personData = [...resource];
        addData(personData);
    }
    table.dispatchEvent(new CustomEvent('updateList'));
}

export async function deleteId(id) {
    const findPers = personData.find(person => person.id == id);

    // Create an element to insert the card
    const container = document.createElement('div');
    container.classList.add('container');

    const html = `
        <div class="card">
            <h3>Are you sure that you want to delete ${findPers.firstName}?</h3>
        <div>
            <button class="delete-confirm">Yes</button>
            <button class="undelete">No</button>
        </div>
        `;

    container.innerHTML = html;

    // Add to the body
    document.body.appendChild(container);
    container.classList.add('open');

     async function deleteConfirmation(e) {
        // If yes is clicked.
        const confirmButton = e.target.matches('.delete-confirm');
        if (confirmButton) {
            const personId = personData.filter(person => person.id != id);
            personData = personId;
            addData(personId);
            removeDeletePopup(container);
            console.log(personId);
            table.dispatchEvent(new CustomEvent('updateList'));
        }

        // If no and the empty space are clicked
        const remove = e.target.matches('.container');
        const cancelButton = e.target.matches('.undelete');

        if (cancelButton || remove) {
            removeDeletePopup(container);
            table.dispatchEvent(new CustomEvent('updateList'));
        }
    }

    // Event for the button Yes and No
    window.addEventListener('click', deleteConfirmation);
    // table.addEventListener('updateList', deleteConfirmation);
    table.dispatchEvent(new CustomEvent('updateList'));
}


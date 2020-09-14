// const { async } = require("regenerator-runtime");

// Grab all necessary elements and files
const myData = "./people.json";
const table = document.querySelector('tbody');

// Fetch the data
async function fetchData() {
    let response = await fetch(myData);
    // Convert the string into an object 
    let resource = await response.json(myData);
    addData(resource);
    return resource;
}
 fetchData();

async function addData(resource) {
    // Sort the date by those who have birthday sooner
    const sortBirthdate = await resource.sort((a, b) => a.birthday - b.birthday);
    // Create an html
    const html = await sortBirthdate.map(person =>  `
			  <tr>
                <td>
                <img src="${person.picture}" alt="person-avatar" class="rounded-circle">
                </td>
				<td>${person.firstName}</td>
				<td>${person.birthday}</td>
                <td>
                    <button class="edit rounded-sm" id=${person.id}>Edit</button>
                </td>
                <td>
                    <button class="delete rounded-sm" id=${person.id}>Delete</button>
                </td>
			  </tr>
    `).join('');
    // Insert it into the DOM
    table.innerHTML = html;
}


// Delete icon
async function deletePers(e) {
    // Grab the delete icon
    const deleteButton = await e.target.closest('.delete');
    if (deleteButton) {
        const buttonId = deleteButton.id;
        deleteId(buttonId);
    }
}

async function deleteId(id) {
    // Create an element to insert the card
const container = document.createElement('div');
container.classList.add('container');
const html = `
        <div class="card">
            <h3>Are you sure that you want to delete?</h3>
        <div>
            <button class="delete-confirm">Yes</button>
            <button class="undelete">No</button>
        </div>
        `;
container.innerHTML= html;
// Add to the body
document.body.appendChild(container);
container.classList.add('open');
}

window.addEventListener('click', deletePers);

// create an html

// Insert the html to the DOM

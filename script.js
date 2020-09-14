// const { async } = require("regenerator-runtime");

// Grab all necessary elements
const myData = "./people.json";
const table = document.querySelector('tbody');
// Fetch the data
async function fetchData() {
    const response = await fetch(myData);
    // Convert the string into an object 
    const resource = await response.json(myData);
    console.log(resource);
    addData(resource);
    return resource;
}
fetchData();

async function addData(resource) {
    // Sort the date by those who have birthday sooner
    const sortBirthdate = await resource.sort((a, b) => a.birthday - b.birthday);
    // Create an html
    const html = await sortBirthdate.map(person => `
			  <tr>
				<td>${person.picture}</td>
				<td>${person.firstName}</td>
				<td>${person.birthday}</td>
                <td>
                    <button>Edit</button>
                </td>
                <td>
                    <button>Delete</button></td>
			  </tr>
    `).join('');
    // Insert it into the DOM
    table.innerHTML = html;
}


// Delete icon
// Grab the delete icon

// create an html

// Insert the html to the DOM

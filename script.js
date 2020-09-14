// import "regenerator-runtime/runtime";

// Grab all necessary elements
const myData = "./people.json";

// Fetch the data
async function fetchData() {
    const response = await fetch(myData);
    // Convert the string into an object 
    const resource = await response.json(myData);
    console.log(resource);
    return resource;
}
fetchData();

// Create an html

// Sort the date by those who have birthday sooner

// Insert it into the dom


// Delete icon
// Grab the delete icon

// create an html

// Insert the html to the DOM

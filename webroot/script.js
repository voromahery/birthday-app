// Grab all necessary elements and files
const myData = "./people.json";
const table = document.querySelector(".data");
const addButton = document.querySelector(".add-button");
const searchName = document.querySelector(".search-name");
const searchMonth = document.querySelector("#search-month");
// Created an empty array to store the data.
let personData = [];

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

async function addData(personData) {
  let currentYear = new Date().getFullYear();
  const dateNow = Date.now();
  const actualDate = new Date(Date.now());
  const time = personData.map((person) => {
    const birthDateMonth = new Date(person.birthday).getMonth();
    const birthDateDay = new Date(person.birthday).getDate();
    const date = `${birthDateMonth + 1}/${birthDateDay}/${currentYear}`;
    const dateTime = new Date(`${date}`);
    const dateMiliseconds = dateTime.getTime();
    const dateDiff = dateMiliseconds - dateNow;
    let daysToGo = Math.round(dateDiff / (1000 * 60 * 60 * 24));
    if (daysToGo < 0) {
      daysToGo = daysToGo + 365;
    }
    const birthday = person.birthday;
    const arr = date.split("/");
    const monthIndex = parseInt(arr[0], 10) - 1;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const birthMonths = monthNames[monthIndex];
    // const diff = (Math.round((dateNow - birthday) / (1000 * 60 * 60 * 24 * 365)));

    let birthDate = "";
    if (arr[1] == 1 || arr[1] == 21 || arr[1] == 31) {
      birthDate = `${arr[1]}st`;
    } else if (arr[1] == 2 || arr[1] == 22) {
      birthDate = `${arr[1]}nd`;
    } else if (arr[1] == 3) {
      birthDate = `${arr[1]}rd`;
    } else {
      birthDate = `${arr[1]}th`;
    }
    const ages = actualDate.getFullYear() - new Date(birthday).getFullYear();
    const persons = {
      firstName: person.firstName,
      lastName: person.lastName,
      id: person.id,
      birthday: person.birthday,
      daysLeft: daysToGo,
      picture: person.picture,
      age: ages,
      month: birthMonths,
      birthDate: birthDate,
    };
    return persons;
  });

  // };

  // Sort the date by those who have birthday sooner
  const sortBirthdate = await time.sort((a, b) => a.daysLeft - b.daysLeft);
  // Create an html
  const html = await sortBirthdate
    .map(
      (person) => `
			  <div class="${person.daysLeft === 0 ? "birthday" : "card"}">
          <figure>
            <img src="${person.picture}" alt="${person.firstName}-avatar" class="rounded-circle">
          </figure>
          <div>
            <h3 class="person-name">${person.firstName}</h3>
                    <p class="birthdate">Turns <span class="person-age">${person.age}</span> on ${person.month} ${person.birthDate}<p> 
          </div>
          <div>
            <p class="days-remaining">In ${person.daysLeft} ${person.daysLeft === 0 || person.daysLeft === 1 ? "day" : "days"}</p>
            <div>
              <button class="edit" id=${person.id}>Edit</button>
              <button class="delete" id=${person.id}>Delete</button>
            </div>
          </div>
			  </div>
    `
    )
    .join("");
  // Insert it into the DOM
  table.innerHTML = html;
  table.dispatchEvent(new CustomEvent("updateList"));
}

// Remove popup
async function removeEditPopup(form) {
  form.classList.remove("open");
  // Delete the popup right after
  form.remove();
  // Remove it from javascript memory
  form = null;
}

// Edit person
async function editPers(e) {
  // Grab the edit button
  const editButton = e.target.closest(".edit");

  if (editButton) {
    const buttonId = editButton.id;
    editPopup(buttonId);
    table.dispatchEvent(new CustomEvent("updateList"));
  }
}

async function editPopup(id) {
  // Find the person by his/her id
  const findPers = personData.find((person) => person.id == id);
  // Create an element to store an html
  const form = document.createElement("form");
  form.classList.add("edit-form");
  const formHtml = `
    <fieldset class="edit-field">
        <label for="first-name">First name
            <input type="text" name="firstname" id="firstname" value="${
              findPers.firstName
            }">
        </label>
        <label for="last-name">Last name
            <input type="text" name="lastname" id="lastname" value="${
              findPers.lastName
            }">
        </label>
        <label for="birthday">Birthday
            <input type="date" name="birthday" id="birthday" value="${new Date(
              findPers.birthday
            ).getDate()}/${new Date(findPers.birthday).toLocaleString(
    "default",
    { month: "long" }
  )}/${new Date(findPers.birthday).getFullYear()}">
        </label>
        <label for="picture">Picture
            <input type="url" name="picture" id="picture" value="${
              findPers.picture
            }">
        </label>
        <div class="buttons">
            <button class="save" type="submit" id=${findPers.id}>Save</button>
            <button class="cancel" type="submit" id=${
              findPers.id
            }>cancel</button>
        </div>
    </fieldset>
    `;
  form.innerHTML = formHtml;

  // If save is clicked
  const editConfirm = (e) => {
    const confirm = e.target.closest(".save");
    if (confirm) {
      const formData = e.currentTarget;
      console.log("form", formData);
      removeEditPopup(form);
      e.preventDefault();

      let myPeople = {
        firstname: formData.firstname.value,
        lastname: formData.lastname.value,
        picture: formData.picture.value,
        birthday: formData.birthday.value,
        id: findPers.id,
      };

      findPers.lastName = myPeople.lastname;
      findPers.firstName = myPeople.firstname;
      findPers.picture = myPeople.picture;
      findPers.birthday = myPeople.birthday;
      findPers.id = myPeople.id;

      addData(personData);
      table.dispatchEvent(new CustomEvent("updateList"));
    }
  };

  // If the empty space or the cancel button is clicked
  const cancelEdit = (e) => {
    const cancel = e.target.closest(".cancel");
    const removeForm = e.target.matches(".edit-form");
    if (cancel || removeForm) {
      removeEditPopup(form);
      table.dispatchEvent(new CustomEvent("updateList"));
    }
  };

  // Add to the body
  document.body.appendChild(form);
  form.classList.add("open");
  form.addEventListener("click", editConfirm);
  window.addEventListener("click", cancelEdit);
}

// Delete icon
async function deletePers(e) {
  // Grab the delete button
  const deleteButton = await e.target.closest(".delete");

  if (deleteButton) {
    const buttonId = deleteButton.id;
    deleteId(buttonId);
    table.dispatchEvent(new CustomEvent("updateList"));
  }
}

//////////////////////////////// DELETE PERSON /////////////////////////////////////////////

// Remove popup
async function removeDeletePopup(container) {
  container.classList.remove("open");

  // Delete the popup right after
  container.remove();

  // Remove it from javascript memory
  container = null;
}

async function deleteId(id) {
  const findPers = personData.find((person) => person.id == id);

  // Create an element to insert the card
  const container = document.createElement("div");
  container.classList.add("container");

  const html = `
        <div class="delete-card">
            <h3>Are you sure that you want to delete ${findPers.firstName}?</h3>
        <div>
            <button class="delete-confirm">Yes</button>
            <button class="undelete">No</button>
        </div>
        `;

  container.innerHTML = html;

  // Add to the body
  document.body.appendChild(container);
  container.classList.add("open");

  async function deleteConfirmation(e) {
    // If yes is clicked.
    const confirmButton = e.target.matches(".delete-confirm");
    if (confirmButton) {
      const personId = personData.filter((person) => person.id != id);
      personData = personId;
      addData(personId);
      removeDeletePopup(container);
      console.log(personId);
      table.dispatchEvent(new CustomEvent("updateList"));
    }

    // If no and the empty space are clicked
    const remove = e.target.matches(".container");
    const cancelButton = e.target.matches(".undelete");

    if (cancelButton || remove) {
      removeDeletePopup(container);
      table.dispatchEvent(new CustomEvent("updateList"));
    }
  }

  // Event for the button Yes and No
  window.addEventListener("click", deleteConfirmation);
  // table.addEventListener('updateList', deleteConfirmation);
  table.dispatchEvent(new CustomEvent("updateList"));
}

/////////////////////////////////////////// ADD A NEW PERSON /////////////////////////////////////

// Remove popup
async function removeAddPopup(newForm) {
  newForm.classList.remove("open");

  // Delete the popup right after
  newForm.remove();

  // Remove it from javascript memory
  newForm = null;
}

// Add a new person
addButton.addEventListener("click", (e) => {
  // Create an element to store an html
  const newForm = document.createElement("form");
  newForm.classList.add("add-new-person");
  const newFormHtml = `
     <fieldset class="edit-field">
         <label for="first-name">First name
             <input type="text" name="firstname" id="firstname" value="">
         </label>
         <label for="last-name">Last name
             <input type="text" name="lastname" id="lastname" value="">
         </label>
         <label for="birthday">Birthday
             <input type="date" name="birthday" id="birthday" value="">
         </label>
         <label for="picture">Picture
             <input type="url" name="picture" id="picture" value="">
         </label>
         <div class="buttons">
             <button class="add save" type="submit">Save</button>
             <button class="cancel-add" type="button">cancel</button>
         </div>
     </fieldset>
     `;
  newForm.innerHTML = newFormHtml;
  // Add to the body
  document.body.appendChild(newForm);
  newForm.classList.add("open");

  // Add an event for the newForm
  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const addForm = e.currentTarget;

    let myPerson = {
      id: Date.now(),
      firstName: addForm.firstname.value,
      lastName: addForm.lastname.value,
      picture: addForm.picture.value,
      birthday: addForm.birthday.value,
    };

    // Add the new person to the Array: personData
    personData.push(myPerson);
    console.log(myPerson.birthday);

    addData(personData);
    table.dispatchEvent(new CustomEvent("updateList"));
    removeAddPopup(newForm);
  });

  // When the empty space or the cancel button is clicked
  window.addEventListener("click", (e) => {
    const removeForm = e.target.matches(".add-new-person");
    const cancelAdd = e.target.closest(".cancel-add");
    if (cancelAdd || removeForm) {
      removeAddPopup(newForm);
      console.log("cancelled");
    }
  });
});

//////////////////////// SEARCH BAR ///////////////////////////////////////////////

// create a search bar
searchName.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchByName = searchName.value.toLowerCase();
  const filteredPeople = personData.filter((person) => {
    return person.firstName.toLowerCase().includes(searchByName);
  });
  addData(filteredPeople);
});

searchMonth.addEventListener("change", (e) => {
  e.preventDefault();
  const searchByMonth = searchMonth.value.toLowerCase();
  const filterByMonth = personData.filter((person) => {
    const month = new Date(person.birthday).toLocaleString("default", {
      month: "long",
    });
    return month.toLowerCase().includes(searchByMonth);
  });
  addData(filterByMonth);
});

// Event listener
table.addEventListener("click", deletePers);
table.addEventListener("click", editPers);

table.addEventListener("updateList", addToLocalStorage);
table.addEventListener("updateList", deletePers);
table.addEventListener("updateList", editPers);

restoreData();
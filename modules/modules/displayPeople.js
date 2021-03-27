import { dateToday } from "../script.js";
import { table } from "./elements.js";

export function addData(personData) {
  let currentYear = dateToday.getFullYear();

  const time = personData.map((person) => {
    const birthDateMonth = new Date(person.birthday).getMonth();
    const birthDateDay = new Date(person.birthday).getDate();
    const date = `${birthDateMonth + 1}/${birthDateDay}/${currentYear}`;
    const dateTime = new Date(`${date}`);
    const dateInMilliseconds = dateTime.getTime();
    const dateDiff = dateInMilliseconds - dateToday;
    let daysToGo = Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
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

    const ages = dateToday.getFullYear() - new Date(birthday).getFullYear();
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

  // Sort the date by those who have birthday sooner
  const sortBirthdate = time.sort((a, b) => a.daysLeft - b.daysLeft);
  // Create an html
  const html = sortBirthdate
    .map((person) => {
      let dayLeft = "";
      let daysIndicator = "";
      if (person.daysLeft === 1) {
        dayLeft = `In ${person.daysLeft} day`;
        daysIndicator = `tomorrow`;
      }
      if (person.daysLeft === 0) {
        dayLeft = `🎂🎂 Happy birthday ${person.firstName} ${person.lastName} 🎂🎂`;
        daysIndicator = `today`;
      }
      if (person.daysLeft > 1) {
        dayLeft = `In ${person.daysLeft} days`;
        daysIndicator = `on ${person.month} ${person.birthDate}`;
      }

      return `
                <div class="${person.daysLeft === 0 ? "birthday" : "card"}">
            <div class="wrapper">
              <figure>
                <img src="${person.picture}" alt="${
        person.firstName
      }-avatar" class="rounded-circle">
              </figure>
            <div>
            <h3 class="person-name">${person.firstName} ${person.lastName}</h3>
                    <p class="birthdate">Turns <span class="person-age">${
                      person.age
                    }</span> ${daysIndicator}<p> 
          </div>
            </div>
            <div>
              <p class="days-remaining">${dayLeft}</p>
              <div class="icons-container">
              <img src="./icons/edit-icon.svg" class="edit" id=${
                person.id
              } alt="blue-icon">
          <img src="./icons/delete-icon.svg" class="delete" id=${
            person.id
          } alt="red-icon">
              </div>
            </div>
                </div>
      `;
    })
    .join("");
  // Insert it into the DOM
  table.innerHTML = html;
  table.dispatchEvent(new CustomEvent("updateList"));
}

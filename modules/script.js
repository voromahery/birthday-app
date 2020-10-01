import { table , addButton, searchName, searchMonth } from './elements.js';
import { restoreData, addToLocalStorage, personData } from './index.js';
import { editPers } from './editing.js';
import { addPers } from './adding.js';
import { deletePers } from './deleting.js';

export async function addData(personData) {
    const dateNow = new Date(Date.now());
    const time = personData.map(person => {
        const dateBirthday = new Date(person.birthday);
        const day = dateBirthday.getDate();
        const timeDiff = Math.abs(dateBirthday.getTime() - dateNow.getTime());
        const dateMiliseconds = dateBirthday.getTime();
        const dateDiff = dateMiliseconds - dateNow;
    
        // 1000 * 3600 * 24 millisecond per day
        let dayDiff = Math.round(dateDiff / (1000 * 3600 * 24));
        let daysLeft = dayDiff;
        const age = dateNow.getFullYear() - new Date(person.birthday).getFullYear();
        const month = new Date(person.birthday).toLocaleString('default', { month: 'long' });
        const monthNumber = dateBirthday.getMonth();
        let days = new Date(person.birthday).getDate();
        let year = dateBirthday.getFullYear();

        if (monthNumber === dateNow.getMonth()) {
             daysLeft = (days - dateNow.getDate());
        } else if (daysLeft < 0 && year === dateNow.getFullYear()) {
            daysLeft = dayDiff + 365;
        } else if (year < dateNow.getFullYear()) {
            daysLeft = (dayDiff + (365 * age)) + 365;
        }

        if (days === 1 || days === 21 || days === 31) {
            days = `${days}st`;
        } else if (days === 2 || days === 22) {
            days = `${days}nd`;
        } else if (days === 3 || days === 23) {
            days = `${days}rd`;
        } else {
            days = `${days}th`;
        };

        const date = {
            picture: person.picture,
            firstName: person.firstName,
            lastName: person.lastName,
            birthday: person.birthday,
            id: person.id,
            month: month,
            age: age,
            days: days,
            daysLeft: daysLeft,
        }
        return date;
    });

    // Sort the date by those who have birthday sooner
    const sortBirthdate = await time.sort((a, b) => a.daysLeft - b.daysLeft);
    // Create an html
    const html = await sortBirthdate.map(person => `
			  <tr class="${person.daysLeft === 0 ? 'birthday' : ''}">
                <td>
                <img src="${person.picture}" alt="${person.firstName}-avatar" class="rounded-circle">
                </td>
                <td>
                    <h3>${person.firstName}</h3>
                    Turns ${person.age}
                     on ${person.month}
                     ${person.days} 
                </td>
                <td>
                    <h3>${person.daysLeft}<br> Days</h3>
                </td>
                <td>
                    <button class="edit" id=${person.id}>Edit</button>
                </td>
                <td>
                    <button class="delete" id=${person.id}>Delete</button>
                </td>
			  </tr>
    `).join('');
    // Insert it into the DOM
    table.innerHTML = html;
    table.dispatchEvent(new CustomEvent('updateList'));
}

////////////////////////// SEARCH BAR ///////////////////////////////////////////

// create a search bar
search.addEventListener('keyup', e => {
    e.preventDefault();
    const searchByName = searchName.value.toLowerCase();
    const filteredPeople = personData.filter(person => {
        return (
            person.firstName.toLowerCase().includes(searchByName)
        );
    });
    addData(filteredPeople);
})

searchMonth.addEventListener('change', e => {
    e.preventDefault();
    const searchByMonth = searchMonth.value.toLowerCase();
    const filterByMonth = personData.filter(person => {
        const month = new Date(person.birthday).toLocaleString('default', { month: 'long' });
        return (
            month.toLowerCase().includes(searchByMonth)
        );
    });
    addData(filterByMonth);
})




// Event listener
table.addEventListener('click', deletePers);
table.addEventListener('click', editPers);
addButton.addEventListener('click', addPers);

table.addEventListener('updateList', addToLocalStorage);
table.addEventListener('updateList', deletePers);
table.addEventListener('updateList', editPers);

restoreData();

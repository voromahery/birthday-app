import { personData } from './../script.js';
import { addData } from './displayPeople.js';
import { searchName, searchMonth } from "./elements.js";

export const filterData = () => {
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


searchName.addEventListener("keyup", filterData);
searchMonth.addEventListener("change", filterData);
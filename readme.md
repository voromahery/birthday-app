# Term 3 JS Project : Birthday App

- In a few sentences, explain the structure of your project.

## Structure of the project

### 1- General

- Firstly, I grab all the elements that I needed from the html and the data  that contains the list of people from the json file.

- Secondly, I created an empty array to store my data, then I added my data to local storage.

- After all of that, the data in people.json is fetched then added inside the empty array.

- In the fourth part, a function that contain all of the html structure for the data is created, then sorted all person by the day left until their birthday. That means, the one who has nearer birthday is the first then the on who has next, and so on.

- After that, the html that is created is added inside the table element that has been grabbed.

### 2- For the delete

- Firstly, `filter()` is used to filter the people that have different `id` to the target.

- Secondly, popup that contains two buttons: **confirming** and **cancelling**, then added that html inside a container that we have grabbed.

- The two buttons are grabbed by using `e.target.closest()`. If the **confirming** button is clicked, a person will be deleted and the popup will disappear. However, if **cancel** is clicked, the list will stay the same because nothing is deleted and the popup will also disappear.

### 3- For edit

- Firstly, `find()` is used to get the person wo has the same id as the target.

- Secondly, form is created to edit each person. The same as delete popup, if the confirm or the cancel button is clicked, the form will immediately disappear, but for confirm, everything that is changed will appear on DOM. However, for the cancel, nothing will be changed.

### 4- For adding

- A form is created and then, pushed the value of that form in the empty array so that we can both store it in the local storage and display it on the DOM.

## 5- For searching

- I created a new input and select in the HTML then, I grabbed them to the Javascript.
- After that, I filtered all the name that has the same character as the input value so that they return what is searched.

## Any improvement

- I still need to work on the day left until the next birthday because mine gives more than thousand days

## Most challenging part

- Counting the day left of the person until the next birthday is the most challenging and also sorting it.

## More explanation about a specific part

- I need more explanation on how to use the `date-fns` because when I tried to use it, it throws an error.

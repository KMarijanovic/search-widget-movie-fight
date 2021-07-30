//REUSEABLE CODE - AUTOCOMPLETE WIDGET
//by extractiong this logic to this separate file, you can take this file and add it to any project that usese Bulma CSS framework

//destructuring root element is provided as an option
//createAutoComplete() no longer on its own has to figure out where to render the autocomplete
//destructuring functions, now there is no direct window scope access between these two different files (index.js & autocomplete.js)

//we're creating all of our HTML on JS side with Bulma:
//need to use backticks `` instead of single line '' to create multi-lines string in JS when working with '.innerHTML'!
//goal here is to create entirely reuseable widget:

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;
  //selecting from the root element:
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  // DEBOUNCING AN INPUT - waiting for some time to pass after the last event to actually do something:
  //we must mark the function to be 'async' because we work with axios:
  const onInput = async event => {
    const items = await fetchData(event.target.value);  //needs to be 'await' infront!

    if (!items.length) {
      //if there are no movies/empty search, close the dropdown:
      dropdown.classList.remove('is-active');
      //we return this function because we don't want to try render anything or open the dropdown back up:
      return;
    }

    resultsWrapper.innerHTML = '';  //to clear results after search when user is searching for another movie
    dropdown.classList.add('is-active');  //adding class 'is-active' for a dropdown menu = dropdown open!

    for (let item of items) { //going over every movie we got in results
      const option = document.createElement('a'); //create links!
      option.classList.add('dropdown-item');  //adding class 'dropdown-item'

      //creating the look of our element by .innerHTML calling the renderOption() with the movie we are currently rendering over:
      //extracting some custom logic that is only appropriate for this movie related stuff:
      option.innerHTML = renderOption(item);

      //update the value of the input and close the dropdown:
      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active'); //close the dropdown!
        input.value = inputValue(item); //update the value of input
        onOptionSelect(item); //this is another 'helper function'!
      });

      //on 'results' we append 'option':
      resultsWrapper.appendChild(option);
    }
  };
  input.addEventListener('input', debounce(onInput, 500));
  //default delay we coded to be 1000 milisecond but we can change it to half a second (500 milisecond) if we like...

  //'event.target' will tell us what we clicked
  //if we don't click on root elements, close the dropdown:
  //(we click elsewhere - dropdown menu close)
  //if the 'root' element for our element '.autocomplete' doesn't contain the element we just clicked on - we need to close the dropdown:
  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active'); //remove the class 'is-active' = dropdown closed!
    }
  });
};

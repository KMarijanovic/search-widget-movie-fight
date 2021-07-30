//AUTOCOMPLETE WIDGET

//(non-reuseable code for our very specific project)

//tip: all dataset values in the DOM are stored as strings!

//configurationg autocomplete:
//if we ever decide that we want to autocomplete to look very different,
//we only have to update the renderOption() here:

const autoCompleteConfig = {
  renderOption(movie) {
    //TERINARY EXPRESSION:
    //'?' = 'then'  ':' = 'otherwise'
    //this is for handling broken images if they appear in our search if movie doesn't have its Poster:
    //(if we show and img element with an empty string, it will technically show up on DOM but wont on screen)
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    //creating the look of our element by return:
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  //giving the source of input.value:
  //1. take a movie after the user clicks on the option
  //2. call the inputValue() with the movie
  //3. return the whatever value should show of inside of the input:
  inputValue(movie) {
    return movie.Title;
  },
  //how to fetch the data:
  //network request with axios library:
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      //nicer way of writing by putting an object called 'params' which keys will be added at the end of the 'https://...' URL
      //key name is written in lowercase, it's not 'apiKey'!
      params: {
        apikey: '156da7a', //(my apikey - please use your own for free from the website - thank You!)
        //code for 'search' operation (specifying 's' property / 'search' on API website):
        //s: 'avengers', <--- example if someone types 'avengers' it would give us everything containing that word
        //we call it here 'searchTerm'!
        s: searchTerm
      }
    });
    //if response has an error property - we will return an empty array
    //this is for situation when user types half of the word of the title he is looking for
    //our API doesn't gives us(recognize) results of movies if we type just hafl of the word from title like 'aveng' instead of 'avengers'
    //this code would say 'we didn't get any movie to show to the user' and if there is an Error, it would return an empty string!
    if (response.data.Error) {
      return [];
    }
    //console.log(response.data);
    //.data is an actual information we are looking for!
    //this is the particular information we need from the response:
    //(- it's 'Search' part with capital letter S because it is what the API gives us/have!)
    return response.data.Search;
  }
};
//'...' means make a copy of everything
//1. create the new object
//2. take all of the properties inside of autoCompleteConfig that we defined at the top of the file
//3. add in this new property of root
//4. take that whole object and pass it off to create autocomplete
//5. create left autocomplete at root element with class (where to render the autocomplete to):
//left-hand side:
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  //onOptioSelect() we deciding what to do when user clicks on one:
  onOptionSelect(movie) {
    //hiding div tutorial when displaying movie by adding Bulma class for hide:
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); //reference where to render the summary to
  }
});
//right-hand side:
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;
//helper function:
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: '156da7a',
      //code for 'individual look up' operation (specifying 'i' property / 'i' on API website/ movie IMDB info):
      //we want that info to come from the movie we selected:
      i: movie.imdbID
    }
  });
  //we're selecting 'summaryElement', making innerHTML to be of 'movieTemplate'
  //response.data means the result we get from code that is returned (the big object we get with all the details)
  summaryElement.innerHTML = movieTemplate(response.data);

  //updating left or right side:
  //if both variables are updated, we have movies on both side of the screen
  if (side === 'left') {
    //update leftMovie variable:
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  //running the comparison:
  if (leftMovie && rightMovie) {
    runComparison(); //helper function
  }
};

//helper function:
//inside we iterate two different movies
const runComparison = () => {
  console.log('Time for comparison.');
  //selecting left and right side:
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  //'leftStat' represents article element
  //stats can occur in any different order
  //we assigned stats up front inside of our 'movieTemplate' - we don't care about the order
  //comparison process here: 
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    //For movies that contain N/A or undefined for some of the values we compare (Box Office, Metascore etc...),
    //parsing them into integer or float will return NaN
    //using parsInt or parseFloat on "non-string numbers" returns NaN

    //compariosn directly between the two:
    //parseFloat() is better than original parseInt()
    //parseFloat() will not remove decimals when comparing between the two
    //value = data-value from our template at the end of code
    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);
    console.log(leftSideValue, rightSideValue);

    //prevent comparing between NaN  or equal values (result will be grey)
    //BoxOffice not working (we don't have access with free API Key) so we make it grey
    //the repeating removing and adding classes to prevent the articles from keeping old classes if you decide to change one summary div:
    if (isNaN(leftSideValue) || isNaN(rightSideValue) || leftSideValue === rightSideValue) {
      leftStat.classList.remove('is-primary'); //left remove blue
      rightStat.classList.remove('is-primary'); //right remove blue
      leftStat.classList.remove('is-warning'); //left remove yellow
      rightStat.classList.remove('is-warning'); //right remove yellow
    } else if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary'); //left remove blue
      leftStat.classList.add('is-warning'); //left add yellow
      rightStat.classList.remove('is-warning'); //right remove yellow
      rightStat.classList.add('is-primary'); //right add blue
    } else {
      rightStat.classList.remove('is-primary'); //right remove blue
      rightStat.classList.add('is-warning'); //right add yelllow
      leftStat.classList.add('is-primary'); //left add blue
      leftStat.classList.remove('is-warning'); //left remove yellow
    }
  });
};

//helper function:
//here we're deciding upfornt to extract all the relevant values and store those values inside of a DOM
//we can easelly pull out those values and runComparison()
//BoxOffice, Metascore, imdbRating etc. you can find in console section/tab Network (Preview)
//movieDetail is detailed object of movie properties
//here we're creating the look of the element when specific movie is selected
const movieTemplate = movieDetail => {
  //replacing dollar sign in string '$629,000,000' with empty string '' which removes it out of string
  //$ sign is protected value so we have to escape it by putting back slash infront of it \$
  //find all the commas and replace it with empty string
  //take the string and turn it into a number with parseInt on entire expression
  //const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const dollars = movieDetail.BoxOffice === 'N/A' ? 0 : parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

  const metascore = parseInt(movieDetail.Metascore);
  //parseFloat() will turn decimal number to round one
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  //whoever has the biggest number in nominations, that one wins:
  //splitting will give us the array where every element of the array is one of the different actual words or numbers
  //all the spaces go away and just the element words we get inside of the array
  //for every actual number in there we're gonna keep some running total and return it
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    //when we parseInt on string that doesn't contain any number, we will get value of NaN (Not A Number)
    const value = parseInt(word);
    //check if value is NaN:
    //isNaN() is function that is built up inside of the browser so we don't have to define it
    if (isNaN(value)) {
      return prev; //return prev = return our current count
    } else {
      count = prev + value; //previous value we got + new value
    }
  }, 0); //our starting value is 0 for reduce

  //our template:
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};


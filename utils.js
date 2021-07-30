//this is the sheild how often a function can be envoked/called:

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args); //call the func as we normally would and take all the arguments or of that array, and pass them in as seperate arguments to the original function!
    }, delay);
  };
};

//explanation:
//debounce function takes 2 arguments:
//1. FUNC - your custom function you wish to throttle
//2. DELAY - delay between each execution of the FUNC function (throttling)

//debounce returns another function back
//returned function is A CLOSURE

//the closure is the one that is responsible for accepting ARGUMENTS of varied length,
//and pass it off to your custom function

//we have no idea how many arguments the function would receive,
//we spread the arguments into an array with ...args

//timeoutId is UNDEFINED the first time the function run
//condition won't evaluate to true

//timeoutId is assigned a new timerID that is returned by setTimeout()
//it sets our delay before the custom function is executed

//to prevent memory leaks, we attempt to clear out previos timer event before initiating the next one

//if a timer event was defined, its id value would be assigned to the timeoutId variable
//we utilize the clearTimeout() function, passing it the id of the timer event we want to clear

//Our onInput function - the one that fetches external data - is executed whenever  "onInput" event occurs.
//In other words, whenever user types or deletes a single character from the input field, the onInput function gets run.
//This behaviour introduces significant performance issues: you simply want to avoid firing http requests as each character is being typed.
//That is why we decorate the OnInput function with DEBOUNCE.
//DEBOUNCE imposes a mandatory cooldown period, where users are not interacting with the input field.
//Once the cooldown period is over, the OnInput function is executed.

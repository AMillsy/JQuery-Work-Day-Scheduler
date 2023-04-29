// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// 24 clock system here but on the page it will be 12 hour clock system
const hours = {
  start: 9,
  end: 22,
};

const fakeTime = 12;

//Gets the data and puts it back into an object.
let workDayData = JSON.parse(localStorage.getItem(`workDayData`));
if(!workDayData) workDayData = {};
$(function () {
  //Render the time slot blocks to the screen
  renderTimeSlots();
  //Put the correct timeslot class on according to the time
  renderTimeBlock();
  //Show the time at the top of the screen
  showCurrentTime();
  $(`.saveBtn`).on(`click`, saveContent);

  setInterval(function(){
    showCurrentTime();
    renderTimeBlock();
  },6000); // 10 minute interval : 600000

  
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});

function renderTimeSlots() {
  //IF YOU HAVE PAST THE TIME: Put past in class
  //IF THE HOUR IS CURRENT HOUR: Put class as present
  //IF HOUR IS IN THE FUTURE: Put class as future

  const timeslotEl = $(`#timeSlot-container`);
  for (let i = hours.start; i <= hours.end; i++) {
    const html = `<div data-hour=${i} class="row time-block">
        <div class="col-2 col-md-1 hour text-center py-3">${
          i >= 12 ? `${i === 12 ? 12 : i - 12}pm` : `${i}am`
        }</div>
        <textarea class="col-8 col-md-10 description" rows="3">${renderContent(i)} </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>`;

    timeslotEl.append(html);
  }
}

//Checks if I have a value at the key, if not, I don't want to render anything
const renderContent = time => {
  return `${workDayData[time] === undefined ? `` : workDayData[time]}`;
}

//Saves the content to local storage based on the key.
function saveContent(e){
  //Get the parent which holds the hour
    const parent = $(e.currentTarget).parents().eq(0);
    //Gets the text from the textArea
    const text = $(e.currentTarget).siblings().eq(1).val();
    if (!text) return;
    //Get the hour from the dataset
    const hour = $(parent).data(`hour`);
   
    //Adding the data to an object
    workDayData[hour] = text;
    localStorage.setItem(`workDayData`, JSON.stringify(workDayData));
};


function showCurrentTime(){
  const currentDayEl = $(`#currentDay`);

  const date = dayjs().format(`dddd, MMMM D YYYY h:mm A`);

  currentDayEl.text(date);
};

//Used if the user is on the website for longer then 15 minutes and

function renderTimeBlock(){
 const timeblocks = $(`.time-block`); 

 for(const block of timeblocks){
  block.classList.remove(`past`);
  block.classList.remove(`present`);
  block.classList.remove(`future`);

  const currentHour = dayjs().hour();
  const blockHour = Number(block.dataset.hour);
    
  
  //Set time block correctly
  if (blockHour < currentHour) block.classList.add(`past`);
  else if (blockHour === currentHour) block.classList.add(`present`);
  else block.classList.add(`future`);
  
 };
    
 
}
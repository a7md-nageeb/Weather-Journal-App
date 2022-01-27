//jshint esversion:8

/* Global Variables */
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const api = "&appid=cce1597d33d7f4362c15aa7620b3bb95&units=metric";
const btn = document.querySelector('#generate');
const errorMsg = document.querySelector('#errorMsg');
const tempSpace = document.querySelector('#temp');
const dateSpace = document.querySelector('#date');
const feelingSpace = document.querySelector('#content');

// Create a new date instance dynamically with JS
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let d = new Date();
let newDate = months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();


//event listener for the button
btn.addEventListener('click', function() {
  //Getting the zipcode value
  const zipcodeInput = document.querySelector('#zip').value;
  //Getting text area value
  const feeling = document.querySelector('#feelings').value;
  //Calling the getTemp function
  getTemp(baseURL, zipcodeInput, api)
  //Post request
    .then(function(data){
      postData('/add', {
        temp: data,
        date: newDate,
        feeling: feeling
      });
    }).then(function(){
      updateUI();
    });
});

//creating getTemp function
const getTemp = async (baseURL, zipcodeInput, api) => {
  //connect the link together with the zipcode entered
  const res = await fetch(baseURL + zipcodeInput + api);
  //try function to run if the zipcode is valid
  try {
    let data = await res.json();
    data = data.main.temp;
    errorMsg.classList.remove("invalid");
    return data;
  //catch function to run if the zipcode is invalid
  } catch (error) {
    console.log("error:", error);
    errorMsg.classList.add("invalid");
  }
};

//Post function
const postData = async (url = '', data = {})=>{
  const res = await fetch (url, {
    method: 'POST',
    credentials: 'same-origin',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           temp: data.temp,
           date: data.date,
           feeling: data.feeling
       })
  });
  try {
    const newData = await res.json();
    return newData;
  } catch(error) {
    console.log("error:", error);
  }
};

//Update UI function
const updateUI = async function(){

  const request = await fetch('/all');

  try {
    const data = await request.json();
    tempSpace.innerHTML = data.temp + ' degree C';
    dateSpace.innerHTML = data.date;
    feelingSpace.innerHTML = data.feeling;
  } catch(error) {
    console.log("error:", error);
  }
};

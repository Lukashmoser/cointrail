if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-A08SvLXIL8YSZoglfySwUDesesEPMIs",
  authDomain: "coin-trail.firebaseapp.com",
  databaseURL: "https://coin-trail-default-rtdb.firebaseio.com",
  projectId: "coin-trail",
  storageBucket: "coin-trail.appspot.com",
  messagingSenderId: "981030871637",
  appId: "1:981030871637:web:b0004637e68cd347fd6adc",
  measurementId: "G-25E4SL971W"
};

// firebase inits
firebase.initializeApp(firebaseConfig);

// global variables
const userList = firebase.database().ref('userList');
let user = null; // current users profile data
let displayname = null; // tmp location for new users displayname
let users = null; // list of users
let uid = null; // tmp location for user id
let userIndex = null; // location of current users profile in database
let corsEnabled = false; // whether or not the user has activated the demo server
var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: new Headers({
    'Authorization': 'Bearer 9441d3f3-fa3a-4aa4-8bb8-924e91d5a299',
    'Accept-Encoding': 'gzip'
  })
}; // request options for fetch request
let savedCoin = ""; // global save of current coin

window.onload = loadUser();

function loadUser(){
  let userFound = false;
  uid = sessionStorage.getItem("user");
  displayname = sessionStorage.getItem("name");

  userList.once('value', function(data){
    users = data.val();
    console.log(users);
    if(users == 0){
      //add first user
      let userData = [{
        uid: uid,
        username: displayname,
        coins: "none"
      }];
      userList.set(userData);
    } else {
      //check if user already exists and run relevant code
      for(let i = 0; i < users.length; i++){
        if(users[i].uid == uid){
          userFound = true;
          user = users[i];
          userIndex = i;
        }
      }
      // if doesn't exist create blank profile and add them to database
      if(!userFound){
        user = {
          uid: uid,
          username: displayname,
          coins: "none"
        };
        userIndex = users.length;
        users[users.length] = user;
        userList.set(users);
      }
    }
    // load welcome message
    document.getElementById("welcome").innerHTML = "Welcome " + user.username;
  }); // once
} // loadUser

function search(elem){
  let coin = document.getElementById(elem).value;
  coin = coin.toLowerCase();
  coin = coin.replace(" ","");
  let url = "https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/" + coin;
  console.log(url);
  if(corsEnabled){
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => loadCoin(result));
  } else {
    document.getElementById("message").innerHTML = "This feature requires cors to be enabled. Please visit the link <a onclick='toggleCORS()' href='https://cors-anywhere.herokuapp.com/corsdemo' target='_blank' rel='noopener noreferrer'>here</a> and click the request temporary access button.";
    show("error-box");
    show("lightbox2");
  }
  
}

function errorCheck(error, elem){
  document.getElementById(elem).value = "";
  let errorMessage = "That isn't the name of a coin. Please check your spelling and try again.";
  document.getElementById("message").innerHTML = errorMessage;
  show("error-box");
  show('lightbox2');
}

function loadCoin(coin){
  if(coin.error != undefined){
    console.log(coin.error);
    let errorMessage = "That isn't the name of a coin. Please check your spelling and try again.";
    document.getElementById("message").innerHTML = errorMessage;
    show("error-box");
    show('lightbox2');
  } else {
    console.log(coin);
    document.getElementById("coin-id").innerHTML = coin.data.name;
    document.getElementById("ticker").innerHTML = coin.data.symbol;
    document.getElementById("current-price").innerHTML = "USD $" + coin.data.priceUsd;
    loadChart(coin.data.id, 'm30');
  }
}

function loadChart(id, interval){
  let baseURL = "https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/";
  let url = "";
  let timeStart = "";
  let timeEnd = Date.now();
  let graphName = "";
  var chart = "";
  switch(interval) {
    case "m30":
      //case for 1 day
      timeStart = timeEnd - 86400000;
      graphName = "Past 24 hours";
      break;
    case "h2":
      //case for 5 days
      timeStart = timeEnd - 432000000;
      graphName = "Past 5 days";
      break;
    case "h12":
      //case for 1 month
      timeStart = timeEnd - 2629800000;
      graphName = "Past 1 month";
      break;
  }
  document.getElementById("chart-title").innerHTML = graphName;

  url = baseURL + id + "/history?interval=" + interval + "&start=" + timeStart + "&end=" + timeEnd;
  console.log(url);
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    let xValues = [];
    let yValues = [];
    for(let i = 0; i < result.data.length; i++){
      xValues[i] = i;
      yValues[i] = result.data[i].priceUsd;
    }
    console.log(result);
    chart = new Chart("chart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0,
          data: yValues
        }] 
      },
      options: {
        legend: {display: false},
        scales: {
          xAxes: [{
              ticks: {
                  display: false //this will remove only the label
              }
          }]
        }
      }
    })
  });


  show("coin-box");
  show("lightbox2");
}

function toggleCORS(){
  corsEnabled = true;
}

function hide(elem){
  document.getElementById(elem).style.display = "none";
} // hide

function show(elem){
  document.getElementById(elem).style.display = "block";
} // show
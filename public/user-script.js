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
var chart; // chart variable;
let chartUsed = false; // whether or not the chart has been loaded
let ta = 0; // store total assets before displaying to screen
let assetAllocation = []; // store how much of each coin you have

window.onload = loadUser();

function loadUser(){
  ta = 0;
  let userFound = false;
  uid = sessionStorage.getItem("user");
  displayname = sessionStorage.getItem("name");

  userList.once('value', function(data){
    users = data.val();
    if(users == 0){
      //add first user
      let userData = [{
        uid: uid,
        username: displayname,
        coins: "none",

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
    // load coins
    if(corsEnabled){
      updateCoins();
    } else {
      document.getElementById("message").innerHTML = "This page requires cors to be enabled. Please visit the link <a onclick='toggleCORS()' href='https://cors-anywhere.herokuapp.com/corsdemo' target='_blank' rel='noopener noreferrer'>here</a> and click the request temporary access button.";
      document.getElementById("ok").setAttribute('onclick', "hide('lightbox2'), hide('error-box'), updateCoins()");
      show("error-box");
      show("lightbox2");
    }
    
  }); // once
} // loadUser

function search(elem){
  let coin = document.getElementById(elem).value;
  coin = coin.toLowerCase();
  coin = coin.replace(" ","");
  let url = "https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/" + coin;
  if(corsEnabled && coin != ""){
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => loadCoin(result));
  } else if(coin == ""){
    document.getElementById("message").innerHTML = "Please enter something to search.";
    show("error-box");
    show("lightbox2");
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
  savedCoin = coin;
  if(coin.error != undefined){
    let errorMessage = "That isn't the name of a coin. Please check your spelling and try again.";
    document.getElementById("message").innerHTML = errorMessage;
    show("error-box");
    show('lightbox2');
  } else {
    document.getElementById("coin-id").innerHTML = coin.data.name;
    document.getElementById("ticker").innerHTML = coin.data.symbol;
    document.getElementById("current-price").innerHTML = "USD $" + coin.data.priceUsd;
    document.getElementById("coin-id-trail").innerHTML = coin.data.name;
    document.getElementById("ticker-trail").innerHTML = coin.data.symbol;
    document.getElementById("current-price-trail").innerHTML = "USD $" + coin.data.priceUsd;
    loadChart(coin.data.id, 'm30');
  }
}

function loadChart(id, interval){
  let baseURL = "https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/";
  let url = "";
  let timeStart = "";
  let timeEnd = Date.now();
  let graphName = "";
  if(chartUsed){
    chart.destroy();
  }
  chartUsed = true;
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
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    let xValues = [];
    let yValues = [];
    for(let i = 0; i < result.data.length; i++){
      xValues[i] = i;
      yValues[i] = result.data[i].priceUsd;
    }
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

function trailCoin(type){
  let coinValue = savedCoin.data.priceUsd;
  let amount = 0;
  let value = 0;
  let id = savedCoin.data.id;
  if(type == "#"){
    amount = document.getElementById("amount").value;
    value = amount * coinValue;
  } else{
    value = document.getElementById("amount").value;
    amount = value / coinValue;
  }
  if(users[userIndex].coins == "none"){
    users[userIndex].coins = [];
  }
  users[userIndex].coins[users[userIndex].coins.length] = {
    name: id,
    amount: amount,
    value: value
  }

  firebase.database().ref('userList').set(users);

  updateCoins();

  hide("trail-box");
  hide("lightbox2");
}

function updateCoins(){
  assetAllocation = [];
  if(!corsEnabled){
    return;
  }
  if(users[userIndex].coins == "none"){
    show("no-coins");
    show("no-assets")
  } else{
    hide("no-coins");
    for(let i = 0; i < users[userIndex].coins.length; i++){
      let url = "https://cors-anywhere.herokuapp.com/api.coincap.io/v2/assets/" + users[userIndex].coins[i].name;
      fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        let name = result.data.name;
        let buyValue = users[userIndex].coins[i].value;
        let currentValue = result.data.priceUsd * users[userIndex].coins[i].amount;
        let ticker = result.data.symbol;
        ta += result.data.priceUsd * users[userIndex].coins[i].amount;
        assetAllocation[assetAllocation.length] = {
          ticker: ticker,
          amount: currentValue
        };
        document.getElementById("coins-box").innerHTML += "<div class='display-coin'><div class='name title'>"+ name +"</div><div class='display-ticker title'>"+ ticker +"</div><div class='buy-value'>Buy Value : USD$"+ buyValue +"</div><div class='current-value'>Current Value : USD$"+ currentValue +"</div></div>";
        document.getElementById("ta").innerHTML = Math.round(ta) + ".00";
        if(i == users[userIndex].coins.length - 1){
          setTimeout(updateAssetAllocation(),4000);
        }
      });
    }
    hide("no-assets");
  }
}

function updateAssetAllocation(){
  console.log(assetAllocation.length);
  document.getElementById("allocation-box").innerHTML = "";
  for(let i = 0; i < assetAllocation.length; i++){
    let percent = assetAllocation[i].amount / ta * 100;
    let id = "allocation" + i;
    document.getElementById("allocation-box").innerHTML += "<div class='allocation'><div class='allocation-type'>" + assetAllocation[i].ticker + " " + Math.ceil(percent) + "%</div><div class='percent-bar'><div class='percent' id='" + id + "'></div></div></div>";
    document.getElementById(id).style.width = percent + "%";
  }
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
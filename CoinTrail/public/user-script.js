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
let user = null;
let displayname = null;
const userList = firebase.database().ref('userList');
let users = null;
let uid = null;

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
        }
      }
      // if doesn't exist create blank profile and add them to database
      if(!userFound){
        users[users.length] = {
          uid: uid,
          username: displayname,
          coins: "none"
        }
        userList.set(users);
      }

    }
  });
} // loadUser
/*function testFetch(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    Authorization: 'Bearer 29d41298-b14f-4f99-be93-7c164af613a7'
  };
  
  fetch("https://api.coincap.io/v2/assets/bitcoin", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    fetch("https://api.coincap.io/v2/assets/bitcoin/history?interval=d1", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}*/
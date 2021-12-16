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

var database = firebase.database();

//global variables
let errorMessage = "";

function getStarted(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirm-password").value;
  if(password != confirm){
    errorMessage = "Please make sure that the passwords match.";
    console.log(errorMessage);
    return;
  } else {
    firebase.auth().createUserWithEmailAndPassword(username, password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      console.log(user)
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
    });
  }
}

function signIn(){
  let username = document.getElementById("username-sign").value;
  let password = document.getElementById("password-sign").value;
  firebase.auth().signInWithEmailAndPassword(username, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });

}

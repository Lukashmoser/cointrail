// service worker init
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

//global variables
let errorMessage = ""; // stores error message
let user = null; // stores users details to sent to user-script.js

// allos new user to create an account
function getStarted(){
  let displayname = document.getElementById("displayname").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirm-password").value;
  if(username == "" || password == "" || displayname == ""){
    errorMessage = "Please enter a display name, your email, and a password.";
    document.getElementById("message").innerHTML = errorMessage;
    show("lightboxlightbox");
    return;
  }
  else if(password != confirm){
    errorMessage = "Please make sure that the passwords match.";
    document.getElementById("confirm-password").value = "";
    document.getElementById("message").innerHTML = errorMessage;
    show("lightboxlightbox");
    return;
  } else {
    firebase.auth().createUserWithEmailAndPassword(username, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user.uid;
      sessionStorage.setItem("user", user);
      sessionStorage.setItem("name", displayname);
      window.location.href = "user.html";
    })
    .catch((error) => {
      console.log(error);
      //errorMessage = error.error.message;
      let errorCode = error.code
      switch(errorCode){
        case "auth/weak-password":
          errorMessage = "Your password needs to be at least 6 characters long";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use by another account. Please use a different email or go back and select the sign in option";
          break;
        case undefined:
          errorMessage = "This page requires an internet connection. Please obtain one and try again.";
          break;
        case "auth/network-request-failed":
          errorMessage = "This page requires an internet connection. Please obtain one and try again.";
          break;
      }
      document.getElementById("password").value = "";
      document.getElementById("confirm-password").value = "";
      document.getElementById("message").innerHTML = errorMessage;
      show("lightboxlightbox");
      return;
    });
  }
} // getStarted


// allows user to sign in
function signIn(){
  let username = document.getElementById("username-sign").value;
  let password = document.getElementById("password-sign").value;
  if(username == "" || password == ""){
    errorMessage = "Please enter your email and password.";
    document.getElementById("message").innerHTML = errorMessage;
    show("lightboxlightbox");
    return;
  } else {
    firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user.uid;
      sessionStorage.setItem("user", user);
      window.location.href = "user.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      switch(errorCode) {
        case "auth/invalid-email":
          errorMessage = "That is not a valid email. Please make sure that you type in yor full email address.";
        case "auth/wrong-password":
          errorMessage = "Your password is incorret. Please try again.";
        case "auth/user-not-found":
          errorMessage = "An account has not been created with this email. Please go back and select the get started option.";
        case undefined:
          errorMessage = "This page requires an internet connection. Please obtain one and try again."
      }
      document.getElementById("username-sign").value = "";
      document.getElementById("password-sign").value = "";
      document.getElementById("message").innerHTML = errorMessage;
      show("lightboxlightbox");
      return;
    });
  }
} // signIn

function hide(elem){
  document.getElementById(elem).style.display = "none";
} // hide

function show(elem){
  document.getElementById(elem).style.display = "block";
} // show

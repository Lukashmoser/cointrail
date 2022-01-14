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
let errorMessage = "";
let user = null;

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
      var errorCode = error.code;
      errorMessage = error.message;
      document.getElementById("displayname").value = "";
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      document.getElementById("confirm-password").value = "";
      document.getElementById("message").innerHTML = errorMessage;
      show("lightboxlightbox");
      return;
    });
  }
} // getStarted

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
      console.log(user);
      sessionStorage.setItem("user", user);
      window.location.href = "user.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      errorMessage = error.message;
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

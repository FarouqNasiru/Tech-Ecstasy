import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEvuijHkqXXFuV4LrpqYdcXfukPbQ6-dc",
    authDomain: "tech-7134d.firebaseapp.com",
    projectId: "tech-7134d",
    storageBucket: "tech-7134d.firebasestorage.app",
    messagingSenderId: "810449551932",
    appId: "1:810449551932:web:75817e11e151777e76f939",
    measurementId: "G-N5TFC3TVG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence enabled");
  })
  .catch((error) => {
    console.error("Error enabling persistence:", error);
  });

// Owner's email address
const OWNER_EMAIL = "farouqnasiru@gmail.com"; // Replace with the owner's email

// Handle Email/Password Login/Sign-Up
document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Try to log in
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in successfully!");

    // Redirect based on user role
    const user = auth.currentUser;
    if (user.email === OWNER_EMAIL) {
      window.location.href = "owner-dashboard.html"; // Redirect to owner's dashboard
    } else {
      window.location.href = "index.html"; // Redirect to the store page
    }
  } catch (error) {
    // If login fails, try to sign up
    if (error.code === "auth/user-not-found") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signed up successfully!");

        // Redirect based on user role
        const user = auth.currentUser;
        if (user.email === OWNER_EMAIL) {
          window.location.href = "owner-dashboard.html"; // Redirect to owner's dashboard
        } else {
          window.location.href = "index.html"; // Redirect to the store page
        }
      } catch (signUpError) {
        showError(signUpError.message);
      }
    } else {
      showError(error.message);
    }
  }
});

// Handle Google Sign-In
document.getElementById("google-sign-in").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Logged in with Google successfully!");

    // Redirect based on user role
    const user = auth.currentUser;
    if (user.email === OWNER_EMAIL) {
      window.location.href = "owner-dashboard.html"; // Redirect to owner's dashboard
    } else {
      window.location.href = "index.html"; // Redirect to the store page
    }
  } catch (error) {
    showError(error.message);
  }
});

// Show error message
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}
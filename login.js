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
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcwOu27SDWqxPpM9z3WNdVTLKt6OyIPVQ",
  authDomain: "tecstasy-b983f.firebaseapp.com",
  projectId: "tecstasy-b983f",
  storageBucket: "tecstasy-b983f.firebasestorage.app",
  messagingSenderId: "476018649191",
  appId: "1:476018649191:web:658266178580b03f6accc2",
  measurementId: "G-EL41HV8PSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence enabled");
  })
  .catch((error) => {
    console.error("Error enabling persistence:", error);
  });

// Owner's email address
const OWNER_EMAIL = "farouqnasiru@gmail.com";

// Function to create user document in Firestore
async function createUserDocument(user) {
  const userRef = doc(db, "users", user.uid);
  try {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      purchaseHistory: [],
      isOwner: user.email === OWNER_EMAIL
    }, { merge: true });
  } catch (error) {
    console.error("Error creating user document:", error);
  }
}

// Common function to handle successful authentication
async function handleSuccessfulAuth(user) {
  await createUserDocument(user);
  
  if (user.email === OWNER_EMAIL) {
    window.location.href = "owner-dashboard.html";
  } else {
    window.location.href = "shop.html";
  }
}

// Handle Email/Password Login/Sign-Up
document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Try to log in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await handleSuccessfulAuth(userCredential.user);
  } catch (error) {
    // If login fails, try to sign up
    if (error.code === "auth/user-not-found") {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleSuccessfulAuth(userCredential.user);
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
    const userCredential = await signInWithPopup(auth, provider);
    await handleSuccessfulAuth(userCredential.user);
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

// Check auth state on page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, create/update their document
    createUserDocument(user);
    
    // You can add additional logic here if needed
    // For example, update lastLogin timestamp
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });
  }
});
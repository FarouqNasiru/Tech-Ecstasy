import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Owner's email address
const OWNER_EMAIL = "farouqnasiru@gmail.com"; // Replace with the owner's email

// Check if user is authenticated and is the owner
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== OWNER_EMAIL) {
    window.location.href = "login.html"; // Redirect to login page if not the owner
  }
});

// Add product to Firestore
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const mainImage = document.getElementById("main-image").value;
  const description = document.getElementById("product-description").value;

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      mainImage,
      description,
    });
    alert("Product added successfully!");
    document.getElementById("product-form").reset();
  } catch (error) {
    console.error("Error adding product:", error);
  }
});




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// Owner's email address
const OWNER_EMAIL = "farouqnasiru@gmail.com"; // Replace with the owner's email

// Check if user is authenticated and is the owner
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== OWNER_EMAIL) {
    window.location.href = "login.html"; // Redirect to login page if not the owner
  }
});

// Function to compress and convert image to base64
async function compressAndConvertImage(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Adjust quality (0.6 = 60% quality)
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

// Add product to Firestore
document.getElementById("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const mainImageFile = document.getElementById("main-image").files[0];
  const description = document.getElementById("product-description").value;
  const quantity = parseInt(document.getElementById("product-quantity").value);
  const category = document.getElementById("product-category").value; // Get selected category
  const additionalImagesFiles = document.getElementById("additional-images").files;

  if (!mainImageFile || !additionalImagesFiles || additionalImagesFiles.length === 0) {
    alert("Please upload the main image and at least one additional image.");
    return;
  }

  try {
    // Convert main image to base64
    const mainImageBase64 = await compressAndConvertImage(mainImageFile);

    // Compress and convert additional images to base64
    const additionalImages = [];
    for (let i = 0; i < additionalImagesFiles.length; i++) {
      const base64 = await compressAndConvertImage(additionalImagesFiles[i]);
      additionalImages.push(base64);
    }

    // Add product to Firestore
    await addDoc(collection(db, "products"), {
      name,
      price,
      mainImage: mainImageBase64, // Store main image as base64 string
      additionalImages, // Store additional images as base64 strings
      description,
      quantity, // Store available quantity
      category, // Store selected category
    });

    alert("Product added successfully!");
    document.getElementById("product-form").reset();
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Failed to add product. Please try again.");
  }
});


// Logout button
document.getElementById("logout-button").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
});
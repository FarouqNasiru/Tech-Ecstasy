import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirect to login page if user is not authenticated
    window.location.href = "login.html";
  } else {
    // User is authenticated, display profile picture
    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = user.photoURL || "https://via.placeholder.com/40";
    profilePicture.classList.remove("hidden");

    // Fetch and display products
    fetchProducts();
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

// Fetch products from Firestore
async function fetchProducts() {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = ""; // Clear existing content

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productCard = `
        <div class="product-card">
          <img src="${product.mainImage}" alt="${product.name}" data-product-id="${doc.id}">
          <h3>${product.name}</h3>
          <div class="price-wishlist">
            <p>$${product.price}</p>
            <i class="fas fa-heart wishlist-icon" data-product-id="${doc.id}"></i>
          </div>
        </div>
      `;
      productsGrid.innerHTML += productCard;
    });

     // Add event listeners to wishlist icons
  const wishlistIcons = document.querySelectorAll(".wishlist-icon");
  wishlistIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const productId = icon.getAttribute("data-product-id");
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to add products to your wish-list.");
        return;
      }

    // Fetch product details
    getDoc(doc(db, "products", productId))
      .then((doc) => {
        if (doc.exists()) {
          const product = doc.data();
          const wishListItem = {
            productId,
            name: product.name,
            price: product.price,
            image: product.mainImage,
          };

          // Save wish-list item to localStorage
          const wishList = JSON.parse(localStorage.getItem(`wishList_${user.uid}`)) || [];
          wishList.push(wishListItem);
          localStorage.setItem(`wishList_${user.uid}`, JSON.stringify(wishList));

          alert("Product added to wish-list!");
        } else {
          console.error("Product not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  });
});










    // Add event listeners to product images
    const productImages = document.querySelectorAll(".product-card img");
    productImages.forEach((image) => {
      image.addEventListener("click", () => {
        const productId = image.getAttribute("data-product-id");
        window.location.href = `product.html?id=${productId}`;
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
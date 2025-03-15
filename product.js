import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// Fetch product details
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function fetchProductDetails() {
  const productDoc = await getDoc(doc(db, "products", productId));
  if (productDoc.exists()) {
    const product = productDoc.data();
    const additionalImages = product.additionalImages || []; // Handle missing additionalImages

    const productDetails = `
      <div class="product-details-container">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            ${additionalImages.map((image) => `
              <div class="swiper-slide">
                <img src="${image}" alt="${product.name}">
              </div>
            `).join("")}
          </div>
          <!-- Add Pagination -->
          <div class="swiper-pagination"></div>
          <!-- Add Navigation -->
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </div>
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p class="description">${product.description}</p>
        <div class="quantity-controls">
          <button id="decrease-quantity">-</button>
          <span id="quantity">1</span>
          <button id="increase-quantity">+</button>
        </div>
        <button id="add-to-cart">Add to Cart</button>
      </div>
    `;
    document.getElementById("product-details").innerHTML = productDetails;

    // Initialize Swiper
    new Swiper(".swiper-container", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // Quantity controls
    const quantityElement = document.getElementById("quantity");
    const decreaseButton = document.getElementById("decrease-quantity");
    const increaseButton = document.getElementById("increase-quantity");

    let quantity = 1;

    decreaseButton.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
      }
    });

    increaseButton.addEventListener("click", () => {
      quantity++;
      quantityElement.textContent = quantity;
    });

    // Add to Cart button
    document.getElementById("add-to-cart").addEventListener("click", () => {
      addToCart(productId, product.name, product.price, quantity);
    });
  } else {
    document.getElementById("product-details").innerHTML = "<p>Product not found.</p>";
  }
}

// Add product to cart
function addToCart(productId, name, price, quantity) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to add products to your cart.");
    return;
  }

  const cartItem = {
    productId,
    name,
    price,
    quantity,
  };

  // Save cart item to Firestore (or localStorage for simplicity)
  const cart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
  cart.push(cartItem);
  localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));

  alert("Product added to cart!");
}

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    fetchProductDetails();
  }
});
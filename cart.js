import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

// Fetch cart items
function fetchCartItems() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  let totalPrice = 0;
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItem = `
      <div class="cart-item">
        <h3>${item.name}</h3>
        <p>Price: $${item.price}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartItemsContainer.innerHTML += cartItem;
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Update quantity
window.updateQuantity = (index, change) => {
  const user = auth.currentUser;
  if (!user) return;

  const cart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
  cart[index].quantity += change;

  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }

  localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
  fetchCartItems();
};

// Remove item
window.removeItem = (index) => {
  const user = auth.currentUser;
  if (!user) return;

  const cart = JSON.parse(localStorage.getItem(`cart_${user.uid}`)) || [];
  cart.splice(index, 1);

  localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
  fetchCartItems();
};

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    fetchCartItems();
  }
});
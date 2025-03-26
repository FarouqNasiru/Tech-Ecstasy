import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  serverTimestamp,
  increment,
  writeBatch
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

let currentUser = null; // Store the current user globally

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUser = user; // Store the user object
    displayCartItems(user.uid);
  }
});

// Function to calculate cart total
function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ... (keep all your existing Firebase initialization code)

// Modified displayCartItems function for Base64 images
function displayCartItems(userId) {
  const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  const cartContainer = document.getElementById("cart-items");

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("checkout-button").style.display = "none";
    return;
  }

  let total = calculateTotal(cart);
  const cartHTML = cart.map((item, index) => {
    // Handle Base64 images
    const imageSrc = getImageSource(item);
    const productName = item.name || 'Unnamed Product';
    const productPrice = item.price || 0;
    const productQuantity = item.quantity || 1;
    
    return `
      <div class="cart-item">
        ${imageSrc ? `<img src="${imageSrc}" alt="${productName}" class="cart-item-image">` : ''}
        <div class="cart-item-details">
          <h3>${productName}</h3>
          <p>Price: $${productPrice}</p>
          <p>Total: $${(productPrice * productQuantity).toFixed(2)}</p>
          <button class="remove-button" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  cartContainer.innerHTML = `
    ${cartHTML}
    <div class="cart-total">
      <h3>Total: $${total.toFixed(2)}</h3>
      <button id="checkout-button">Proceed to Checkout</button>
    </div>
  `;

  // Add event listeners (keep your existing code)
  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      removeItemFromCart(userId, index);
    });
  });

  document.querySelectorAll(".quantity-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = button.getAttribute("data-index");
      const action = button.getAttribute("data-action");
      updateCartItemQuantity(userId, index, action);
    });
  });

  document.getElementById("checkout-button").addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please log in to complete your purchase.");
      window.location.href = "login.html";
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    await completePurchase(currentUser, cart);
  });
}

// Helper function to get image source from Base64 data
function getImageSource(item) {
  // Check all possible image properties that might contain Base64
  const possibleImageProps = ['mainImage', 'image', 'img', 'photo', 'thumbnail'];
  
  for (const prop of possibleImageProps) {
    if (item[prop]) {
      // Check if it's a Base64 string
      if (typeof item[prop] === 'string' && item[prop].startsWith('data:image')) {
        return item[prop]; // Return the Base64 string directly
      }
      // If it's a URL, return it
      if (isValidUrl(item[prop])) {
        return item[prop];
      }
    }
  }
  
  // Return null if no valid image found
  return null;
}

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// ... (keep all your remaining functions as they are)


// Rest of your functions (removeItemFromCart, updateProductQuantity, etc.) remain the same
// Function to remove an item from the cart
function removeItemFromCart(userId, index) {
  const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  cart.splice(index, 1); // Remove the item at the specified index
  localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
  displayCartItems(userId); // Refresh the cart display
}

// Function to update product quantity after a sale
async function updateProductQuantity(productId, quantitySold) {
  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);

  if (productDoc.exists()) {
    const product = productDoc.data();
    const newQuantity = product.quantity - quantitySold;

    if (newQuantity <= 0) {
      // Remove product from Firestore if sold out
      await deleteDoc(productRef);
    } else {
      // Update product quantity
      await updateDoc(productRef, { quantity: newQuantity });
    }
  } else {
    console.error("Product not found.");
  }
}



















async function completePurchase(user, cartItems) {
  try {
    // 1. First validate cart
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Your cart is empty");
    }

    // 2. Prepare order items with all required fields
    const orderItems = cartItems.map(item => ({
      productId: item.productId || '',
      name: item.name || 'Unknown Product',
      price: item.price || 0,
      quantity: item.quantity || 1,
      image: item.mainImage || '',
      // Add any other required product fields
    }));

    // 3. Calculate total
    const orderTotal = orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // 4. Create order document with all required fields
    const orderData = {
      userId: user.uid,
      userEmail: user.email || '',
      items: orderItems,
      total: orderTotal,
      status: "processing",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add any other required order fields
      shippingAddress: '', // You'll want to collect this
      paymentMethod: '',   // And this
      paymentStatus: 'pending'
    };

    // 5. Create the order
    const orderRef = await addDoc(collection(db, "orders"), orderData);

    // 6. Update user's purchase history (with simplified order data)
    const userRef = doc(db, "users", user.uid);
    const timestamp = new Date().toISOString();
    
    // First check if user document exists
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        purchaseHistory: [{
          orderId: orderRef.id,
          date: timestamp,
          total: orderTotal,
          status: "processing",
          itemCount: orderItems.length,
          items: orderItems // Include full items array
        }],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing user document
      await updateDoc(userRef, {
        purchaseHistory: arrayUnion({
          orderId: orderRef.id,
          date: timestamp,
          total: orderTotal,
          status: "processing",
          itemCount: orderItems.length,
          items: orderItems // Include full items array
        }),
        updatedAt: serverTimestamp()
      });
    }

    // 7. Update product quantities using batched writes
    const batch = writeBatch(db);
    for (const item of orderItems) {
      const productRef = doc(db, "products", item.productId);
      batch.update(productRef, {
        quantity: increment(-item.quantity),
        updatedAt: serverTimestamp()
      });
    }
    await batch.commit();

    // 8. Clear cart and redirect
    localStorage.removeItem(`cart_${user.uid}`);
    window.location.href = `/payments.html?id=${orderRef.id}`;

  } catch (error) {
    console.error("Checkout failed:", error);
    alert(`Checkout failed: ${error.message}`);
  }
}

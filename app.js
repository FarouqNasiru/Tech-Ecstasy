let cartCount = 0;

function addToCart() {
    cartCount++;
    document.getElementById("cart-count").textContent = cartCount;
    alert("Added to cart!");
}

const products = {
    laptop: [
        { name: "MacBook Air", brand: "Apple", price: 1200000 },
        { name: "Dell XPS 15", brand: "Dell", price: 1100000 },
        { name: "HP Spectre", brand: "HP", price: 950000 },
        { name: "Asus ROG", brand: "Asus", price: 1400000 },
    ],
    phone: [
        { name: "iPhone 15", brand: "Apple", price: 900000 },
        { name: "Galaxy S23", brand: "Samsung", price: 850000 },
        { name: "Pixel 7", brand: "Google", price: 750000 },
        { name: "OnePlus 11", brand: "OnePlus", price: 720000 },
    ],
    accessories: [
        { name: "Wireless Mouse", brand: "Logitech", price: 15000 },
        { name: "Power Bank", brand: "Anker", price: 30000 },
        { name: "Gaming Mouse", brand: "Razer", price: 40000 },
        { name: "Headphones", brand: "Sony", price: 50000 },
    ]
};

function displayProducts(section, productList) {
    const sectionEl = document.getElementById(`${section}-list`);
    sectionEl.innerHTML = "";
    productList.forEach(product => {
        sectionEl.innerHTML += `
            <div class="product-card">
                <img src="images/Apple-iPhone-12-PNG-Picture.png" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₦${product.price.toLocaleString()}</p>
                <button onclick="addToCart()" class="hello-there">Add to Cart</button>
            </div>
        `;
    });
}

function filterSection() {
    const section = document.getElementById("section-select").value;
    document.querySelectorAll(".section").forEach(sec => {
        sec.style.display = section === "all" || sec.id === section ? "block" : "none";
    });
}

function filterProducts(section, brand) {
    const filtered = brand === "all" ? products[section] : products[section].filter(p => p.brand === brand);
    displayProducts(section, filtered);
}

window.onload = () => {
    Object.keys(products).forEach(section => displayProducts(section, products[section]));
};



document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input");
    searchInput.addEventListener("input", (event) => {
        console.log("Searching for:", event.target.value);
    });

    const categories = document.querySelectorAll(".category");
    categories.forEach(category => {
        category.addEventListener("click", () => {
            console.log("Category selected:", category.textContent);
        });
    });

    const products = document.querySelectorAll(".product");
    products.forEach(product => {
        product.addEventListener("click", () => {
            console.log("Product clicked:", product.textContent.trim());
        });
    });

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log("Navigation clicked:", item.textContent);
        });
    });
});


function toggleFilterMenu() {
    const filterMenu = document.getElementById("filterMenu");
    filterMenu.classList.toggle("show");
}

function applyFilters() {
    alert("Filters applied!");
}



function toggleFilterMenu() {
    const filterMenu = document.getElementById("filterMenu");
    filterMenu.classList.toggle("show");
}


let currentIndex = 0;
const images = document.querySelectorAll(".slider-images img");

function showSlide(index) {
    images.forEach(img => img.classList.remove("active"));
    images[index].classList.add("active");
}

function prevSlide() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    showSlide(currentIndex);
}

function nextSlide() {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
}

// Auto-slide every 3 seconds
setInterval(nextSlide, 3000);


let quantity = 1;

function increaseQuantity() {
    quantity++;
    document.getElementById("quantity").innerText = quantity;
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById("quantity").innerText = quantity;
    }
}


function switchTab(tabName) {
    let tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => tab.classList.remove("active"));

    let selectedTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    selectedTab.classList.add("active");

    let paymentContent = document.querySelector(".payment-content");
    if (tabName === "in-progress") {
        paymentContent.innerHTML = `<p class="empty-message">You have no ongoing Installments</p>`;
    } else if (tabName === "completed") {
        paymentContent.innerHTML = `<p class="empty-message">No completed payments yet</p>`;
    } else {
        paymentContent.innerHTML = `<p class="empty-message">No cancelled payments</p>`;
    }
}


function shareWishlist() {
    alert("Wishlist link copied to clipboard!");
}


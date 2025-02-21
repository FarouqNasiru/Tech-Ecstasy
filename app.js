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

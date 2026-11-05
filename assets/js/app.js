let productCards = {};
function openMenuOnPress(){
    window.location.href="../Menu.html";
}

let cart = {
    Burgers: {},
    Drinks: {},
    Sides: {},
    ComboPacks: {},
    Desserts: {}
};

// Product categories and their card classes
const categories = {
    Burgers: '.Burger',
    Drinks: '.Drinks',
    Sides: '.Sides',
    ComboPacks: '.Combo',
    Desserts: '.Desserts'
};

Object.entries(categories).forEach(([category, selector]) => {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
        const addBtn = card.querySelector('#addToCartBtn');
        const controls = card.querySelector('#quantityControls');
        const display = card.querySelector('#qtyDisplay');
        const increaseBtn = card.querySelector('#increaseBtn');
        const decreaseBtn = card.querySelector('#decreaseBtn');
        const name = card.querySelector('.p-name').textContent.trim();
        let rawPrice = card.querySelector('.p-price').textContent.trim();
        let price = Number(rawPrice.replace(/[^\d]/g, ''));
        const img = card.querySelector('img').getAttribute('src');        
        price = price / 100;
        const id = `${category}${index + 1}`;
        productCards[id] = card;
        function updateUI() {
            const product = cart[category][id];
            const qty = product ? product.qty : 0;
            display.textContent = qty;
            if (qty > 0) {
                addBtn.classList.add('hidden');
                controls.classList.remove('hidden');
            } else {
                controls.classList.add('hidden');
                addBtn.classList.remove('hidden');
            }
        }
        addBtn.addEventListener('click', () => {
            cart[category][id] = {
                name: name,
                price: price,
                qty: 1,
                total: price,
                img: img
            };
            updateUI();
            updateCart();
            displayCart();
        });
        increaseBtn.addEventListener('click', () => {
            const product = cart[category][id];
            product.qty++;        
            product.total = product.price * product.qty;
            updateUI();
            updateCart();
            displayCart();
        });
        decreaseBtn.addEventListener('click', () => {
            const product = cart[category][id];
            if (!product) return;
            product.qty--;
            if (product.qty === 0) {
                delete cart[category][id];
            } else {
                product.total = product.price * product.qty;
            }
            updateUI();
            updateCart();
            displayCart();
        });
        updateUI();
    });
});

function calculateGrandTotal() {
    let grandTotal = 0;
    Object.values(cart).forEach(category => {
        Object.values(category).forEach(product => {
            let price = Number(product.price);
            let qty = Number(product.qty);
            let img=product.img;
            grandTotal += price * qty;
        });
    });
    return grandTotal;
}
function updateCart() {
    const grandTotal = calculateGrandTotal();
    console.log("Current Cart:", cart);
    console.log("Grand Total: Rs.", grandTotal);
}
function displayCart() {
    const cartItems = document.getElementById("c-cart");
    cartItems.innerHTML = "";
    Object.entries(cart).forEach(([category, products]) => {
        Object.entries(products).forEach(([id, product]) => {
            const item = document.createElement("div");
            
            item.innerHTML = `
                <div class="container-cart">
                    <div class="product-img" id="p-i-container">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-content" id="p-p-c-container">
                        <p>${product.name}</p>
                        <p>Qty: ${product.qty}</p>
                    </div>
                    <div class="product-price_btn" id="p-p-b-container">
                        <h4>Rs.${Number(product.total).toFixed(2)}</h4>
                        <input type="button" value="Remove" onclick="removeItem('${category}', '${id}')">
                    </div>
                </div>
                <hr>
            `;
            cartItems.appendChild(item);
        });

    });
}
function removeItem(category, id) {
    delete cart[category][id];
    const card = productCards[id];
    const addBtn = card.querySelector('#addToCartBtn');
    const controls = card.querySelector('#quantityControls');
    const display = card.querySelector('#qtyDisplay');
    display.textContent = 0;
    controls.classList.add('hidden');
    addBtn.classList.remove('hidden');
    displayCart();
    updateCart();
}
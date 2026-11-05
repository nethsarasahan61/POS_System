console.log("hello js");
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
        const img = "../"+card.querySelector('img').getAttribute('src');
        price = price / 100;
        const id = `${category}${index + 1}`;

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
        });
        increaseBtn.addEventListener('click', () => {
            const product = cart[category][id];
            product.qty++;
            console.log(product.price);
            
            product.total = product.price * product.qty;
            updateUI();
            updateCart();
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

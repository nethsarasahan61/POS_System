console.log("hello js");
function openMenuOnPress(){
    window.location.href="../Menu.html";
}
const addToCartBtn = document.getElementById('addToCartBtn');
const quantityControls = document.getElementById('quantityControls');
const qtyDisplay = document.getElementById('qtyDisplay');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');

let quantity = 0;

function updateUI() {
    if (quantity > 0) {
        addToCartBtn.classList.add('hidden');
        quantityControls.classList.remove('hidden');
        qtyDisplay.textContent = quantity;
    } else {
        quantityControls.classList.add('hidden');
        addToCartBtn.classList.remove('hidden');
    }
}
addToCartBtn.addEventListener('click', () => {
    quantity = 1;
    updateUI();
});
increaseBtn.addEventListener('click', () => {
    quantity++;
    updateUI();
});
decreaseBtn.addEventListener('click', () => {
    if (quantity > 0) {
        quantity--;
        updateUI();
    }
});
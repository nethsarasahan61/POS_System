console.log("hello js");
function openMenuOnPress(){
    window.location.href="../Menu.html";
}
let cart = {};
const Burger_card = document.querySelectorAll('.Burger');
Burger_card.forEach((card, index) => {
    const addBtn = card.querySelector('#addToCartBtn');
    const controls = card.querySelector('#quantityControls');
    const display = card.querySelector('#qtyDisplay');

    const increaseBtn = card.querySelector('#increaseBtn');
    const decreaseBtn = card.querySelector('#decreaseBtn');

    const id = `burger${index + 1}`;
    cart[id] = 0;
    function updateUI() {
        display.textContent = cart[id];
        if (cart[id] > 0) {
            addBtn.classList.add('hidden');
            controls.classList.remove('hidden');
        } else {
            controls.classList.add('hidden');
            addBtn.classList.remove('hidden');
        }
    }
    addBtn.addEventListener('click', () => {
        cart[id] = 1;
        updateUI();

    });
    increaseBtn.addEventListener('click', () => {
        cart[id]++;
        updateUI();
    });
    decreaseBtn.addEventListener('click', () => {
        if (cart[id] > 0) {
            cart[id]--;
            updateUI();
        }
    });
    updateUI();
});

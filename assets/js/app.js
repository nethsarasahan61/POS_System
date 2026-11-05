let History = JSON.parse(localStorage.getItem("History"))||[];
let productCards={};
function openMenuOnPress(){
    window.location.href="../Menu.html";
}
let cart={
    Burgers: {},
    Drinks: {},
    Sides: {},
    ComboPacks: {},
    Desserts: {}
};
const categories = {
    Burgers: '.Burger',
    Drinks: '.Drinks',
    Sides: '.Sides',
    ComboPacks: '.Combo',
    Desserts: '.Desserts'
};
Object.entries(categories).forEach(([category, selector])=>{
    const cards=document.querySelectorAll(selector);
    cards.forEach((card, index)=>{
        const addBtn=card.querySelector('#addToCartBtn');
        const controls=card.querySelector('#quantityControls');
        const display=card.querySelector('#qtyDisplay');
        const increaseBtn=card.querySelector('#increaseBtn');
        const decreaseBtn=card.querySelector('#decreaseBtn');
        const name=card.querySelector('.p-name').textContent.trim();
        let rawPrice=card.querySelector('.p-price').textContent.trim();
        let price=Number(rawPrice.replace(/[^\d]/g, ''));
        const img=card.querySelector('img').getAttribute('src');        
        price=price/100;
        const id=`${category}${index+1}`;
        productCards[id]=card;
        function updateUI(){
            const product=cart[category][id];
            const qty=product?product.qty:0;
            display.textContent = qty;
            if(qty>0){
                addBtn.classList.add('hidden');
                controls.classList.remove('hidden');
            }else{
                controls.classList.add('hidden');
                addBtn.classList.remove('hidden');
            }
        }
        addBtn.addEventListener('click',()=>{
            cart[category][id]={
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
        increaseBtn.addEventListener('click',() =>{
            const product=cart[category][id];
            product.qty++;        
            product.total=product.price*product.qty;
            updateUI();
            updateCart();
            displayCart();
        });
        decreaseBtn.addEventListener('click', () => {
            const product=cart[category][id];
            if(!product)return;
            product.qty--;
            if(product.qty === 0){
                delete cart[category][id];
            }else{
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
    let grandTotal=0;
    Object.values(cart).forEach(category => {
        Object.values(category).forEach(product => {
            let price=Number(product.price);
            let qty=Number(product.qty);
            let img=product.img;
            grandTotal+=price*qty;
        });
    });
    return grandTotal;
}
function updateCart() {
    const grandTotal=calculateGrandTotal();
}
function displayCart() {
    const cartItems=document.getElementById("c-cart");
    cartItems.innerHTML="";
    const cartTotal=document.getElementById("c-f-section-1");
    cartTotal.innerHTML="";
    let total=calculateGrandTotal();
    let gT=total*1.1;
    cartTotal.innerHTML = `
        <div class="c-f-s-text">
            <p>Sub Total</p>
            <p>Tax</p>
            <p>Grand Total</p>                                        
        </div>
        <div class="c-f-s-value">
            <p id="toal">Rs.${Number(total).toFixed(2)}</p>
            <p>10%</p>
            <p>Rs.${Number(gT).toFixed(2)}</p>
        </div>
    `;        
    Object.entries(cart).forEach(([category, products])=>{
        Object.entries(products).forEach(([id, product])=>{
            const item=document.createElement("div");
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
    const card=productCards[id];
    const addBtn=card.querySelector('#addToCartBtn');
    const controls=card.querySelector('#quantityControls');
    const display=card.querySelector('#qtyDisplay');
    display.textContent=0;
    controls.classList.add('hidden');
    addBtn.classList.remove('hidden');
    displayCart();
    updateCart();
}
function printBill(){
    let items=[];
    Object.entries(cart).forEach(([category, products])=>{
        Object.entries(products).forEach(([id, product])=>{
            items.push({
                id: id,
                category: category,
                name: product.name,
                price: Number(product.price),
                qty: Number(product.qty),
                total: Number(product.price) * Number(product.qty)
            });
        });
    });
    if(items.length===0){
        alert("Your cart is empty!");
        return;
    }
    const subtotal=items.reduce(
        (sum,product)=>sum+product.total,0
    );
    const nextBillNumber=Number(localStorage.getItem("nextBillNumber") || 1);
    const billNumber="ORN-"+String(nextBillNumber).padStart(4,"0");
    const order={
        id: billNumber,
        date: new Date().toISOString(),
        items: items,
        subtotal: subtotal,
        discount: 10,
        grandTotal: subtotal*1.1
    };    
    History.push(order);
    localStorage.setItem("History",JSON.stringify(History));
    localStorage.setItem("nextBillNumber",nextBillNumber+1);
    generateReceipt(order);
}
function generateReceipt(order) {
    const date = new Date(order.date);
    document.getElementById("billNumber").textContent=order.id;
    document.getElementById("billDate").textContent=date.toLocaleDateString();
    document.getElementById("billTime").textContent=date.toLocaleTimeString();
    const receiptItems=document.getElementById("receiptItems");
    receiptItems.innerHTML="";
    order.items.forEach(product=>{
        receiptItems.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${product.qty}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${formatPrice(product.total)}</td>
            </tr>
        `;
    });
    document.getElementById("receiptSubtotal").textContent=formatPrice(order.subtotal);
    document.getElementById("receiptTax").textContent="10%";
    document.getElementById("receiptGrandTotal").textContent=formatPrice(order.grandTotal);
    window.print();
}
function formatPrice(amount){
    return "Rs."+Number(amount).toFixed(2);
}

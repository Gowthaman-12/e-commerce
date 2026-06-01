const products = [
  {id:1,name:'Blue Shirt',price:29.99,img:'https://via.placeholder.com/300x200?text=Blue+Shirt'},
  {id:2,name:'Red Dress',price:49.99,img:'https://via.placeholder.com/300x200?text=Red+Dress'},
  {id:3,name:'Sneakers',price:69.99,img:'https://via.placeholder.com/300x200?text=Sneakers'},
  {id:4,name:'Watch',price:119.99,img:'https://via.placeholder.com/300x200?text=Watch'},
  {id:5,name:'Backpack',price:39.99,img:'https://via.placeholder.com/300x200?text=Backpack'},
  {id:6,name:'Sunglasses',price:19.99,img:'https://via.placeholder.com/300x200?text=Sunglasses'}
];

const $products = document.getElementById('products');
const $cartItems = document.getElementById('cart-items');
const $cartTotal = document.getElementById('cart-total');
const $clearCart = document.getElementById('clear-cart');

let cart = {};

function loadCart(){
  try{cart = JSON.parse(localStorage.getItem('cart')||'{}')}catch(e){cart={}}
}

function saveCart(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

function formatPrice(n){return '$'+n.toFixed(2)}

function renderProducts(){
  $products.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('article'); el.className='product';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3 class="title">${p.name}</h3>
      <div class="price">${formatPrice(p.price)}</div>
      <button data-id="${p.id}">Add to cart</button>
    `;
    const btn = el.querySelector('button');
    btn.addEventListener('click',()=> addToCart(p.id));
    $products.appendChild(el);
  })
}

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  saveCart();
  renderCart();
}

function removeFromCart(id){
  if(!cart[id]) return;
  cart[id]--;
  if(cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function clearCart(){cart={}; saveCart(); renderCart();}

function renderCart(){
  $cartItems.innerHTML = '';
  const ids = Object.keys(cart);
  let total = 0;
  if(ids.length===0){
    $cartItems.innerHTML = '<li class="empty">Cart is empty</li>';
    $cartTotal.textContent = 'Total: $0.00';
    return;
  }
  ids.forEach(id=>{
    const qty = cart[id];
    const p = products.find(x=>x.id==id);
    if(!p) return;
    total += p.price * qty;
    const li = document.createElement('li'); li.className='cart-item';
    li.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="meta">
        <div class="name">${p.name}</div>
        <div class="qty">${qty} × ${formatPrice(p.price)}</div>
      </div>
      <div class="actions">
        <button data-id="${p.id}" class="remove">−</button>
      </div>
    `;
    li.querySelector('.remove').addEventListener('click',()=> removeFromCart(p.id));
    $cartItems.appendChild(li);
  });
  $cartTotal.textContent = 'Total: ' + formatPrice(total);
}

$clearCart.addEventListener('click',()=>{
  clearCart();
});

// init
loadCart(); renderProducts(); renderCart();

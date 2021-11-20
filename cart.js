/**** cart  ****/
let cart = [];
let favorites = [];
let favStorage = localStorage.getItem("fav");

let storageForCart = localStorage.getItem("cart");
if (storageForCart === null && favStorage === null) {
  localStorage.setItem("fav", JSON.stringify(favorites));
  localStorage.setItem("cart", JSON.stringify(cart));
}
const subtotalCartPage = document.querySelector(".subtotal-cart-page");
const cartItems = document.querySelector(".cart-items");
const cartBtn = document.querySelector(".la-shopping-bag");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCart = document.querySelector(".close-icon");
const cartListContainer = document.querySelector(".cart-list-container");

const renderList = () => {
  cartOverlay.style.display = "none";
  Array.from(cartItems.children).forEach((child) => {
    child.remove();
  });
  Array.from(cartListContainer.children).forEach((child) => {
    child.remove();
  });
};

closeCart.addEventListener("click", () => {
  renderList();
  rerenderCartList();
});
let subTotal = 0;
const priceElement = document.querySelector(".total-price");
const updateSubtotal = () => {
  const storage = localStorage.getItem("cart");
  cart = JSON.parse(storage);
  let totalPrice = 0;
  let getTotal = cart.map((item) => {
    return item.totalPrice;
  });
  getTotal.forEach((price) => {
    totalPrice += parseInt(price);
  });
  subTotal = totalPrice;
  priceElement.textContent = `$${subTotal}.00`;
  subtotalCartPage.textContent = `$${subTotal}.00`;
};
const showCartModel = () => {
  let storageForCart = localStorage.getItem("cart");
  if (storageForCart === null) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  let html;
  const stored = localStorage.getItem("cart");
  cart = JSON.parse(stored);

  if (cart.length === 0) {
    html = `
    <div class="empty-cart">
            <i class="las la-shopping-bag empty-bag"></i>
            <span>Your cart is empty.</span>
          </div>
    `;
    cartItems.innerHTML += html;
  } else {
    cart.forEach((item) => {
      html = `
       <div class="single-cart-item" id=${item.id}>
                  <div class="cart-img-container">
                    <img
                      src=${item.img}
                      alt=""
                    />
                  </div>
                  <div class="cart-item-details">
                    <h5>${item.title}</h5>
                    <h5>$${item.price}.00</h5>
                    <div class="quantity-container">
                      <div class="quantity-flex">
                        <span class="material-icons-outlined quantity-icons">remove</span>
                        <input class="quantity" type="number" readonly value=${item.quantity} />
                        <span class="material-icons-outlined quantity-icons">add</span>
                      </div>
                    </div>
                    <div>
                      <i class="far fa-trash-alt delete-icon"></i>
                    </div>
                  </div>
                </div>
      `;
      cartItems.innerHTML += html;
    });
  }
  cartOverlay.style.display = "block";
};
cartBtn.addEventListener("click", () => {
  showCartModel();
});

const filter = (id) => {
  let remove = cart.filter((item) => {
    return item.id != id;
  });
  cart = remove;
  localStorage.setItem("cart", JSON.stringify(cart));
};
cartOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-icon")) {
    const id = e.target.parentElement.parentElement.parentElement.id;
    filter(id);
    renderList();
    showCartModel();
    updateSubtotal();
    updateBag();
    rerenderCartList();
  } else if (e.target.textContent === "CHECK OUT" && cart.length) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    showCartModel();
    updateSubtotal();
    updateBag();
  }
});

const checkoutBtn = document.querySelector(".subtotal-btn");
checkoutBtn.addEventListener("click", () => {
  if (cart.length) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 3000);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    updateSubtotal();
    updateBag();
    rerenderCartList();
  }
});

const navBag = document.querySelector(".cart-quantity-nav");
const favNavbar = document.querySelector(".fav-quantity-nav");
let bagQuantity = 0;
const updateBag = () => {
  let quantity = 0;
  const favStorage = localStorage.getItem("fav");
  favorites = JSON.parse(favStorage);
  favNavbar.textContent = favorites.length;
  const storage = localStorage.getItem("cart");
  cart = JSON.parse(storage);
  let getTotal = cart.map((item) => {
    return item.quantity;
  });
  getTotal.forEach((quant) => {
    quantity += parseInt(quant);
  });
  bagQuantity = quantity;
  navBag.textContent = `${bagQuantity}`;
};
updateSubtotal();
updateBag();
/**** updating the cart items ***/
cartItems.addEventListener("click", (e) => {
  if (e.target.textContent === "add") {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        item.quantity++;
        item.totalPrice = item.price * item.quantity;
        return item;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    showCartModel();
    updateSubtotal();
    updateBag();
  } else if (e.target.textContent === "remove") {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        if (item.quantity > 1) {
          item.quantity--;
          item.totalPrice = item.price * item.quantity;
          return item;
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    showCartModel();
    updateSubtotal();
    updateBag();
  }
});

/*** this is for cart page ***/
const rerenderCartList = () => {
  let html;
  let htmlMobile;
  const stored = localStorage.getItem("cart");
  cart = JSON.parse(stored);
  if (cart.length === 0) {
    html = `
          <div class="empty-cart">
            <i class="las la-shopping-bag empty-bag"></i>
            <span class="test">Your cart is empty.</span>
          </div> 
         `;
    cartListContainer.innerHTML += html;
  } else {
    cart.forEach((item) => {
      html = `
              <div class="single-list-item" id=${item.id}>
                     <div class="product-list-wrapper">
                       <div class="list-img-container">
                         <img
                           src=${item.img}
                           alt=""
                         />
                       </div>
                       <div>
                         <h5 class="m-y">${item.title}</h5>
                         <i class="far fa-trash-alt del-btn"></i>
                       </div>
                     </div>
                     <div class="price-container">
                       <h5>$${item.price}.00</h5>
                     </div>
                     <div class="quantity-container align-self">
                       <div class="quantity-flex">
                         <span class="material-icons-outlined quantity-icons">remove</span>
                         <input class="quantity" type="number" readonly value=${item.quantity} />
                         <span class="material-icons-outlined quantity-icons">add</span>
                       </div>
                     </div>
                     <div class="cart-list-total">
                       <h5>$${item.totalPrice}.00</h5>
                     </div>
                   </div>
             `;
      cartListContainer.innerHTML += html;
      htmlMobile = `
             <div class="single-mobile-viewcart" id=${item.id}>
            <div class="mobile-productname">
                <div class="mobile-productname-left">
                <span class="some-padd">Product Name</span>
                <h4>${item.title}</h4>
                </div>
                <div class="viewcart-imgcontainer no-right-m">
             <img src=${item.img} alt="">
         </div>
            </div>
            <div class="mobile-productname">
                <span class="product-name">Product Price</span>
                <span class="product-name">$${item.price}.00</span>
            </div>
            <div class="mobile-productname">
                <span>Quantity</span>
                 <div  class="viewcart-qunatity">
             <div class="quantity-container">
                      <div class="quantity-flex">
                        <span class="material-icons-outlined quantity-icons">remove</span>
                        <input class="quantity" type="number" readonly value=${item.quantity} />
                        <span class="material-icons-outlined quantity-icons">add</span>
                      </div>
                    </div>
            </div>
            </div>
            <div class="mobile-productname">
                <span class="product-name">total</span>
                <span class="product-name">$${item.totalPrice}.00</span>
            </div>
            <div class="mobile-productname remove-mar">
                <span>Remove</span>
               <span  class="material-icons-outlined deletedFromCart">close</span>
            </div>
        </div>
             
             `;
      cartListContainer.innerHTML += htmlMobile;
    });
  }
};
rerenderCartList();

cartListContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("del-btn")) {
    const id = e.target.parentElement.parentElement.parentElement.id;
    filter(id);
    renderList();
    updateSubtotal();
    updateBag();
    rerenderCartList();
  }
});

cartListContainer.addEventListener("click", (e) => {
  if (e.target.textContent === "add") {
    const id = e.target.parentElement.parentElement.parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        item.quantity++;
        item.totalPrice = item.price * item.quantity;
        return item;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    updateSubtotal();
    updateBag();
  } else if (e.target.textContent === "remove") {
    const id = e.target.parentElement.parentElement.parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        if (item.quantity > 1) {
          item.quantity--;
          item.totalPrice = item.price * item.quantity;
          return item;
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    updateSubtotal();
    updateBag();
  }
});

/**** cart mobile ***/
cartListContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("deletedFromCart")) {
    const id = e.target.parentElement.parentElement.id;
    filter(id);
    renderList();
    updateSubtotal();
    updateBag();
    rerenderCartList();
  } else if (e.target.textContent === "add") {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        item.quantity++;
        item.totalPrice = item.price * item.quantity;
        return item;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    updateSubtotal();
    updateBag();
  } else if (e.target.textContent === "remove") {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.id;
    cart.forEach((item) => {
      if (item.id == id) {
        if (item.quantity > 1) {
          item.quantity--;
          item.totalPrice = item.price * item.quantity;
          return item;
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderList();
    rerenderCartList();
    updateSubtotal();
    updateBag();
  }
});

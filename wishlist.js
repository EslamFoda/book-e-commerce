/**** cart  ****/
let cart = [];
let favorites = [];
let storageForCart = localStorage.getItem("cart");
if (storageForCart === null) {
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
 
};

closeCart.addEventListener("click", () => {
  renderList();
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
    showCartModel();
    updateSubtotal();
    updateBag();
  }
});

/**** this is for wishlist page */

const mainContainer = document.querySelector(".main-container");
let favStorage = localStorage.getItem("fav");
if (favStorage === null) {
  localStorage.setItem("fav", JSON.stringify(favorites));
} else {
  let storedFav = localStorage.getItem("fav");
  favorites = JSON.parse(storedFav);
}
const whishlistContainer = document.querySelector(".wishlist-container");
const rerenderWhislist = () => {
  whishlistContainer.innerHTML = ''
  let html;
  const stored = localStorage.getItem("fav");
  favorites = JSON.parse(stored);
  if (favorites.length === 0) {
    html = `
          <div class="empty-wishlist">
            <span class="empty-wishlist-title">No products were added to the wishlist page . <a class='back-shop' href='index.html#shop'>Back to shopping </a></span>
          </div> 
         `;
    mainContainer.innerHTML += html;
  } else {
    favorites.forEach((item) => {
      html = `
         <div class="single-item-wishlist" id=${item.id}>
            <div class="wishlist-img-container">
              <img
                src=${item.img}
                alt=""
              />
              <div class="items-icons-wishlist">
                <div>
                  <i class="lar la-star fav-active"></i>
                </div>
                <div>
                  <i class="lar la-eye border"></i>
                </div>
              </div>
              <div class="quick-btn-container">
                <button class='quick-btn'>Quick Add</button>
              </div>
            </div>
            <div class="item-details">
              <h1>${item.title}</h1>
              <h5>$${item.price}.00</h5>
            </div>
          </div>
          `;

      whishlistContainer.innerHTML += html;
    });
  }
};
rerenderWhislist();



const renderModelData = ( showModel,id, modelName, html) => {
  modelName.innerHTML = ''
  showModel.forEach((item) => {
    html = `
         <div id=${id} class="model-content scale-up-center">
      <div class="img-container-model">
        <img
          src=${item.img}
          alt=""
        />
      </div>
      <div class="model-right">
        <i class="las la-times close-model"></i>
        <h5>${item.title}</h5>
        <h3 class="price">$${item.price}.00</h3>
        <p class="para">
          ${item.desc}
        </p>
        <h4 class="q-h5">Quantity </h4>
        <div class="add-container">
          <div class="quantity-container">
            <div class="quantity-flex">
              <span class="material-icons-outlined quantity-icons">remove</span>
              <input class="quantity" class="number" readonly value="1"/>
              <span class="material-icons-outlined quantity-icons">add</span>
            </div>
          </div>
          <button class="add-btn">ADD TO CART</button>
        </div>
      </div>
    </div>
       `;
    modelName.innerHTML += html;
  });
   
};
const model = document.querySelector(".model-overlay");
whishlistContainer.addEventListener('click',(e)=>{
  let html;
   if (e.target.classList.contains("la-eye")) {
     model.style.display = "flex";
     const id =
       e.target.parentElement.parentElement.parentElement.parentElement.id;
     const getFavModel = favorites.filter(item=>{
       return item.id === id
     })
     renderModelData(getFavModel, id, model,html);
   } else if (e.target.classList.contains("quick-btn")) {
     const id =
       e.target.parentElement.parentElement.parentElement.id;
       const getItem = favorites.filter((item) => {
         return item.id === id;
       });
       cart.push(getItem[0]);
       localStorage.setItem("cart", JSON.stringify(cart));
       showCartModel();
       updateSubtotal();
       updateBag();
   } else if (e.target.classList.contains('la-star')){
      const id =
        e.target.parentElement.parentElement.parentElement.parentElement.id;
     database
       .collection("best")
       .doc(id)
       .get()
       .then((doc) => {
         if (doc.exists) {
           doc.ref
             .update({
               fav: false,
             })
             let filterFav = favorites.filter((item) => {
               return item.id !== id;
             });
             favorites = filterFav;
             localStorage.setItem("fav", JSON.stringify(favorites));
             rerenderWhislist();
             M.toast({ html: "Item Removed From Wishlist" });  
             updateBag();             
         } else {

           database
             .collection("new")
             .doc(id)
             .get()
             .then((doc) => {
               if (doc.exists) {
                 console.log("document data: ", doc.data());
                 doc.ref.update({
                   fav: false,
                 });
                 let filterFav = favorites.filter((item) => {
                   return item.id !== id;
                 });
                 favorites = filterFav;
                 localStorage.setItem("fav", JSON.stringify(favorites));
                 rerenderWhislist();
                 M.toast({ html: "Item Removed From Wishlist" });
                 updateBag();
               } else {
                 database.collection('sale').doc(id).get().then(doc=>{
                   if(doc.exists) {
                     console.log(doc.data())
                     doc.ref.update({
                       fav: false,
                     });
                     let filterFav = favorites.filter((item) => {
                       return item.id !== id;
                     });
                     favorites = filterFav;
                     localStorage.setItem("fav", JSON.stringify(favorites));
                     rerenderWhislist();
                    M.toast({ html: "Item Removed From Wishlist" });
                    updateBag();
                   }
                 })
               }
             });
         }
       })
       
   }
})


let selectedItem;
model.addEventListener("click",(e)=>{
  let data;
  if (e.target.classList.contains("close-model")) {
    e.target.parentElement.parentElement.classList.add("scale-out-center");

    setTimeout(() => {
      model.style.display = "none";
      e.target.parentElement.parentElement.remove();
    }, 500);
    e.target.parentElement.parentElement.classList.remove("scale-up-center");
  }else if (e.target.textContent === "add"){
     const input = document.querySelector(".quantity");
     const modelContent = document.querySelector(".model-content");
     input.value++
     const getFav = favorites.filter(item=>{
       return item.id === modelContent.id
     })
     data = getFav[0];
      selectedItem = {
        title: data.title,
        price: data.price,
        img: data.img,
        quantity: parseInt(input.value),
        totalPrice: data.price * input.value,
        id: Math.floor(
          Math.random() * 10000000000000000000000000000000000000000000
        ),
      };
    
  } else if (e.target.textContent === "remove"){
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
     if (input.value > 1) {
        input.value--;
        const getFav = favorites.filter((item) => {
          return item.id === modelContent.id;
        });
        data = getFav[0];
        selectedItem = {
          title: data.title,
          price: data.price,
          img: data.img,
          quantity: parseInt(input.value),
          totalPrice: data.price * input.value,
          id: Math.floor(
            Math.random() * 10000000000000000000000000000000000000000000
          ),
        };
       
     }
  } else if (e.target.classList.contains("add-btn")){
     const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
    if (input.value === "1"){
      const getFav = favorites.filter((item) => {
        return item.id === modelContent.id;
      });
      data = getFav[0];
      selectedItem = {
        title: data.title,
        price: data.price,
        img: data.img,
        quantity: parseInt(input.value),
        totalPrice: data.price * input.value,
        id: Math.floor(
          Math.random() * 10000000000000000000000000000000000000000000
        ),
      };
      cart.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      modelContent.classList.add("scale-out-center");

      setTimeout(() => {
        model.style.display = "none";
        modelContent.remove();
      }, 500);
      modelContent.classList.remove("scale-up-center");
      setTimeout(() => {
        showCartModel();
        updateSubtotal();
        updateBag();
      }, 500);
    } else {
      cart.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      modelContent.classList.add("scale-out-center");

      setTimeout(() => {
        model.style.display = "none";
        modelContent.remove();
      }, 500);
      modelContent.classList.remove("scale-up-center");
      setTimeout(() => {
        showCartModel();
        updateSubtotal();
        updateBag();
      }, 500);
    }
  }
})
let cart = [];
let favorites = [];
let favStorage = localStorage.getItem("fav");

let storageForCart = localStorage.getItem("cart");
if (storageForCart === null && favStorage === null) {
  localStorage.setItem("fav", JSON.stringify(favorites));
  localStorage.setItem("cart", JSON.stringify(cart));
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

/*** best sellers */
const itemsGrid = document.querySelector(".Best-grid");
const spinner = document.querySelector(".spinner");
let bestSellers = [];
spinner.style.display = "block";
const renderItemsList = (listName, html, containerName) => {
  spinner.style.display = "none";
  containerName.innerHTML = "";
  listName.forEach((item) => {
    if (item.fav) {
      html = `
          <div class="single-item" id=${item.id}>
            <div class="item-img-container">
              <img
                src=${item.img}
                alt=""
              />
              <div class="items-icons">
                <div>
                  <i class="las la-shopping-bag border"></i>
                </div>
                <div>
                  <i class="lar la-eye border"></i>
                </div>
                <div>
                  <i class="lar la-star fav-active"></i>
                </div>
              </div>
            </div>
            <div class="item-details">
              <h1>${item.title}</h1>
              <h5>$${item.price}.00</h5>
            </div>
          </div>
          `;

      containerName.innerHTML += html;
    } else {
      html = `
          <div class="single-item" id=${item.id}>
            <div class="item-img-container">
              <img
                src=${item.img}
                alt=""
              />
              <div class="items-icons">
                <div>
                  <i class="las la-shopping-bag border"></i>
                </div>
                <div>
                  <i class="lar la-eye border"></i>
                </div>
                <div>
                  <i class="lar la-star "></i>
                </div>
              </div>
            </div>
            <div class="item-details">
              <h1>${item.title}</h1>
              <h5>$${item.price}.00</h5>
            </div>
          </div>
          `;

      containerName.innerHTML += html;
    }
  });
};
database.collection("best").onSnapshot((snap) => {
  let html;
  let result = [];

  snap.docs.forEach((doc) => {
    result.push({ ...doc.data(), id: doc.id });
  });
  bestSellers = result;
  renderItemsList(bestSellers, html, itemsGrid);
});

const model = document.querySelector(".model-overlay");
const newModel = document.querySelector(".new-model-overlay");
const saleModel = document.querySelector(".sale-model-overlay");
let item;

itemsGrid.addEventListener("click", (e) => {
  let html;
  if (e.target.classList.contains("la-eye")) {
    model.style.display = "flex";
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    renderModelData("best", id, model, html);
  } else if (e.target.classList.contains("la-shopping-bag")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("best")
      .doc(id)
      .get()
      .then((res) => {
        data = res.data();
        selectedItem = {
          title: data.title,
          price: data.price,
          img: data.img,
          quantity: 1,
          totalPrice: data.price * 1,
          id: Math.floor(
            Math.random() * 10000000000000000000000000000000000000000000
          ),
        };
        cart.push(selectedItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        showCartModel();
        updateSubtotal();
        updateBag();
      });
  } else if (e.target.classList.contains("la-star")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("best")
      .doc(id)
      .get()
      .then((doc) => {
        doc.ref.update({ fav: !doc.data().fav });
      });
    if (!e.target.classList.contains("fav-active")) {
      database
        .collection("best")
        .doc(id)
        .get()
        .then((res) => {
          data = res.data();
          selectedItem = {
            title: data.title,
            price: data.price,
            img: data.img,
            desc: data.desc,
            quantity: 1,
            totalPrice: data.price * 1,
            id: id,
          };
          if (favorites) {
            favorites.push(selectedItem);
          }
          localStorage.setItem("fav", JSON.stringify(favorites));
          M.toast({ html: "Item Added To Wishlist" });
          updateBag();
        });
    } else {
      let filterFav = favorites.filter((item) => {
        return item.id !== id;
      });
      favorites = filterFav;
      localStorage.setItem("fav", JSON.stringify(favorites));
      M.toast({ html: "Item Removed From Wishlist" });
      updateBag();
    }
  }
});

/*** model ****/
let selectedItem;
model.addEventListener("click", (e) => {
  let data;
  if (e.target.classList.contains("close-model")) {
    e.target.parentElement.parentElement.classList.add("scale-out-center");

    setTimeout(() => {
      model.style.display = "none";
      e.target.parentElement.parentElement.remove();
    }, 500);
    e.target.parentElement.parentElement.classList.remove("scale-up-center");
  } else if (e.target.textContent === "add") {
    const input = document.querySelector(".quantity");
    const modelContent = document.querySelector(".model-content");
    input.value++;
    database
      .collection("best")
      .doc(modelContent.id)
      .get()
      .then((res) => {
        data = res.data();

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
      });
  } else if (e.target.textContent === "remove") {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
    if (input.value > 1) {
      input.value--;
      database
        .collection("best")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
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
        });
    }
  } else if (e.target.classList.contains("add-btn")) {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
    if (input.value === "1") {
      database
        .collection("best")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
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
        });
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
});

newModel.addEventListener("click", (e) => {
  let data;
  if (e.target.classList.contains("close-model")) {
    e.target.parentElement.parentElement.classList.add("scale-out-center");

    setTimeout(() => {
      newModel.style.display = "none";
      e.target.parentElement.parentElement.remove();
    }, 500);
    e.target.parentElement.parentElement.classList.remove("scale-up-center");
  } else if (e.target.textContent === "add") {
    const input = document.querySelector(".quantity");
    const modelContent = document.querySelector(".model-content");
    input.value++;
    database
      .collection("new")
      .doc(modelContent.id)
      .get()
      .then((res) => {
        data = res.data();
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
      });
  } else if (e.target.textContent === "remove") {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
    if (input.value > 1) {
      input.value--;
      database
        .collection("new")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
          selectedItem = {
            title: data.title,
            price: data.price,
            img: data.img,
            quantity: parseInt(input.value),
            totalPrice: data.price * input.value,
            id: Math.floor(Math.random() * 1000000000000000000000000000),
          };
        });
    }
  } else if (e.target.classList.contains("add-btn")) {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");

    if (input.value === "1") {
      database
        .collection("new")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
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
            newModel.style.display = "none";
            modelContent.remove();
          }, 500);
          modelContent.classList.remove("scale-up-center");
          setTimeout(() => {
            showCartModel();
            updateSubtotal();
            updateBag();
          }, 500);
        });
    } else {
      cart.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      modelContent.classList.add("scale-out-center");

      setTimeout(() => {
        newModel.style.display = "none";
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
});

saleModel.addEventListener("click", (e) => {
  let data;
  if (e.target.classList.contains("close-model")) {
    e.target.parentElement.parentElement.classList.add("scale-out-center");

    setTimeout(() => {
      saleModel.style.display = "none";
      e.target.parentElement.parentElement.remove();
    }, 500);
    e.target.parentElement.parentElement.classList.remove("scale-up-center");
  } else if (e.target.textContent === "add") {
    const input = document.querySelector(".quantity");
    const modelContent = document.querySelector(".model-content");
    input.value++;
    database
      .collection("sale")
      .doc(modelContent.id)
      .get()
      .then((res) => {
        data = res.data();
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
      });
  } else if (e.target.textContent === "remove") {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");
    if (input.value > 1) {
      input.value--;
      database
        .collection("sale")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
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
          console.log(selectedItem);
        });
    }
  } else if (e.target.classList.contains("add-btn")) {
    const modelContent = document.querySelector(".model-content");
    const input = document.querySelector(".quantity");

    if (input.value === "1") {
      database
        .collection("sale")
        .doc(modelContent.id)
        .get()
        .then((res) => {
          data = res.data();
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
            saleModel.style.display = "none";
            modelContent.remove();
          }, 500);
          modelContent.classList.remove("scale-up-center");
          setTimeout(() => {
            showCartModel();
            updateSubtotal();
            updateBag();
          }, 500);
        });
    } else {
      cart.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      modelContent.classList.add("scale-out-center");

      setTimeout(() => {
        saleModel.style.display = "none";
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
});
/*** new arrivals */
const NewGrid = document.querySelector(".New-grid");
let newItems = [];
database.collection("new").onSnapshot((snap) => {
  let html;
  let result = [];

  snap.docs.forEach((doc) => {
    result.push({ ...doc.data(), id: doc.id });
  });
  newItems = result;
  renderItemsList(newItems, html, NewGrid);
});

NewGrid.addEventListener("click", (e) => {
  let html;
  if (e.target.classList.contains("la-eye")) {
    newModel.style.display = "flex";
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;

    renderModelData("new", id, newModel, html);
  } else if (e.target.classList.contains("la-shopping-bag")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("new")
      .doc(id)
      .get()
      .then((res) => {
        data = res.data();
        selectedItem = {
          title: data.title,
          price: data.price,
          img: data.img,
          quantity: 1,
          totalPrice: data.price * 1,
          id: Math.floor(
            Math.random() * 10000000000000000000000000000000000000000000
          ),
        };
        cart.push(selectedItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        showCartModel();
        updateSubtotal();
        updateBag();
      });
  } else if (e.target.classList.contains("la-star")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("new")
      .doc(id)
      .get()
      .then((doc) => {
        doc.ref.update({ fav: !doc.data().fav });
      });
    if (!e.target.classList.contains("fav-active")) {
      database
        .collection("new")
        .doc(id)
        .get()
        .then((res) => {
          data = res.data();
          selectedItem = {
            title: data.title,
            price: data.price,
            img: data.img,
            desc: data.desc,
            quantity: 1,
            totalPrice: data.price * 1,
            id: id,
          };
          favorites.push(selectedItem);
          localStorage.setItem("fav", JSON.stringify(favorites));
          M.toast({ html: "Item Added To Wishlist" });
          updateBag();
        });
    } else {
      let filterFav = favorites.filter((item) => {
        return item.id !== id;
      });
      favorites = filterFav;
      localStorage.setItem("fav", JSON.stringify(favorites));
      M.toast({ html: "Item Removed From Wishlist" });
      updateBag();
    }
  }
});

/*** sale items */
const saleGrid = document.querySelector(".Sale-grid");
let saleItems = [];
database.collection("sale").onSnapshot((snap) => {
  let html;
  let result = [];

  snap.docs.forEach((doc) => {
    result.push({ ...doc.data(), id: doc.id });
  });
  saleItems = result;
  renderItemsList(saleItems, html, saleGrid);
});

const renderModelData = (collection, id, modelName, html) => {
  database
    .collection(collection)
    .doc(id)
    .get()
    .then((res) => {
      item = res.data();

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
saleGrid.addEventListener("click", (e) => {
  let html;
  if (e.target.classList.contains("la-eye")) {
    saleModel.style.display = "flex";
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    renderModelData("sale", id, saleModel, html);
  } else if (e.target.classList.contains("la-shopping-bag")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("sale")
      .doc(id)
      .get()
      .then((res) => {
        data = res.data();
        selectedItem = {
          title: data.title,
          price: data.price,
          img: data.img,
          quantity: 1,
          totalPrice: data.price * 1,
          id: Math.floor(
            Math.random() * 10000000000000000000000000000000000000000000
          ),
        };
        cart.push(selectedItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        showCartModel();
        updateSubtotal();
        updateBag();
      });
  } else if (e.target.classList.contains("la-star")) {
    const id =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    database
      .collection("sale")
      .doc(id)
      .get()
      .then((doc) => {
        doc.ref.update({ fav: !doc.data().fav });
      });
    if (!e.target.classList.contains("fav-active")) {
      database
        .collection("sale")
        .doc(id)
        .get()
        .then((res) => {
          data = res.data();
          selectedItem = {
            title: data.title,
            price: data.price,
            img: data.img,
            desc: data.desc,
            quantity: 1,
            totalPrice: data.price * 1,
            id: id,
          };
          favorites.push(selectedItem);
          localStorage.setItem("fav", JSON.stringify(favorites));
          console.log(favorites);
        });
      M.toast({ html: "Item Added To Wishlist" });
      updateBag();
    } else {
      let filterFav = favorites.filter((item) => {
        return item.id !== id;
      });
      favorites = filterFav;
      localStorage.setItem("fav", JSON.stringify(favorites));

      M.toast({ html: "Item Removed From Wishlist" });
      updateBag();
    }
  }
});

const cartItems = document.querySelector(".cart-items");
const cartBtn = document.querySelector(".la-shopping-bag");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCart = document.querySelector(".close-icon");
const renderList = () => {
  cartOverlay.style.display = "none";
  Array.from(cartItems.children).forEach((child) => {
    child.remove();
  });
};

closeCart.addEventListener("click", renderList);
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
const favNavbar = document.querySelector(".fav-quantity-nav");
const navBag = document.querySelector(".cart-quantity-nav");
let bagQuantity = 0;
const updateBag = () => {
  let quantity = 0;

  const favStorage = localStorage.getItem("fav");
  favorites = JSON.parse(favStorage);
  if (favorites) {
    favNavbar.textContent = favorites.length;
  }
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

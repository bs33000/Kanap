/*******************************************************/
/************** oriented object Basket ****************/
/************* let basket = new Basket() ***************/
/*******************************************************/
class Basket{

  basket = [];

  constructor() {
    let basket = localStorage.getItem("basket");
    if (basket != null) {
      this.basket = JSON.parse(basket);
    }
  }

  save() {
    localStorage.setItem("basket", JSON.stringify(this.basket));
  }

  add(product) {
    let foundProduct = this.basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
      foundProduct.quantity++;
    } else {
      product.quantity = 1;
      this.basket.push(product)
    }
    this.save();
  }

  clear() {
    localStorage.clear("basket");
  }

  remove(product) {
    this.basket = this.basket.filter (p => p.id != product.id);
    this.save();
  }

  addWithQuantity(product, quantity) {
    let foundProduct = this.basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
      foundProduct.quantity += quantity;
    } else {
      product.quantity = quantity;
      this.basket.push(product)
    }
    this.save();
  }

  changeQuantity (product, quantity) {
    let foundProduct = this.basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
      foundProduct.quantity += quantity;
      if (foundProduct.quantity <=0){
        this.remove(foundProduct);
      } else {
        this.save();
      }
    }
  }

  getProductById(id) {
    let foundProduct = this.basket.find(p => p.id == id);
    if (foundProduct != undefined) {
      return foundProduct;
    } else {
      alert("no corresponding product with this id")
    }
  }

  getNumberOfProducts() {
    let number = 0;
    for (let product of this.basket) {
      number += product.quantity;
    }
    return number;
  }

  getTotalPrice() {
    let total = 0;
    for (let product of this.basket) {
      total += product.quantity * product.price;
    }
    return total;
  }
}


async function fetchAllProducts() {
  /* fetch all products from API */
  try {
    const url = `http://localhost:3000/api/products`;
    const response = await fetch(url);
    const data = await response.json();
    return data;

  } catch (err) {
    alert (`Erreur       : ${err}  \n- veuillez consulter le fichier READ.me -`);
    return null;
  }
}

function getProductPrice (productId,data){
  // get product price in database: avoiding price storage = fraud risk
  return data.find(x => x._id === productId).price
}

function getTotalCartPrice (basket, data){
  /* for each cart item of basket, get corresponding price from database
  and compute quantity x price;
  then sum all
  */
  let total = 0;
  for (let product of basket) {
    total += product.quantity * getProductPrice (product.productId, data);
  }
  return total;
}

async function displayTotalInvoice (cartQuantity, cartPrice){
  /* display cart total price and quantity at the right nodes on cart.HTML
  */
  let totalQuantity = document.getElementById("totalQuantity");
  let totalPrice = document.getElementById("totalPrice");
  totalQuantity.innerText =  cartQuantity;
  totalPrice.innerText =  cartPrice;
}

async function displayCartItem (cartItem, product){
  /* Display dynamically one cart item
  sensitive product info, such as price, is directly obtained from product API
  */

  // create DOM nodes
  const cartItems = document.getElementById("cart__items");
  const article = document.createElement("article");
  const divImg = document.createElement("div");
  const divContent = document.createElement("div");
  const divContentInfo = document.createElement("div");
  const divSettings = document.createElement("div");
  const divSettingsQty = document.createElement("div");
  const divSettingsDelete = document.createElement("div");
  const img = document.createElement("img");
  const h2 = document.createElement("h2");
  const pColor = document.createElement("p");
  let pPrice = document.createElement("p");
  let pQty = document.createElement("p");
  let pDel = document.createElement("p");
  let inputQty = document.createElement("input");

  // dynamic HTML structure
  cartItems.appendChild(article);
  article.appendChild(divImg);
  divImg.appendChild(img);
  article.appendChild(divContent);
  divContent.appendChild(divContentInfo);
  divContentInfo.appendChild(h2);
  divContentInfo.appendChild(pPrice);
  divContentInfo.appendChild(pColor);
  divContent.appendChild(divSettings);
  divSettings.appendChild(divSettingsQty);
  divSettingsQty.appendChild(pQty);
  divSettingsQty.appendChild(inputQty);
  divSettings.appendChild(divSettingsDelete);
  divSettingsDelete.appendChild(pDel);


  //  Add classes dynamically
  article.classList.add("cart__item");
  divImg.classList.add("cart__item__img");
  divContent.classList.add("cart__item__content");
  divContentInfo.classList.add("cart__item__content__titlePrice");
  divSettings.classList.add("cart__item__content__settings");
  divSettingsQty.classList.add("cart__item__content__settings__quantity");
  divSettingsDelete.classList.add("cart__item__content__settings__delete");
  pDel.classList.add("deleteItem");
  inputQty.classList.add("inputQty");

  // Attributes
  inputQty.setAttribute("type", "number");
  inputQty.setAttribute("name", "itemQuantity");
  inputQty.setAttribute("min", "1"); //force minimum as 1 => custy has to use delete btn
  inputQty.setAttribute("max", "100");
  inputQty.setAttribute("value", `${cartItem.quantity}`); //display current quantity
  //set a data attribute for each article => can be idendified specifically when EventListened
  article.setAttribute(`data-id`, `${cartItem.id}`);

  // Set values
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  pPrice.innerText = product.price + " €";
  pColor.innerText = cartItem.productColor;
  pDel.innerText = "Supprimer";
  h2.innerText = product.name;
}

async function fetchPostOrder(contact, products) {
  /* POST contact info and cart content to backe-end
  "http://localhost:3000/api/products/order"
  Get order ID as a reply from backend
  */

  fetch("http://localhost:3000/api/products/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", //define expected content type
  },
  body: JSON.stringify({ contact, products }),
})

.then((response) => response.json())
.then((data) => {
  // without using local storage
  window.location.href = `confirmation.html?id=${data.orderId}`;
})
.catch((err) => {
  alert("Erreur : " + err);
});
return null;
}

function inputContactOk () {
  /* verify that each required field is correctly inputed
  return True is everything is ok + the object contact
  */

  // accepted format for contact info
  const regexName = /^(?=.{1,50}$)[a-z\u00C0-\u00FF]+(?:['-_.\s][a-z\u00C0-\u00FF]+)*$/i;
  const regexLocation = /^[a-zA-Z0-9\u00C0-\u00FF\s,. '-]{3,}$/;
  const regexEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  let inputFisrtNameOk = false;
  let inputLastNameOk = false;
  let inputAddressOk = false;
  let inputCityOk = false;
  let inputEmailOk = false;

  // create contact details required format
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };

  // verify each required input format
  if (!regexName.test(contact.firstName)) {
    inputFisrtNameOk = false;
    document.getElementById('firstNameErrorMsg').innerText =
    "Merci de vérifier le format de saisie du prénom";
  } else {inputFisrtNameOk = true}

  if (!regexName.test(contact.lastName)) {
    inputLastNameOk = false;
    document.getElementById('lastNameErrorMsg').innerText =
    "Merci de vérifier le format de saisie du nom";
  } else {inputLastNameOk = true}

  if (!regexLocation.test(contact.address)) {
    inputAddressOk = false;
    document.getElementById('addressErrorMsg').innerText =
    "Merci de vérifier le format de saisie de l'adresse";
  } else {inputAddressOk = true}

  if (!regexLocation.test(contact.city)) {
    inputCityOk = false;
    document.getElementById('cityErrorMsg').innerText =
    "Merci de vérifier le format de saisie de la ville";
  } else {inputCityOk = true}

  if (!regexEmail.test(contact.email)) {
    inputEmailOk = false;
    document.getElementById('emailErrorMsg').innerText =
    "Merci de vérifier le format de saisie de l'email";
  } else {inputEmailOk = true}

  let inputIsOk = (inputFisrtNameOk == true && inputLastNameOk == true &&
    inputAddressOk == true &&  inputCityOk == true && inputEmailOk == true);

  return [inputIsOk, contact];
}


function orderManagement(basket) {
  /* Wait for custy to input contact info
  check input format
  create contact and product_array as required by API, and POST to API
  */

  const orderBtn = document.getElementById("order");
  orderBtn.addEventListener("click", (e) => {
    let res = inputContactOk();
    let inputIsOk = res[0];
    let contact = res[1];

    // if all input are correct, generate order data and post to API
    if (inputIsOk) {
      e.preventDefault();

      // create API required product id list
      let cartItemArray = [];
      for (let item of basket.basket){
        cartItemArray.push(item.productId)
      };
      // Post order with required contact and productId array
      fetchPostOrder(contact, cartItemArray);
      window.location.href="confirmation.html#limitedWidthBlock";
      basket.clear();

    } else {
        alert("Certains éléments du formulaire contact sont incorrectement remplis, veuillez réessayer svp");
    }
  });
}



async function renderCartPage() {
  /* display cart content using product API info
  - manage deletion and cartItem change of quantity
  -uptdate total of articles & price
  - if cart is not empty => function orderManagement
  */

  const data = await fetchAllProducts();
  let basket = new Basket();

  // Check for empty basket
  if (basket.basket.length === 0 ) {
    const emptyCart = document.querySelector("h1");
    emptyCart.innerHTML = emptyCart.innerText + " \nest vide";
    // hide unecessary order contact infos
    document.getElementsByClassName("cart__order")[0].setAttribute("style", "display:none");

    // display clickable link to go back to index
    const pToHome = document.createElement("p");
    emptyCart.appendChild(pToHome);
    pToHome.style.color = "blue";
    pToHome.style.fontSize = "large";
    pToHome.style.cursor = "pointer";
    pToHome.innerHTML = "=> Retour Accueil <=";
    pToHome.addEventListener ("click", function(e){window.location.href="index.html"});

    // if not empty, display products listed in basket as saved in local storage
    } else {
      // display each product in the basket - getting full product info for a given item
      for (let cartItem of basket.basket) {
        let product = data.find(p => p._id === cartItem.productId);
        displayCartItem(cartItem, product);
      };

      // Manage item deletion: add an evenListener for each item
      // and remove it from the DOM and the basket
      let item = document.getElementsByClassName("deleteItem");
      for (let i = 0; i < item.length; i++) {
        item[i].addEventListener("click", function(e){
          let article = e.target.closest("article"); // go up to the parent article
          let cartItem = basket.getProductById(article.dataset.id); //corresponding item
          basket.remove(cartItem); // remove item from basket
          article.remove(); // remove item from DOM
          if (basket.basket.length === 0 ) {document.location.reload(true)}
          displayTotalInvoice(basket.getNumberOfProducts(),
          getTotalCartPrice (basket.basket, data));
        });
      }

      // Manage adding quantity to existing cart item: add an evenListener for each item
      // display new basket quantity, amend basket
      let item2 = document.getElementsByClassName("inputQty");
      for (let i = 0; i < item2.length; i++) {
        item2[i].addEventListener("input", function(e){
          let article = e.target.closest("article"); // go up to the parent article
          let cartItem = basket.getProductById(article.dataset.id); //corresponding item
          basket.changeQuantity(cartItem, Number(e.target.value) - cartItem.quantity); //adjust qty by delta between intial and new qty
          displayTotalInvoice(basket.getNumberOfProducts(),
          getTotalCartPrice (basket.basket, data));
        });
      }

      // compute and display cart's number of articles and total price
      displayTotalInvoice(basket.getNumberOfProducts(),
      getTotalCartPrice (basket.basket, data));

      // complete the order unless basket is empty
      if (basket.basket.length !== 0) {
        orderManagement(basket);
      }
    }
  }



  /********************* Execute *************************/

  renderCartPage();
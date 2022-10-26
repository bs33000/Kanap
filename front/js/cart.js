/************** oriented object version ****************/
/************* let basket = new Basket() ***************/
/*******************************************************/
class Basket{
  /* better performance: the object is created only once ("basket = new Basket()"), 
  where the functions call the basket each time ("getBasket()") */
  constructor() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
      this.basket = [];
    } else {
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
    console.log(`Erreur : ` + err);
    console.log(`Veuillez consulter le fichier README`);
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

  // Set values
  img.src = product.imageUrl;
  img.alt = product.altTxt;
  pPrice.innerText = product.price + " €";
  pColor.innerText = cartItem.productColor;
  pQty.innerText = cartItem.quantity;
  pDel.innerText = "Supprimer";
  h2.innerText = product.name;

  // Organise page display
  cartItems.appendChild(article);
  article.appendChild(divImg);
  divImg.appendChild(img);
  article.appendChild(divContent);
  divContent.appendChild(divContentInfo);
  divContent.appendChild(divSettings);
  divSettings.appendChild(divSettingsQty);
  divSettingsQty.appendChild(pQty);
  divSettingsQty.appendChild(inputQty);
  divSettings.appendChild(divSettingsDelete);
  divSettingsDelete.appendChild(pDel);
  divContentInfo.appendChild(h2);
  divContentInfo.appendChild(pPrice);
  divContentInfo.appendChild(pColor);

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
  article.setAttribute(`data-id`, `${cartItem.productId}`);
  inputQty.setAttribute("type", "number");
  inputQty.setAttribute("name", "itemQuantity");
  inputQty.setAttribute("min", "1");
  inputQty.setAttribute("max", "100");
  inputQty.setAttribute("value", 0); // 0 with option to clik & add to current quantity 
  //inputQty.setAttribute("value", `${cartItem.quantity}`); //display current quantity
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
      localStorage.setItem("order", JSON.stringify(data));
    })
    .catch((err) => {
      alert("Erreur : " + err);
      console.log(`Erreur : ` + err);
    });
  return null;
}


function orderManagement(basket) {
/* Wait for custy to input contact info
check input format
create contact and product_array as specified, and POST to API
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

  const orderBtn = document.getElementById("order");
  orderBtn.addEventListener("click", (e) => {
    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };

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

    if (inputFisrtNameOk == true &
        inputLastNameOk == true &
        inputAddressOk == true &
        inputCityOk == true &
        inputEmailOk == true) {
      e.preventDefault();
      let cartItemArray = [];
      for (let item of basket.basket){
        cartItemArray.push(item.productId)
      };
      console.log(cartItemArray);
      console.log(contact);
      fetchPostOrder(contact, cartItemArray);
      //alert("Commande enregistrée - Merci");
      window.location.href="confirmation.html#limitedWidthBlock";
      //basket.clear();

    } else {
      alert("Certains éléments du formulaire contact sont incorrectement remplis, veuillez réessayer svp");
    }
  });
}

async function renderCartPage() {
  /* display cart content
  combine cart content and product API
  */

  let basket = new Basket();
  //alert(JSON.stringify(basket));
  //console.log(basket == []);
  //console.log(basket);

  // Check for empty local storage
  if (basket === [] ) {
    const emptyCart = document.querySelector("h1");
    emptyCart.innerHTML = emptyCart.innerText + " est vide, veuillez aller sur la page d'accueil";

  // display products listed in basket as saved in local storage
  } else {
    const data = await fetchAllProducts();

    for (let cartItem of basket.basket) {
      let product = data.find(p => p._id === cartItem.productId);
      displayCartItem(cartItem, product);

      // Delete an item from cart by click
      // using event delegation since pDel has been created dynamicaly in the DOM
      // https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript
      document.addEventListener('click', function(e){
        //if(e.target && e.target.classlist == 'pDel'){
            console.log('e ' + e);
            console.log('e.target ' + e.target);
            console.log('e.target.id ' + e.target.id);
            console.log('e.target.classlist ' + e.target.classList);

            //basket.remove(product);
            //alert("Produit supprimé du panier");
            //document.reload(true);
        //}
      });

      document.addEventListener('click', function(){
        document.querySelectorAll('.pDel').forEach(function(el){
          el.addEventListener('click',function(){
            alert('Hello')
          })
        })
      });




/*
      let item = document.getElementsByClassName("pDel");
      for (let i = 0; i < item.length; i++) {
        item[i].addEventListener("click", console.log('i= ' + i ));
   
      }
      */



/*
      // Amend cart item quantity => add inputed value to existing quantity
      inputQty.addEventListener ("input", function()  {
        basket.changeQuantity(product, Number(this.value));
        pQty.innerText = Number(this.value);
        pPrice.innerText = product.price * Number(this.value) + " €";
        alert("Quantité modifiée dans le panier");
      });*/
    };

    // compute and display cart number of articles and total price
    let totalInvoice = getTotalCartPrice (basket.basket, data);
    displayTotalInvoice(basket.getNumberOfProducts(),totalInvoice);
  }

  if (basket !=[], orderManagement(basket));
}



/********************* Execute *************************/
renderCartPage();
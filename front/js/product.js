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

/**
 * Get product id from the product URL
 * @param {*} urlId
 * @returns Object
 */
async function fetchProductById(urlId) {
  try {
    // Product URL
    const url = `http://localhost:3000/api/products/${urlId}`;
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
      alert (`Erreur       : ${err}`);
    return {};
  }
}

/**
 * Display details for a single Product, including choice of colors
 * @param {*} product
 * @returns void
 */
function displayProductDetail(product) {
   // create DOM nodes
  const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;

  // populate product infos in DOM
  document.getElementsByClassName("item__img")[0].appendChild(img);
  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price;
  document.getElementById("description").innerText = product.description;

  // Retrieve available color choices and propose them in the HTML option/select btn
  product.colors.forEach(function (color) {
    const option = document.createElement("option");
      option.value = color;
      option.innerText = color;
    const select = document.getElementById("colors");
      select.appendChild(option);
  });
}

/**
 *  Create a new product or add quantity to an existing product id
 * - verify that a quantity (>0) and a color have been selected
 * - create a product with a unique product id = product._id + color
 * - add this object to basket with listened quantity
 * @param {*} dataProduct
 * @param {*} basket
 * @returns boolean
 */
function addProductToCart(dataProduct, basket) {
  const inputColor = document.getElementById("colors").value;
  const inputQty = document.getElementById("quantity").value;

  // verify that a quantity (>0) and a color have been selected
  if (inputColor == "" || inputQty <= 0) {
    if (inputColor == "") { alert("Veuillez choisir une couleur svp")}
    if (inputQty <= 0) {alert("Veuillez choisir la quantité désirée svp")}
    return false;

  } else {
    // create product object with unique id
    let product = {
      id : dataProduct._id + '-' + inputColor,
      productId: dataProduct._id,
      productColor: inputColor,
      quantity: Number(inputQty)
    };
    basket.addWithQuantity(product, Number(inputQty));
    return true;
  }
}

/**
 * Display product page based on product corresponding URL
 * 1. get id from product URL page
 * 2. fetch product data using URL page id, specifically
 * 3. display product based on fetched specific data
 * 4. listen to 'addToCart' click event and manage
 */
async function renderProductPage() {
  // get product corresponding URL exple:'?id=034707184e8e4eefb46400b5a3774b5f'
  const queryString = window.location.search;
  // extract product id '034707184e8e4eefb46400b5a3774b5f'
  const urlId = new URLSearchParams(queryString).get("id");

  // fetch product data via its URL
  const dataProduct = await fetchProductById(urlId);

  // update page title and display product
  document.title = dataProduct.name;
  displayProductDetail(dataProduct);

  //instance basket object
  let basket = new Basket;

  // listen to btn 'addToCart' and manage cart
  // button "addToCart" defined in product.html line 81
  const addBtn = document.getElementById("addToCart");
  addBtn.addEventListener("click", (event) => {
      event.preventDefault();
      let productAddedOk = addProductToCart(dataProduct, basket);
      if (productAddedOk) {window.location.href="index.html"};
    }
  );
}

/********************* Execute *************************/
renderProductPage();
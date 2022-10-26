/*******************************************************/
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


async function fetchProductById(urlId) {
/* Get product id from the product URL */
    try {
        // Product URL
        const url = `http://localhost:3000/api/products/${urlId}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(`Erreur : ` + err);
        alert (`Erreur       : ${err}`);
        return null;
    }
}


function displayProductDetail(product) {
/* Display details for a single Product, including choice of colors
    input: a given product
    where : in product.html
    output: display a product detail + colors choice
    */

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


function AddProductToCart(data) {
/* Create a new product or add quantity to an existing product id
    - verify that a quantity (>0) and a color have been selected
    - create a product with a unique product id = product._id + color
    - add this object to basket with listened quantity
*/

    const inputColor = document.getElementById("colors").value;
    const inputQty = document.getElementById("quantity").value;

    // verify that a quantity (>0) and a color have been selected
    if (inputColor == "" || inputQty <= 0) {
        if (inputColor == "") { alert("Veuillez choisir une couleur svp")}
        if (inputQty <= 0) {alert("Veuillez choisir la quantité désirée svp")}
        return;

    } else{
        // create product object with unique id
        let product = {
            id : data._id + '-' + inputColor,
            productId: data._id,
            productColor: inputColor,
            quantity: Number(inputQty)
        };
        //instance basket object
        let basket = new Basket;
        basket.addWithQuantity(product, Number(inputQty))
    }
}

async function renderProductPage() {
/* Display product page based on product corresponding URL
    1. get id from product URL page
    2. fetch product data using URL page id
    3. display product based on fetched Data
    4. listen to 'addToCart' click event and manage 
*/
    // 1. get product corresponding URL exple:'?id=034707184e8e4eefb46400b5a3774b5f'  
    const queryString = window.location.search;
    // extract product id '034707184e8e4eefb46400b5a3774b5f'
    const urlId = new URLSearchParams(queryString).get("id");

    // 2.fetch product data via its URL
    const data = await fetchProductById(urlId);

    // 3. update page title and display product
    document.title = data.name;
    displayProductDetail(data);

    // 4. listen to btn 'addToCart' and manage cart
    // button "addToCart" defined in product.html line 81
    const addBtn = document.getElementById("addToCart");
    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        AddProductToCart(data);
    });
}


/********************* Execute *************************/
renderProductPage();
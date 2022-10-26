function saveBasket (basket) {
    /* localstorage does not work with complex type such as array :need to stringify */
    localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket() {
    /* if basket is empty return an empty array, parse the basket content otherwise */
    let basket = localStorage.getItem("basket");
    if (basket == null) {
        return [];
    } else {
        return JSON.parse(basket);
    }
}

function addBasket(product) {
    /* check if the product id is in the basket, if so modifies the quantity, 
    otherwise initialise new product quantity to 1 */
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity++;
    } else {
        product.quantity = 1;
        basket.push(product)
    }
    saveBasket(basket);
}

function removeFromBasket (product) {
    /* filter basket by id to keep all id except the one to remove */
    let basket = getBasket();
    basket = basket.filter (p => p.id != product.id);
    saveBasket(basket);
}

function changeQuantity (product, quantity) {
    /* change product.quantity by add a +/- quantity
    if product.quantity <=0 the product is removed */
    let basket = getBasket();
    let foundProduct = basket.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <=0){
            removeFromBasket(foundProduct);
        } else {
            saveBasket(basket);
        }
    }
}

function getNumberOfProducts() {
    /* compute the number of products in the basket */
    let basket = getBasket();
    let number = 0;
    for (let product of basket) {
        number += product.quantity;
    }
    return number;
}

function getTotalPrice() {
    /* compute the basket total price = sum_for_all_products_of (qty x price) */
    let basket = getBasket();
    let total = 0;
    for (let product of basket) {
        total += product.quantity * product.price;
    }
    return total;
}

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
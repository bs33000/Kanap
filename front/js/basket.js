/*******************************************************/
/************** oriented object Basket ****************/
/************* let basket = new Basket() ***************/
/*******************************************************/
export class Basket{

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
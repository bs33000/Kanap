/* API 
url: http://localhost:3000/api/products
Data format
 {
    "colors": ["Blue", "White", "Black"],
    "_id": "107fb5b75607497b96722bda5b504926",
    "name": "Kanap Sinopé",
    "price": 1849,
    "imageUrl": "kanap01.jpeg",
    "description": "Excepteur sint occaecat cupidatat non proident,
    sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "altTxt": "Photo d'un canapé bleu, deux places"
  }
*/


function displayProducts(data) {
/* Display all products available as stipulated in index.html -> #items
      input: data from the API
      where : #items in index.html
      output: display products
*/

  for (product of data) {
    const item__Card = document.getElementById('items');
      item__Card.innerHTML +=
      `
        <a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
        </a>
    `
  }
}


/* fetch products from API and display */
fetch('http://localhost:3000/api/products')
  /* promise 1: get and interpret json promise */
  .then (res => res.json())
  /* promise 2: display all products using above function*/
  .then (data => {displayProducts(data)})
  /* manage API error */
  .catch (_error => {alert(`Erreur : ${_error}  - veuillez consulter le fichier READ.me.`)});
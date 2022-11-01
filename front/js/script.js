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


/**
 * fetch all products from API - method is GET
 * @returns Object|null list of all API products
 */
async function fetchAllProducts() {
    try {
        const url = `http://localhost:3000/api/products`;
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (err) {
        alert (`Erreur       : ${err}  \n- veuillez consulter le fichier README.md -`);
        return null;
    }
}

/**
* Display all products available as stipulated in index.html -> #items
* @var Object product API data
* @returns void
*/
function displayProducts(product) {
    // create in DOM the required format for displaying the product card
    const a = document.createElement("a");
    const article = document.createElement("article");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const urlProduct = './product.html?id=';

    // add class names to the newly created DOM elements
    article.classList.add("card__article");
    a.classList.add("card");
    h3.classList.add("productName");
    p.classList.add("productDescription");

    // Append DOM strucutre with the newly created DOM elements
    document.getElementById("items").appendChild(a);
    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);

    // assign product API info to the newly created DOM elements
    a.href = urlProduct + product._id;
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    h3.textContent = product.name;
    p.textContent = product.description;
}

/**
* Get data from API and display each product
* @returns void
*/
async function renderPage() {
    const data = await fetchAllProducts();
    data.forEach(function (product) {
        displayProducts(product);
    });
}

/********************* Execute *************************/
renderPage();
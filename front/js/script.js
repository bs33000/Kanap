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


/* const fetchAllProducts = async () => { */
async function fetchAllProducts() {
    /* fetch all products from API
    */
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

function displayProducts(product) {
    /* Display all products available as stipulated in index.html -> #items
    input: data from the API
    where : #items in index.html
    output: display products
    */

    // create in DOM the required format for displaying the product card
    const a = document.createElement("a");
    const article = document.createElement("article");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const urlProduct = `./product.html?id=`;

    // add class names to the newly created DOM elements
    article.classList.add("card__article");
    a.classList.add("card");
    h3.classList.add("productName");
    p.classList.add("productDescription");

    // assign product API info to the newly created DOM elements
    a.href = urlProduct + product._id;
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    h3.textContent = product.name;
    p.textContent = product.description;

    // Append DOM strucutre with the newly created DOM elements
    document.getElementById("items").appendChild(a);
    a.appendChild(article);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(p);
}


async function renderPage() {
/* Get data from API and display each product
*/

    const data = await fetchAllProducts();
    data.forEach(function (product) {
        displayProducts(product);
        console.log(product);
    });
}

/********************* Execute *************************/
renderPage();
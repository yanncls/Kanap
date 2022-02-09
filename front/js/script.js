window.addEventListener('DOMContentLoaded', (event) => {
    main();
});



async function main() {
    // 
    const articles = await getArticles()
    for (let article of articles)
        displayArticles(article)
}


function getArticles() {
    // récupérer les produits dans api
    return fetch('http://localhost:3000/api/products/')
        .then(function (res) {
            return res.json()
        })
        .catch(function (err) {
            console.error(err)
        })
}

function displayArticles(article) {
    // affichage des articles
    document.getElementById('items')
        .insertAdjacentHTML('afterbegin', `
    <a href="product.html?_id=${article._id}">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTxt}">
      <h3 class="productName">${article.name}</h3>
      <p class="productDescription">${article.description}</p>
    </article>
    </a>
    `)
}



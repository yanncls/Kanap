window.addEventListener('DOMContentLoaded', (event) => {
    main();
});

async function main() {
    // id du produit
    const productId = getProductId()
    // le produit suite à l'id
    const product = await getProduct(productId)
    console.log(product)
    showProduct(product)
}

function getProductId() {
    // récupérer l'id du produit dans l'url
    return new URL(location.href).searchParams.get('_id')
}

function getProduct(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function (res) {
            return res.json()
        })
        .catch(function (err) {
            console.error(err)
        })
}

function showProduct(product) {
    document.getElementById('title').textContent = product.name;
    document.getElementById('price').textContent = product.price;
    document.getElementById('description').textContent = product.description;
    // document.querySelector('.item__img').appendChild(document.createElement('img'));
    // document.querySelector('.item__img img').src = product.imageUrl;
    // document.querySelector('.item__img img').alt = product.altTxt;
    document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    const colors = document.querySelector('#colors');
    for (let color of product.colors) {
        colors.innerHTML += `<option value="${color}">${color}</option>`
    };
}
// const { json } = require("express/lib/response");

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});

async function main() {
    // id du produit
    const productId = getProductId()
    // le produit suite à l'id
    const product = await getProduct(productId)
    showProduct(product)
    // saveCart(productId)
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

// Afficher les propriétés produit
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



/* Réaliser un panier au clic du bouton et le stocket dans le storage value
ECOUTER evenement au clic
    RECUPERER les valeurs choisis lors du clic
        METTRE ces valeurs dans un tableau
        VERIFIER SI tableau existant
                SI Tableau existant
                    AJOUTER le tableau au tableau existant
                SINON
                    Créer un nouveau tableau vide et stocker les valeurs
        CONVERTIR tableau en local storage
    RETOURNER tableau
*/


// event listner btn
const postCartBtn = document.getElementById('addToCart');
postCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const color = document.querySelector('#colors').value;
    const quantity = document.querySelector('#quantity').value;
    const idItem = new URL(location.href).searchParams.get('_id');
    // condition à valider pour envoyer au panier 
    if (quantity >= 1 && color) {
        let product = { color, quantity, idItem };
        addBasket(product);
        console.log("le panier est enregistré")
    }
});
// sauvegarder panier localstorage
function saveBasket(basket) {
    console.log("le panier est sauvegardé")
    localStorage.setItem("basket", JSON.stringify(basket));
}
// récupérer un panier ou créer
function getBasket() {
    let basket = localStorage.getItem("basket");
    if (basket == null) {
        console.log("oups le panier est encore vide")
        localStorage.clear()
        return [];
    } else {
        console.log("panier existant retour json parse")
        localStorage.clear();
        return JSON.parse(basket);
    }
}
// ajouter un panier
function addBasket(product) {
    let basket = getBasket();
    let foundProduct = basket.findIndex(p => p.color == product.color && p.idItem == product.idItem)
    console.log(foundProduct)
    if (!(foundProduct + 1)) {
        basket.push(product)
    } else {
        let exsitingProduct = basket[foundProduct];
        product.quantity = parseInt(product.quantity) + parseInt(exsitingProduct.quantity);
        basket.splice(foundProduct, 1, product)
    }
    saveBasket(basket);
}

// let col = document.querySelector('#colors').value
// console.log(col)
// let qty = document.querySelector('#quantity').value
// console.log(qty)
// function basketIsValid(col, qty) {
//     if (col != undefined && qty >= 1) {
//         return true
//     } else {
//         return false
//     }
// }

























// // event listner btn
// const postCartBtn = document.getElementById('addToCart');
// postCartBtn.addEventListener('click', (e) => {
//     e.preventDefault();

//     // récupérer produit panier
//     var myCart = [];
//     const color = document.querySelector('#colors').value;
//     const quantity = document.querySelector('#quantity').value;
//     const idItem = new URL(location.href).searchParams.get('_id');
//     myCart.push



//     // stocker le produit panier dans tableau   
//     let localStorageValues = JSON.parse(localStorage.getItem('monPanier'));
//     // var monPanier = [{
//     //     color: color,
//     //     quantity: quantity,
//     //     idItem: idItem
//     // }];
//     // var newPanier = [{
//     //     color: color,
//     //     quantity: quantity,
//     //     idItem: idItem
//     // }];
//     if (localStorageValues == null) {
//         monPanier.push({ color: color }, { quantity: quantity }, { idItem: idItem })
//         localStorage.setItem("monPanier", JSON.stringify(monPanier));
//     } else if (localStorageValues != null) {
//         for (i = 0; i < newPanier.length; i++) {
//             newPanier.push({ color: color }, { quantity: quantity }, { idItem: idItem })
//             localStorage.getItem("monPanier", JSON.stringify(newPanier));
//         }
//         console.log(newPanier)
//         // localStorage.setItem("monPanier", JSON.stringify(monPanier));

//     }
// });



// ecoute le bouton au clic


// var postCartBtn = document.getElementById('addToCart');
// var myTab = [];
// postCartBtn.addEventListener('click', () => {

//     // Mettre les valeurs dans un tableau

//     // Si mon tableau est vide alors
//     if (myTab != null) {
//         for (var i = 0; i < myTab.length; i++) {
//             var newCart = myTab[i];
//             console.log(newCart)
//             var myTab = myTab.push(newCart);
//             console.log(myTab)
//         }
//     } else {
//         const color = document.querySelector('#colors').value;
//         const quantity = document.querySelector('#quantity').value;
//         const idItem = new URL(location.href).searchParams.get('_id');
//         myTab = Object.assign(color, quantity, idItem)
//         console.log(myTab)
//     }
// })



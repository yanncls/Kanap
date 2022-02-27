/*      
AFFICHER LE PANIER AU CLIENT
 
RECUPERER le panier du localstorage JSON.parse
ITTERER sur le tableau pour lire les keys/values
RECUPERER chaque keys/values du tableau 
CREER appendchild element pour afficher les caracteritiques du panier
AFFECTER chaque value selon sa key à son élément html
    SI plusieurs éléments identiques (id + color), n'afficher qu'une seule ligne
    RECUPERER le prix et la description de l'id affiché 
*/

// RECUPERER le panier du localstorage + JSON.parse
let basket = localStorage.getItem("basket");
basket = JSON.parse(basket);

// Affichage du panier et calcul quantité et prix 
async function sumBasket(basket) {
  let totalPrice = 0
  let totalQuantity = 0
  for (const panier of basket) {
    const res = await fetch(`http://localhost:3000/api/products/${panier.idItem}`)
    const objets = await res.json()
    document.querySelector('#cart__items').innerHTML += `
      <article class="cart__item" data-id="${panier.idItem}" data-color="${panier.color}">
        <div class="cart__item__img">
          <img src="${objets.imageUrl}" alt="${objets.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${objets.name}</h2>
            <p>${panier.color}</p>
            <p>${objets.price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    const quantite = parseInt(panier.quantity); //nombre x2
    const price = parseInt(objets.price); //prix x1999
    totalPrice += (quantite * price);
    totalQuantity += quantite;
  }
  document.getElementById("totalPrice").innerHTML = totalPrice
  document.querySelector('#totalQuantity').innerHTML = totalQuantity;
}
sumBasket(basket).then(() => {
  addQtyListeners()
  removeListeners()
})

// Mettre à jour panier
function updateQuantity(quantity, id, color) {
  const productIndex = basket.findIndex(elem => elem.idItem == id && elem.color == color)
  const product = {
    ...basket[productIndex],
    quantity
  }
  basket.splice(productIndex, 1, product)
  localStorage.setItem("basket", JSON.stringify(basket))

  location.reload()
  // Si possible modifie les quantités sans recharger
}

// Supprimer article localstorage
function removeItem(id, color) {
  const productIndex = basket.findIndex(elem => elem.idItem == id && elem.color == color)
  basket.splice(productIndex, 1)
  localStorage.setItem("basket", JSON.stringify(basket))

  location.reload()
}

// effacer l'article selectionné
function removeListeners() {
  document.querySelectorAll('.deleteItem').forEach(e => {
    const id = e.closest('article').dataset.id
    const color = e.closest('article').dataset.color
    e.addEventListener('click', event => {
      console.log('clicked')
      removeItem(event.target, id, color)
    })
  })
}

// modifier quantité à l'article selectionné 
function addQtyListeners() {
  document.querySelectorAll(".itemQuantity").forEach(qtyInput => {
    const id = qtyInput.closest('article').dataset.id
    const color = qtyInput.closest('article').dataset.color
    qtyInput.addEventListener("change", event => {
      updateQuantity(event.target.value, id, color)
    })
  })
}

// cibler le formulaire
let form = document.querySelector('.cart__order__form');

// créer tableau form
let formTab = [];

// ecouter la modification du prénom
form.firstName.addEventListener('change', function () {
  validFirstName(this)
});

// ecouter la modification du nom
form.lastName.addEventListener('change', function () {
  validLastName(this)
});

// ecouter la modification du champ adresse
form.address.addEventListener('change', function () {
  validAddress(this)
});

// validation First Name
const validFirstName = function (inputFirstName) {
  let firstNameRegExp = new RegExp(
    /^[a-zA-Z ,'-]+$/g
  );
  // test de l'expression reguliere
  let testName = firstNameRegExp.test(inputFirstName.value);

  // récupére la balise p
  let p = document.querySelector('#firstNameErrorMsg');

  if (!testName) {
    p.innerHTML = "Le prénom n'est pas valide"
  }
  else {
    p.innerHTML = ""
    inputFirstName.value.push(formTab)

  }
};
console.log(formTab)
// validation Last Name
const validLastName = function (inputLastName) {
  let lastNameRegExp = new RegExp(
    /^[a-zA-Z ,'-]+$/g
  );
  // test de l'expression reguliere
  let testName = lastNameRegExp.test(inputLastName.value);

  // récupére la balise p
  let p = document.querySelector('#lastNameErrorMsg');

  if (!testName) {
    p.innerHTML = "Le nom n'est pas valide";
  }
  else {
    p.innerHTML = "";
  }
};

const validAddress = function (inputAdress) {
  let adressRegExp = new RegExp(
    /^[a-zA-Z0-9, '-]+$/
  );

  let testAdress = adressRegExp.test(inputAdress.value);

  let p = document.querySelector('#addressErrorMsg');

  if (!testAdress) {
    p.innerHTML = "L'adresse n'est pas valide";
  }
  else {
    p.innerHTML = "";
  }
}








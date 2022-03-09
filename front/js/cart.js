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

let contact = localStorage.getItem('contact');
contact = JSON.parse(contact);

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

// Mettre à jour quantité panier
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

// selection de l'article à modifier  
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

// ecouter la modification du prénom
form.firstName.addEventListener('change', function () {
  validInput(this.value, "firstName")
});

// ecouter la modification du nom
form.lastName.addEventListener('change', function () {
  validInput(this.value, "lastName")
  // validLastName(this)
});

// ecouter la modification du champ adresse
form.address.addEventListener('change', function () {
  validInput(this.value, "address")
  // validAddress(this)
});

// ecouter la modification du champ ville
form.city.addEventListener('change', function () {
  validInput(this.value, "city")
});

// ecouter la modification du champ ville
form.email.addEventListener('change', function () {
  validInput(this.value, "email")
});


// isoler les variables dans un tab
const validationFuncs = {
  firstName: {
    regex: /^[a-zA-Z ,'-]+$/g,
    errorMsgId: "#firstNameErrorMsg",
    errorMsg: "Le prénom n'est pas valide"
  },
  lastName: {
    regex: /^[a-zA-Z ,'-]+$/g,
    errorMsgId: "#lastNameErrorMsg",
    errorMsg: "Le nom n'est pas valide"
  },
  address: {
    regex: /\d+(\s\w*)*/g,
    errorMsgId: "#addressErrorMsg",
    errorMsg: "L'adresse n'est pas valide"
  },
  city: {
    regex: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/g,
    errorMsgId: "#cityErrorMsg",
    errorMsg: "La ville n'est pas valide'"
  },
  email: {
    regex: /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    errorMsgId: "#emailErrorMsg",
    errorMsg: "L'adresse mail n'est pas valide"
  }
}

const validInput = function (value, funcName) {
  const { regex, errorMsgId, errorMsg } = validationFuncs[funcName];
  let inputRegex = new RegExp(regex);
  // test de l'expression reguliere
  let test = inputRegex.test(value);
  // récupére la balise p
  let p = document.querySelector(errorMsgId);

  if (!test) {
    p.innerHTML = errorMsg;
    return false;
  }
  else {
    p.innerHTML = "";
    return true;
  }
}

// récupérer les données submit
const postForm = document.querySelector('input#order');
postForm.addEventListener('click', (e) => {
  e.preventDefault();
  const firstName = document.querySelector('#firstName').value;
  const lastName = document.querySelector('#lastName').value;
  const address = document.querySelector('#address').value;
  const city = document.querySelector('#city').value;
  const email = document.querySelector('#email').value;
  // condition à valider avant l'envoi
  if (validInput(firstName, "firstName") &&
    validInput(lastName, "lastName") &&
    validInput(address, "address") &&
    validInput(city, "city") &&
    validInput(email, "email")
  ) {
    // création des items attendu par l'api puis envoie
    let contact = { firstName, lastName, address, city, email };
    let products = basket.map(elem => elem.idItem)
    send(contact, products);
  }
  return
})


// POST form to API
function send(contact, products) {
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contact, products
    })
  })
    // traitement de la reponse api
    .then(function (res) {
      res.json().then(data => {
        console.log(data)
        console.log("orderId", data.orderId)
        //isoler le string orderId
        // let id = data[Object.keys(data)[Object.keys(data).length - 1]]
        // passer l'id dans l'url
        // console.log(id)
        localStorage.removeItem("basket");
        window.location.href = `confirmation.html?orderId=${data.orderId}`
      })
    })
}







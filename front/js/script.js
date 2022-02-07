// const apiUrl = fetch('http://localhost:3000/api/products/');
// // http request api


// // créer les balises
// // let section = document.getElementById('items');
// // let kanap = document.createElement('a');
// // let article = document.createElement('article');
// // let image = document.createElement('img');
// // let h3 = document.createElement('h3');
// // h3.classList.add('productName');
// // let p = document.createElement('p');
// // p.classList.add('productDescription');

// // section.appendChild(kanap)
// // kanap.appendChild(article);
// // article.appendChild(image);
// // article.appendChild(h3);
// // article.appendChild(p);

// apiUrl.then(async (responseData) => {
//     // console.log(responseData);

//     const response = await responseData.json();
//     console.log(response[0]);

//     try {



//         const _id = response[0]._id;
//         console.log(_id);
//         const name = response[0].name;
//         console.log(name);
//         const price = response[0].price;
//         console.log(price);
//         const imageUrl = response[0].imageUrl;
//         console.log(imageUrl);
//         const description = response[0].description;
//         console.log(description);
//         const altTxt = response[0].altTxt;
//         console.log(altTxt);

//         // const show__description = document.querySelector('#productDescription');
//         // show__description.innerHTML = description;

//         const image1_imageUrl = `<img src="${imageUrl}">`;
//         const show_image = document.querySelector('#img');


//         show_image.insertAdjacentElement('afterbegin', image1_imageUrl)



//     } catch (err) {
//         console.log(err);
//     }
// })
//     .catch((err) => {
//         console.log(err);
//     });








// associer les balises


// const askProducts = async () => {
//     try {
//         const res = await fetch(url)
//         const data = await res.json();
//         console.log(data)
//     } catch (e) {
//         console.log("oops error", e)
//     }
// }

// askProducts();



main()

async function main() {
    const articles = await getArticles()
    for (let article of articles)
        displayArticles(article)
}

function getArticles() {
    return fetch('http://localhost:3000/api/products/')
        .then(function (res) {
            return res.json()
        })
        .then(function (articles) {
            return articles
        })
        .catch(function (err) {
            console.log(err)
        })
}

function displayArticles(article) {
    document.getElementById('items').innerHTML += `
    <a href="#">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTxt}">
      <h3 class="productName">${article.name}</h3>
      <p class="productDescription">${article.description}</p>
    </article>
    </a>
    `
}



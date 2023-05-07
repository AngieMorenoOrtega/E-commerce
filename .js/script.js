const URL_PRODUCTS = 'http://localhost:3000/productos/';
const URL_FAVORITOS = "http://localhost:3000/favoritos/";
const URL_CARRITO="http://localhost:3000/carrito/";


const searchButton = document.querySelector(".header__button");
let arrayProducts = [];
let productInfo = {};

async function createCards(filteredArray = []) {
  const container = document.querySelector("#productos-container");
  container.innerHTML = "";

  let productsToUse = filteredArray.length ? filteredArray : arrayProducts;

  const containerCards = document.getElementById("productos-container");


  for (const tarjeta of productsToUse) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const categoryElement = document.createElement("p");
    categoryElement.textContent = tarjeta.categoria;
    const imageElement = document.createElement("img");
    imageElement.src = tarjeta.imagen;
    imageElement.alt = tarjeta.nombre;

    const titleElement = document.createElement("h3");
    titleElement.classList = ("bolder")
    titleElement.textContent = tarjeta.nombre;

    const infoElement = document.createElement("p");
    infoElement.textContent = ` ${tarjeta.peso}g `;
    const infoElement1 = document.createElement("p");
    infoElement1.textContent = `$${tarjeta.precio}`;
    infoElement1.classList.add("precio");

    const favButton = document.createElement("button");
    favButton.dataset.id=`${tarjeta.id}`
    favButton.classList.add("button-favoritos");
    favButton.setAttribute("type", "button");
    const detailsButton = document.createElement("button");
    detailsButton.classList.add("button-detalles");

    cardElement.appendChild(imageElement);
    cardElement.appendChild(categoryElement);
    cardElement.appendChild(titleElement);
    cardElement.appendChild(infoElement1)
    cardElement.appendChild(infoElement);
    cardElement.appendChild(favButton)
    cardElement.appendChild(detailsButton)
    containerCards.appendChild(cardElement);

    const button = document.createElement("button");
    button.classList.add("counter-value");
    button.textContent = "Add";
    button.dataset.id=`${tarjeta.id}`
    button.addEventListener('click', (event) => {
      const productIdParaCarrito = event.target.dataset.id;
      console.log(productIdParaCarrito);

agregarAlCarrito(productIdParaCarrito);
 crearElementosCarrito(productIdParaCarrito)
    });
  

    const minus = document.createElement("button");
    minus.classList.add("minus-button");
    minus.textContent = `-`

    const plus = document.createElement("button");
    plus.textContent = `+`
    plus.classList.add("plus-button");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

   const timerContainer = document.createElement("div");
    timerContainer.classList.add("counter-container");
    buttonContainer.appendChild(timerContainer);
    timerContainer.appendChild(minus);
    timerContainer.appendChild(button);
    timerContainer.appendChild(plus);
    cardElement.appendChild(buttonContainer);
   
  }
}

let localStorageCart =  [];
console.log(localStorageCart);
function crearElementosCarrito(productIdParaCarrito, arrayProducts) {
  const product = arrayProducts.find((product) => product.id === productIdParaCarrito);
  localStorageCart.push(product);
  console.log(product);
  return localStorageCart.forEach(item=> {
    const divPrincipal=document.createElement("div")
    const listaCarrito = document.createElement('ul');
    const imagen = document.createElement('img');
    imagen.src = `${item.imagen}`;
    const nameItem = document.createElement('li');
    nameItem.textContent = `${item.nombre} x ${item.cantidad}`;
    listaCarrito.appendChild(nameItem);
    const priceItem = document.createElement('li');
    priceItem.textContent = ` 1 x ${item.precio}`;
    listaCarrito.appendChild(priceItem);
    const divImagen = document.createElement('div');
    const divDatos = document.createElement('div');
    divImagen.appendChild(imagen);
    divDatos.appendChild(listaCarrito);
    const boton=document.createElement("button");
    boton.textContent= "checkout";
    divPrincipal.appendChild(boton)
    divPrincipal.appendChild(divDatos)
    divPrincipal.appendChild(divImagen)
  
    boton.addEventListener('click', () => {
      window.location.href = "../../pages/carrito.html"
    })
       return [divPrincipal];
  });

}
function buscarBotones() {
  const minusButton = cardElement.querySelector(".minus-button");
  const plusButton = cardElement.querySelector(".plus-button");
  const counterValue = cardElement.querySelector(".counter-value");
  let count = 0;

  minusButton.addEventListener("click", () => {
    if (count > 0) {
      count--;
      counterValue.textContent = count;
    }
  });
  plusButton.addEventListener("click", () => {
    count++;
    counterValue.textContent = count;
  });
}
async function obtenerProductos() {
  try {
    const response = await fetch(URL_PRODUCTS);
    const data = await response.json();
    arrayProducts = data;
    console.log('Lista de productos:', arrayProducts);
    createCards(arrayProducts);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
  }
}



async function agregarEventListenerFavoritos() {
  try {
    const favButton = document.querySelectorAll('.button-favoritos');
    favButton.forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const productId = event.target.dataset.id;
        const agregado = await verificarProductoEnFavoritos(productId);
        cambiarEstadoFavorito(button, agregado);

        if (agregado) {
          await eliminarDeFavoritos(productId);
        } else {
          const product = arrayProducts.find((product) => product.id == productId);
          await agregarAFavoritos(product);
        }
      });
    });
  } catch (error) {
    console.error('Error al agregar el evento de clic a los botones de favoritos:', error);
  }
}

async function verificarProductoEnFavoritos(productId) {
  try {
    const response = await fetch(URL_FAVORITOS);
    const data = await response.json();
    const productExists = data.find((p) => p.id == productId);
    return !!productExists;
  } catch (error) {
    console.error('Error al obtener la lista de favoritos:', error);
    return false;
  }
}

async function agregarAFavoritos(product) {
  try {
    await fetch(URL_FAVORITOS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    console.log('Producto agregado a favoritos');
  } catch (error) {
    console.error('Error al agregar el producto a favoritos:', error);
  }
}



async function init() {
  await obtenerProductos();
  createCards();
  agregarEventListenerFavoritos();verificarProductoEnFavoritos()
}
init();

function printCategories() {
  const container = document.querySelector(".categories")
  container.innerHTML = "";

  container.innerHTML += `
    <h1 id="category">Category</h1>
    <ul class="categories-container daily-needs" >
        <li>
            <img src="imagenes/svgtopng/vegetable.png" alt="Vegetables & Fruit" class="filter-category">
            <span class="filter-category">Vegetables & Fruit</span>
        </li>
        <li>
            <img src="imagenes/svgtopng/cup.png" alt="Beverages"data-category="Bebidas" class="filter-category">
            <span class="filter-category" data-category="Bebidas">Beverages </span>
        </li>
        <li>
            <img src="imagenes/svgtopng/meats.png" alt="Meats & Seafood" data-category="Carnes" class="filter-category">
            <span class="filter-category"data-category="Carnes">Meats & Seafood</span>
        </li>
        <li>
            <img src="imagenes/svgtopng/breakfast.png" alt="Breakfast & Dairy" data-category="Básicos" class="filter-category">
            <span class="filter-category" data-category="Básicos"  >Breakfast & Dairy  </span>
        </li>
        <li>
            <img src="imagenes/svgtopng/frozen.png" alt="Frozen Foods" class="filter-category">
            <span class="filter-category">Frozen Foods</span>
        </li>
        <li>
            <img data-category="Golosinas" src="imagenes/svgtopng/biscuit.png" alt="Biscuits & Snacks" class="filter-category">
            <span data-category="Golosinas" class="filter-category">Biscuits & Snacks</span>
        </li>
        <li>
            <img src="imagenes/svgtopng/grocery.png" alt="Grocery & Staples" class="filter-category">
            <span  class="filter-category">Grocery & Staples</span>
        </li>
        <li>
            <img src="imagenes/svgtopng/drink.png" alt="Wines & Alcohol Drinks" class="filter-category">
            <span  class="filter-category">Wines & Alcohol Drinks</span>
        </li>
    </ul>`}



console.log(printCategories);
document.addEventListener("DOMContentLoaded", () => {
  printCategories()
});

const userContainer = document.getElementById("header__list");
const URL_ADMIN = "http://localhost:3000/admin";

const obtenerUsuarios = async () => {

  try {
    const response = await fetch(URL_ADMIN);
    const data = await response.json();
    console.log("Lista de usuarios:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener la lista de usuarios:", error);
    return [];
  }
};
const validacion = async () => {
  let usuarioValido = null;
  let intentos = 3;
  const usuarios = await obtenerUsuarios();
  while (intentos > 0 && !usuarioValido) {
    const nombreUsuario = prompt("Digite su usuario:");
    if (nombreUsuario === null) {
      break;
    }
    const contrasena = prompt("Digite su contraseña:");
    if (contrasena === null) {
      break;
    }
    usuarioValido = usuarios.find((usuario) => {
      return usuario.user === nombreUsuario && usuario.password === contrasena;
    });
    if (!usuarioValido) {
      intentos--;
      alert(`Nombre de usuario o contraseña incorrecta. Le quedan ${intentos} intentos.`);
    }
  }
  if (!usuarioValido) {
    throw new Error("Validación fallida");
  }
  return usuarioValido;
};

const submitLoginPage = async (event) => {
  event.preventDefault();
  const usuarios = await obtenerUsuarios();
  try {
    const usuarioValido = await validacion(usuarios);
    console.log("Usuario válido:", usuarioValido);
    location.replace('../pages/panelAdmin.html');
  } catch (error) {
    console.error("Error de validación:", error);
    // Mostrar un mensaje de error al usuario
  }
};
userContainer.addEventListener("click", submitLoginPage);

let filteredArray = [];

document.addEventListener("click", async (event) => {
  event.preventDefault();
  
  function filterByCategory(category) {
    const filteredArray = arrayProducts.filter(item => item.categoria.includes(category));
    return filteredArray;
  } 
  
  if (event.target.classList.contains("filter-category")) {
    const filter = event.target.dataset.category;
    const filteredCategory = filterByCategory(filter);
    filteredArray = filteredCategory;
    console.log(filteredArray);
    await createCards(filteredArray);
    agregarEventListenerFavoritos(); 
  }
});


let corazon = document.getElementById("corazon")
console.log(corazon);
corazon.addEventListener("click", () => {
  window.location.href = "../pages/wishlist.html"
})

const popup = document.querySelector('.icono-carrito');
 const popupContainer=document.querySelector(".carrito")

async function agregarAlCarrito(productIdParaCarrito) {
  try {
    const product = arrayProducts.find((product) => product.id == productIdParaCarrito);
    await fetch(URL_CARRITO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    console.log('Producto agregado al carrito');

  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
  }
}

popup.addEventListener('mouseover', async () => {
  try { 
    popup.innerHTML = '';
    popup.style.display = 'block';
    crearElementosCarrito() 
     
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
  }
});

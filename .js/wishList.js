
const URL_FAVORITOS= "http://localhost:3000/favoritos";
const URL_PRODUCTS = 'http://localhost:3000/productos';

const inicio= document.getElementById("logo-fastkart")
inicio.addEventListener("click",function(){
    window.location.href="../index.html"
})

const container = document.querySelector(".main__cards");

async function obtenerFavoritos() {
  try {
    const response = await fetch(URL_FAVORITOS);
    const favoritos = await response.json();
    return favoritos;
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    return [];
  }
}

function pintarTarjetas(favoritos) {
  container.innerHTML = "";
  for (const tarjeta of favoritos) {
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
    cambiarEstadoFavorito(favButton, true);

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("button-detalles");

    // Agregar elementos a la tarjeta
    cardElement.appendChild(imageElement);
    cardElement.appendChild(categoryElement);
    cardElement.appendChild(titleElement);
    cardElement.appendChild(infoElement1)
    cardElement.appendChild(infoElement);
    cardElement.appendChild(favButton)
    cardElement.appendChild(detailsButton)

    // Agregar la tarjeta al contenedor
    container.appendChild(cardElement);

    // Crear botones
    const button = document.createElement("button");
    button.classList.add("counter-value");
    button.textContent = "Add";

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
    // buscarBotones(cardElement);
  }
  // agregarEventListenerFavoritos();
}

async function mostrarFavoritos() {
  const favoritos = await obtenerFavoritos();
  pintarTarjetas(favoritos);
}

async function toggleFavorito(productId) {
  try {
    const response = await fetch(URL_FAVORITOS);
    const favoritos = await response.json();
    const encontrado = favoritos.some((favorito) => favorito.id == productId);
    if (encontrado) {
      await fetch(`${URL_FAVORITOS}/${productId}`, {
        method: 'DELETE',
      });
      console.log('Producto eliminado de favoritos');
    } else {
      const product = arrayProducts.find((product) => product.id == productId);
      await fetch(URL_FAVORITOS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      console.log('Producto agregado a favoritos');
    }
  } catch (error) {
    console.error('Error al agregar o eliminar el producto de favoritos:', error);
  }
}

function cambiarEstadoFavorito(button, agregado) {
  if (agregado) {
    button.classList.add('activo');
  } else {
    button.classList.remove('activo');
  }
}

async function agregarEventListenerFavoritos() {
  try {
    const favButton = document.querySelectorAll('.button-favoritos');
    favButton.forEach((button) => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const productId = event.target.dataset.id;
        await toggleFavorito(productId);
        const agregado = await verificarProductoEnFavoritos(productId);
        cambiarEstadoFavorito(button, agregado);
      });
    });
  } catch (error) {
    console.error('Error al agregar el evento de clic a los botones de favoritos:', error);
  }
}

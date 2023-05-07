
const URL_CARRITO= "http://localhost:3000/carrito";
const URL_PRODUCTS = 'http://localhost:3000/productos';
let arrayProducts = [];

const containerAddProduct=document.getElementById("agregar")
const inicio=document.getElementById("logo-fastkart")

inicio.addEventListener("click",function(){
    window.location.href="../index.html"
})

async function obtenerProductos() {
  try {
    const response = await fetch(URL_PRODUCTS);
    const data = await response.json();
    arrayProducts = data;
    console.log('Lista de productos:', arrayProducts);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
  }
}

// Llamado a la función obtenerProductos() utilizando async/await
(async () => {
  await obtenerProductos();

  const containerCards= document.getElementById("productos-container")
  console.log(containerCards);
  
  arrayProducts.forEach(tarjeta => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
  
    const imageElement = document.createElement("img");
    imageElement.src = tarjeta.imagen;
    imageElement.alt = tarjeta.nombre;
  
    const titleElement = document.createElement("h3");
    titleElement.textContent = tarjeta.nombre;
  
    const infoElement = document.createElement("p");
    infoElement.textContent =  ` ${tarjeta.peso}g  $${tarjeta.precio}`;
    const addButton = document.createElement("button");
    addButton.textContent = "Editar";
    addButton.classList.add("button-agregar");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Borrar";
    deleteButton.classList.add("button-borrar");
  
    // Agregar elementos a la tarjeta
    cardElement.appendChild(imageElement);
    cardElement.appendChild(titleElement);
    cardElement.appendChild(infoElement);
    cardElement.appendChild(addButton)
    cardElement.appendChild(deleteButton)
  
    // Agregar la tarjeta al contenedor
   containerCards.appendChild(cardElement);
  });
  
  // Aquí puedes acceder a los datos en arrayProducts después de que la función haya finalizado
  console.log('Array de productos fuera de la función:', arrayProducts);
})();

        const URL_PRODUCTOS = "http://localhost:3000/productos";

        // Función para modificar un producto
        const modificarProducto = async (id, datos) => {
          try {
            const response = await fetch(`${URL_PRODUCTOS}/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datos),
            });
            const producto = await response.json();
            console.log("Producto modificado:", producto);
          } catch (error) {
            console.error("Error al modificar el producto:", error);
          }
        };
        
        const containerDeleteProduct=document.querySelector(".button-borrar")
deleteButton.setAttribute('data-id', tarjeta.id);
console.log(containerDeleteProduct);
  
        
//           const borrarProducto = async (id) => {
//             try {
//               const response = await fetch(`${URL_PRODUCTOS}/${id}`, {
//                 method: "DELETE",
//               });
//               const data = await response.json();
//               console.log("Producto eliminado:", data);
//             } catch (error) {
//               console.error("Error al eliminar el producto:", error);
//             }
//           };
//           containerDeleteProduct.addEventListener("click", (event) => {
//     const productId = event.target.parentNode.querySelector('img').getAttribute('data-id');
//     sessionStorage.setItem('productIdToDelete', productId);
//     console.log("Producto a borrar:", productId);
//     arrayProducts.splice(productId)
//     console.log(arrayProducts)
//   });
          
        
        const addProduct = async (productData) => {
            try {
              const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
              });
          
              if (!response.ok) {
                throw new Error('Error al agregar el producto');
              }
          
              const newProduct = await response.json();
              return newProduct;
            } catch (error) {
              console.error('Error al agregar el producto:', error);
            }
          };
          
          
          containerAddProduct.addEventListener('click', () => {
            const name = prompt('Ingrese el nombre del producto');
            const description = prompt('Ingrese la descripción del producto');
            const price = prompt('Ingrese el precio del producto');
            const image = prompt('Ingrese la URL de la imagen del producto');
            const currency = prompt('Ingrese la moneda en la que se expresa el precio');
            const stock = prompt('Ingrese la cantidad de unidades disponibles del producto');
          
            const newProductData = {
              name,
              description,
              price,
              image,
              currency,
              stock
            };
            arrayProducts.push(newProductData)
          console.log(arrayProducts)    
            addProduct(newProductData);
          });
          
          const carritoElement = document.getElementById("carrito");

          carritoElement.addEventListener("click", () => {
           const obtenerDatosCarrito = async () => {
            try {
              const response = await fetch(URL_CARRITO);
              const data = await response.json();
              return data;
              
            } catch (error) {
              console.error("Error al obtener los datos del carrito:", error);
            }
          };
          
          obtenerDatosCarrito().then((data) => {
            console.log("Datos del carrito:", data);
          }).catch((error) => {
            console.error("Error al obtener los datos del carrito:", error);
          });
            // código a ejecutar cuando se haga click en el elemento con ID "carrito"
          });
          
         
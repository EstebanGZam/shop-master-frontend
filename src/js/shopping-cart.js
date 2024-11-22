import { renderCart } from './cart-utils.js';
import { flushCarBtn } from './cart-utils.js';
import { list } from './cart-utils.js';
import { cartItems } from './cart-utils.js';
import { deleteFromCart } from './cart-utils.js';

document.addEventListener("DOMContentLoaded", () => {
    // Cargar los listeners de eventos
    loadEventListeners();
});

function loadEventListeners() {
    document.querySelector(".product-content").addEventListener("click", buyElement);
    flushCarBtn.addEventListener("click", flushCar);
    list.addEventListener("click", deleteFromCart);
    document.getElementById("purchase-btn").addEventListener("click", () => {
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    });
}



function buyElement(e) {
    e.preventDefault();
    if (e.target.classList.contains("add-car")) {
        const element = e.target.closest(".product");
        readDataElement(element);
        renderCart(); // Llamar a la función para renderizar el carrito
    }
}

async function readDataElement(element) {
    const infoElement = extractProductData(element); // Extraer datos del producto

    try {
        await addToCart(infoElement); // Llamar al backend para agregar el producto
        updateLocalCart(element, infoElement); // Actualizar el carrito localmente
        renderCart(); // Renderizar el carrito
    } catch (error) {
        handleCartError(error); // Manejar errores
    }
}

// Extrae los datos del producto desde el DOM
function extractProductData(element) {
    const productId = element.querySelector(".add-car").getAttribute("data-id");
    const quantity = 1; // Cantidad inicial
    return {
        productId: productId,
        quantity: quantity,
    };
}

// Realiza una solicitud al backend para agregar el producto al carrito
async function addToCart(infoElement) {
    const response = await fetch("http://localhost:8080/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${document.cookie.split("=")[1]}`,
        },
        body: JSON.stringify(infoElement),
    });

    if (!response.ok) {
        throw new Error("Error al agregar el producto al carrito");
    }

    const data = await response.json(); // Obtener la respuesta del servidor (opcional)
    console.log("Producto añadido al carrito:", data);
}

// Actualiza el carrito local en el cliente
function updateLocalCart(element, infoElement) {
    const existingItem = cartItems.find((item) => item.id === infoElement.productId);
    if (existingItem) {
        existingItem.quantity += infoElement.quantity; // Incrementar cantidad si ya está en el carrito
    } else {
        cartItems.push({
            image: element.querySelector(".image-container img").src,
            title: element.querySelector(".product-txt h3").textContent,
            price: parseFloat(
                element.querySelector(".product-txt p:nth-of-type(2)")
                    .textContent.replace("Precio: $", "").trim()
            ),
            id: infoElement.productId,
            quantity: infoElement.quantity,
        });
    }
}

// Maneja errores al agregar productos al carrito
function handleCartError(error) {
    console.error("Error:", error);
    alert("Hubo un problema al agregar el producto al carrito.");
}

function flushCar() {
    cartItems = [];
    renderCart();
}

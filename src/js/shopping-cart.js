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

function readDataElement(element) {
    const infoElement = {
        image: element.querySelector(".image-container img").src, // URL de la imagen
        title: element.querySelector(".product-txt h3").textContent, // Nombre del producto
        price: parseFloat(
            element.querySelector(".product-txt p:nth-of-type(2)")
                .textContent.replace("Precio: $", "").trim()
        ), // Precio del producto
        id: element.querySelector(".add-car").getAttribute("data-id"), // ID del producto
        quantity: 1, // Cantidad inicial
    };

    // Verificar si el producto ya existe en el carrito
    const existingItem = cartItems.find((item) => item.id === infoElement.id);
    if (existingItem) {
        existingItem.quantity += 1; // Incrementar la cantidad si ya está en el carrito
    } else {
        cartItems.push(infoElement); // Agregar nuevo producto al carrito
    }
}


function renderCart() {
    list.innerHTML = "";
    if (cartItems.length === 0) {
        const noItemsRow = document.createElement("tr");
        noItemsRow.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 20px;">
            No hay productos en el carrito.
        </td>
        `;
        list.appendChild(noItemsRow);
        purchaseBtn.style.display = "none";
        flushCarBtn.style.display = "none";
    } else {
        cartItems.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td><img src="${item.image}" width="100" /></td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td><a href="#" class="delete" data-id="${item.id}" data-index="${index}">X</a></td>
        `;
            list.appendChild(row);
        });
        purchaseBtn.style.display = "block";
        flushCarBtn.style.display = "block";
    }
}

function flushCar() {
    cartItems = [];
    renderCart();
}

function deleteFromCart(e) {
    if (e.target.classList.contains("delete")) {
        const index = e.target.getAttribute("data-index");
        cartItems.splice(index, 1);
        renderCart();
    }
}

const purchaseBtn = document.getElementById("purchase-btn");

// Variable global para almacenar los productos del carrito
export let cartItems = [];
export const flushCarBtn = document.getElementById("flush-car-shop");
export const list = document.querySelector("#shop-list tbody");

export {
    renderCart,
    deleteFromCart,
    flushCar,
}

async function renderCart() {
    list.innerHTML = "";

    try {
        // Solicitar datos del carrito al backend
        const response = await fetch("http://localhost:8080/cart", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${document.cookie.split("=")[1]}`, // Obtener el token de la cookie
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener el carrito del servidor.");
        }

        const cartData = await response.json();

        // Actualizar la variable global `cartItems`
        cartItems = cartData.products || [];

        console.log("Productos en el carrito:", cartItems);

        // Renderizar el carrito en la interfaz
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
            var total = 0;
            cartItems.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td><img src="${item.imageUrl}" width="100" /></td>
                <td>${item.productName}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.total.toFixed(2)}</td>
                <td><a href="#" class="delete" data-id="${item.productId}">X</a></td>
            `;
                list.appendChild(row);
                total += item.total;
            });
            purchaseBtn.style.display = "block";
            flushCarBtn.style.display = "block";

            const totalRow = document.createElement("tr");
            totalRow.innerHTML = `
                        <td colspan="6" style="text-align: center;">
                            <h3 style="margin: 0;">Total a pagar: $${total.toFixed(2)}</h3>
                        </td>
                        `;
            list.appendChild(totalRow);
        }
    } catch (error) {
        console.error("Error al renderizar el carrito:", error);
        const errorRow = document.createElement("tr");
        errorRow.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 20px; color: red;">
            Error al cargar el carrito. Inténtalo de nuevo más tarde.
        </td>
        `;
        list.appendChild(errorRow);
        purchaseBtn.style.display = "none";
        flushCarBtn.style.display = "none";
    }
}

async function deleteFromCart(e, renderCartFunction) {
    if (e.target.classList.contains("delete")) {
        const productId = e.target.getAttribute("data-id");
        console.log("Eliminar producto del carrito:", productId);

        try {
            // Llamar al backend para eliminar el producto del carrito
            const response = await fetch(`http://localhost:8080/cart/remove/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.split("=")[1]}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el producto del carrito.");
            }

            const updatedCart = await response.json(); // Respuesta actualizada del servidor
            console.log("Producto eliminado del carrito:", updatedCart);

            // Actualizar el contenido de `cartItems` en lugar de reasignarlo
            cartItems.splice(0, cartItems.length, ...updatedCart.products || []);

            sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

            // Renderizar el carrito usando la función pasada como parámetro
            renderCartFunction();
        } catch (error) {
            console.error("Error al eliminar producto del carrito:", error);
            alert("Hubo un problema al eliminar el producto del carrito.");
        }
    }
}


async function flushCar(e, renderCartFunction) {
    try {
        const response = await fetch("http://localhost:8080/cart/clear", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${document.cookie.split("=")[1]}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al vaciar el carrito");
        }

        // Actualiza los datos del carrito en el cliente
        sessionStorage.removeItem("cartItems");
        renderCartFunction(); // Renderiza el carrito vacío
        console.log("Carrito limpiado exitosamente");
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al limpiar el carrito.");
    }
}

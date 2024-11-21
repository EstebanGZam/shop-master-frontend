const purchaseBtn = document.getElementById("purchase-btn");

// Variable global para almacenar los productos del carrito
export let cartItems = [];
export const flushCarBtn = document.getElementById("flush-car-shop");
export const list = document.querySelector("#shop-list tbody");

export async function renderCart() {
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
            cartItems.forEach((item) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td><img src="https://via.placeholder.com/100" width="100" /></td>
                <td>${item.productName}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.total.toFixed(2)}</td>
                <td><a href="#" class="delete" data-id="${item.productId}">X</a></td>
            `;
                list.appendChild(row);
            });
            purchaseBtn.style.display = "block";
            flushCarBtn.style.display = "block";
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

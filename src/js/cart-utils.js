const purchaseBtn = document.getElementById("purchase-btn");

// Variable global para almacenar los productos del carrito
export let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
export const flushCarBtn = document.getElementById("flush-car-shop");
export const list = document.querySelector("#shop-list tbody");

export function renderCart() {
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

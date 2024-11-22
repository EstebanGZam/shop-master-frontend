document.addEventListener("DOMContentLoaded", () => {
  // console.log(cartItems);
  addEventListeners();
  loadCartItems();
  renderCartItems();
});

function addEventListeners() {
  document.getElementById("flush-car-shop").addEventListener("click", flushCar);
  document.getElementById("purchase-btn").addEventListener("click", openPaymentForm);
  document.querySelector(".close-payment").addEventListener("click", closePaymentForm);
  document.getElementById("confirm-payment").addEventListener("click", submitPayment);

  document.querySelector(".close").addEventListener("click", closePopup);

  document.querySelector("#shop-list-order tbody").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
      event.preventDefault();
      deleteFromCart(event);
    }
  });
}

function loadCartItems() {
  const storedCartItems = sessionStorage.getItem("cartItems");
  if (storedCartItems) {
    cartItems = JSON.parse(storedCartItems);
  }
}

function renderCartItems() {
  const cartTableBody = document.querySelector("#shop-list-order tbody");
  cartTableBody.innerHTML = "";

  cartItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img title="${item.productName}" src="${item.imageUrl}" width="100" /></td>
      <td>${item.productName}</td>
      <td>$${item.price}</td>
      <td>${item.quantity}</td>
      <td><a href="#" class="delete" data-id="${item.productId}">X</a></td>
    `;
    cartTableBody.appendChild(row);
  });
}

function flushCar() {
  cartItems = [];
  sessionStorage.removeItem("cartItems");
  renderCartItems();
}

function openPaymentForm() {
  if (cartItems.length === 0) {
    alert("No hay productos en el carrito para realizar la compra");
    return;
  }
  document.getElementById("payment-form-popup").style.display = "block";
}

function closePaymentForm() {
  document.getElementById("payment-form-popup").style.display = "none";
}

function submitPayment() {
  const paymentMethod = document.getElementById("payment-method").value;
  const cardNumber = document.getElementById("card-number").value;
  const cardholderName = document.getElementById("cardholder-name").value;
  const cardholderLastname = document.getElementById("cardholder-lastname").value;
  const securityCode = document.getElementById("security-code").value;
  const expirationDate = document.getElementById("expiration-date").value;

  if (!paymentMethod || !cardNumber || !cardholderName || !cardholderLastname || !securityCode || !expirationDate) {
    alert("Por favor, complete todos los campos del formulario de pago.");
    return;
  }
  closePaymentForm();
  placeOrder({ paymentMethod, cardNumber, cardholderName, cardholderLastname, securityCode, expirationDate });
}

function placeOrder(paymentDetails) {
  const username = sessionStorage.getItem("User") || "Invitado";

  fetch("/placeOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, cartItems, paymentDetails }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showInvoice(data.order);
        cartItems = [];
        sessionStorage.removeItem("cartItems");
        renderCartItems();
      } else {
        alert("Error al realizar el pedido");
      }
    })
    .catch((error) => {
      console.error("Error al realizar el pedido:", error);
    });
}

function formatItemsTable(items) {
  return `
    <table>
      <tr>
        <th>Producto</th>
        <th>Cantidad</th>
      </tr>
      ${items
      .map(
        (item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
        </tr>
      `
      )
      .join("")}
    </table>
  `;
}

function showInvoice(order) {
  document.getElementById("invoice-id").innerHTML = `<strong>Número de pedido:</strong> ${order.id}<br>`;
  document.getElementById("invoice-name").innerHTML = `<strong>Nombre:</strong> ${order.customer}<br>`;
  document.getElementById("invoice-date").innerHTML = `<strong>Fecha:</strong> ${new Date(
    order.date
  ).toLocaleString()}<br>`;
  document.getElementById("invoice-order").innerHTML = `<strong>Orden:</strong><br>${formatItemsTable(
    order.items
  )}<br>`;
  document.getElementById("invoice-total").innerHTML = `<strong>Total:</strong> $${order.total.toFixed(2)}<br>`;

  document.getElementById("invoice-popup").style.display = "block";
}

function closePopup() {
  document.getElementById("invoice-popup").style.display = "none";
  window.location.href = "/";
}

async function deleteFromCart(e) {
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

      // Renderizar el carrito después de eliminar
      renderCartItems();
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      alert("Hubo un problema al eliminar el producto del carrito.");
    }
  }
}


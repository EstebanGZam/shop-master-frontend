import { deleteFromCart } from './cart-utils.js';
// import { cartItems } from './cart-utils.js';

let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
// Función de inicialización
export function initializeCart() {
  console.log(cartItems);
  addEventListeners();
  renderCartItems();
}

function addEventListeners() {
  document.getElementById("flush-car-shop").addEventListener("click", flushCar);
  document.getElementById("purchase-btn").addEventListener("click", openPaymentForm);
  document.querySelector(".close-payment").addEventListener("click", closePaymentForm);
  document.getElementById("confirm-payment").addEventListener("click", submitPayment);

  document.querySelector(".close").addEventListener("click", closePopup);

  document.querySelector("#shop-list-order tbody").addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
      event.preventDefault();
      deleteFromCart(event, renderCartItems);
    }
  });
}

function renderCartItems() {
  cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
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

import { deleteFromCart } from './cart-utils.js';
// import { cartItems } from './cart-utils.js';

let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
// Función de inicialización
export function initializeCart() {
  // // Ejemplo de uso:
  // const invoiceData = {
  //   invoiceId: 123,
  //   issueDate: "2024-03-22T15:30:00",
  //   total: 156.99,
  //   products: [
  //     {
  //       productId: "PROD-1",
  //       productName: "Producto 1",
  //       quantity: 2,
  //       price: 29.99,
  //       total: 59.98,
  //       imageUrl: "https://static.vecteezy.com/system/resources/previews/010/792/673/non_2x/colorful-free-range-male-rooster-isolated-on-white-background-free-png.png"
  //     }
  //   ]
  // };
  // showInvoice(invoiceData);
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

// Función auxiliar para formatear la tabla de productos
function formatItemsTable(products) {
  const tableHeader = `
    <table class="w-full table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2">Producto</th>
          <th class="px-4 py-2">Cantidad</th>
          <th class="px-4 py-2">Precio Unit.</th>
          <th class="px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  const tableRows = products.map(item => `
    <tr>
      <td class="border px-4 py-2">
        <div class="items-center">
          <img src="${item.imageUrl}" alt="${item.productName}" class="product-image w-12 h-12 object-cover mr-2"/>
          <span>${item.productName}</span>
        </div>
      </td>
      <td class="border px-4 py-2 text-center">${item.quantity}</td>
      <td class="border px-4 py-2 text-right">$${item.price.toFixed(2)}</td>
      <td class="border px-4 py-2 text-right">$${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  return `${tableHeader}${tableRows}</tbody></table>`;
}

// Función para formatear la fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Función principal para mostrar la factura
function showInvoice(invoice) {
  document.getElementById("invoice-id").innerHTML = `
    <span class="font-bold">Número de factura:</span> ${invoice.invoiceId}
  `;

  document.getElementById("invoice-date").innerHTML = `
    <span class="font-bold">Fecha:</span> ${formatDate(invoice.issueDate)}
  `;

  document.getElementById("invoice-order").innerHTML = formatItemsTable(invoice.products);

  document.getElementById("invoice-total").innerHTML = `
    <div class="text-right mt-4">
      <span class="font-bold">Total:</span> $${invoice.total.toFixed(2)}
    </div>
  `;

  document.getElementById("invoice-popup").style.display = "block";
}
function closePopup() {
  document.getElementById("invoice-popup").style.display = "none";
  window.location.href = "/";
}

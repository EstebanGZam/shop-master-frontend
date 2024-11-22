import { deleteFromCart } from './cart-utils.js';
import { flushCar } from './cart-utils.js';

let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
// Función de inicialización
export function initializeCart() {
  addEventListeners();
  renderCartItems();
}

function addEventListeners() {
  document.getElementById("flush-car-shop").addEventListener("click", (e) => {
    flushCar(e, renderCartItems);
  });
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

// Suponiendo que expirationDate es un string en formato "yyyy-MM"
function formatExpirationDate(expirationDate) {
  const [year, month] = expirationDate.split("-");
  const lastDay = new Date(year, month, 0).getDate(); // Obtiene el último día del mes
  return `${year}-${month}-${String(lastDay).padStart(2, "0")}T23:59:59`;
}


async function submitPayment(event) {
  // Prevenir el comportamiento por defecto del botón (recarga de página)
  event.preventDefault();
  const paymentMethodId = parseInt(document.getElementById("payment-method").value);
  const cardNumber = parseInt(document.getElementById("card-number").value);
  const cardholderName = document.getElementById("cardholder-name").value;
  const cardholderLastname = document.getElementById("cardholder-lastname").value;
  const securityCode = document.getElementById("security-code").value;
  const expirationDate = document.getElementById("expiration-date").value;

  // Formatear la fecha antes de enviarla
  const formattedExpirationDate = formatExpirationDate(expirationDate);

  // Validación de campos
  if (!paymentMethodId || !cardNumber || !cardholderName || !cardholderLastname || !securityCode || !expirationDate) {
    alert("Por favor, complete todos los campos del formulario de pago.");
    return;
  }

  // Crear objeto de detalles de pago en el formato esperado
  const paymentDetail = {
    cardNumber,
    cardholderName,
    cardholderLastname,
    securityCode,
    expirationDate: formattedExpirationDate,
    paymentMethodId
  };

  closePaymentForm();
  const invoiceData = await placeOrder({ paymentDetail });
  showInvoice(invoiceData);
  // Limpiar el carrito
  cartItems = [];
  sessionStorage.removeItem("cartItems");
  renderCartItems();
}

async function placeOrder(purchaseData) {
  try {
    const response = await fetch("http://localhost:8080/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
      body: JSON.stringify(purchaseData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al realizar el pedido:", error);
    alert("Error al procesar el pago. Por favor, intente nuevamente.");
  }
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

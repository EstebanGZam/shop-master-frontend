const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const historyBtn = document.getElementById("history-btn");
const logoutBtn = document.getElementById("logout-btn");
const addProductBtn = document.getElementById("add-product-btn");

const carShop = document.getElementById("car-shop");
const element1 = document.getElementById("shop-list");
const list = document.querySelector("#shop-list tbody");
const purchaseBtn = document.getElementById("purchase-btn");
const flushCarBtn = document.getElementById("flush-car-shop");
const landingPage = document.getElementById("landing-page");
const listOfProducts = document.getElementById("list-of-products");

// Variable global para almacenar los productos del carrito
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

document.addEventListener("DOMContentLoaded", () => {
  // Función para verificar el estado de inicio de sesión
  checkLoginStatus();
  // Cargar los listeners de eventos
  loadEventListeners();
});

function checkLoginStatus() {
  // Verificar si el usuario ha iniciado sesión
  const isLoggedIn = sessionStorage.getItem("LoggedIn");
  // Verificar el tipo de usuario logueado
  const userRole = sessionStorage.getItem("UserRole");
  console.log(userRole);
  if (isLoggedIn === "true") {
    // Ocultar el main si el usuario está logueado
    landingPage.style.display = "none";
    // Mostrar la lista de productos si el usuario está logueado
    listOfProducts.style.display = "block";
    // Si el usuario ha iniciado sesión, mostrar botón de ver pedidos y cerrar sesión
    historyBtn.style.display = "block";
    logoutBtn.style.display = "block";
    if (isLoggedIn === "true") {
      // Cargar los productos si el usuario está logueado
      loadProducts(userRole);
      if (userRole === "admin") {
        addProductBtn.style.display = "block";
        carShop.style.display = "none";
        historyBtn.style.display = "none";
      } else {
        addProductBtn.style.display = "none";
        carShop.style.display = "flex";
        renderCart();
      }
    }
  } else {
    // Mostrar el main si el usuario no está logueado
    landingPage.style.display = "flex";
    // Ocultar la lista de productos si el usuario no está logueado
    listOfProducts.style.display = "none";
    // Si el usuario no ha iniciado sesión, mostrar botones de inicio de sesión y registro
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    carShop.style.display = "none";
  }
}

function loadProducts(userRole) {
  fetch("http://localhost:8080/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.split("=")[1]}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const productContent = document.querySelector(".product-content");
      productContent.innerHTML = "";

      if (products.length === 0) {
        productContent.innerHTML = `
          <p style="text-align: center; font-size: 18px; margin-top: 20px;">
            No hay productos disponibles en este momento.
          </p>
        `;
        return;
      }

      products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        // Crear contenedor de la imagen
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        // Crear imagen del producto
        const productImg = document.createElement("img");
        productImg.src = product.imageUrl;
        productImg.alt = product.name;
        productImg.style.width = "100%";
        // productImg.style.height = "200px";
        productImg.style.objectFit = "cover"; // Ajusta la imagen proporcionalmente
        imageContainer.appendChild(productImg);

        // Agregar contenedor de la imagen al div del producto
        productDiv.appendChild(imageContainer);

        // Crear texto del producto
        const productTxt = document.createElement("div");
        productTxt.classList.add("product-txt");

        productTxt.innerHTML = `
          <h3>${product.name}</h3>
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Precio:</strong> $${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> ${product.stockQuantity}</p>
          <p><strong>Talla:</strong> ${product.sizeName || "N/A"}</p>
          <p><strong>Categoría:</strong> ${product.categoryName || "N/A"}</p>
          <p><strong>Fecha de creación:</strong> ${new Date(product.creationDate).toLocaleDateString("es-ES")}</p>
        `;

        // Si el usuario no es un administrador, agregar botón al carrito
        if (userRole !== "admin") {
          const addCarButton = document.createElement("a");
          addCarButton.href = "#";
          addCarButton.classList.add("add-car", "btn-2");
          addCarButton.textContent = "Agregar al carrito";
          addCarButton.setAttribute("data-id", product.id);
          productTxt.appendChild(addCarButton);
        }

        // Agregar texto del producto al div del producto
        productDiv.appendChild(productTxt);

        // Agregar div del producto al contenedor principal
        productContent.appendChild(productDiv);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
}


function loadEventListeners() {
  document.querySelector(".product-content").addEventListener("click", buyElement);
  flushCarBtn.addEventListener("click", flushCar);
  list.addEventListener("click", deleteFromCart);
  // logoutBtn.addEventListener("click", logout);
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Previene comportamientos no deseados
    logout();
  });
  document.getElementById("purchase-btn").addEventListener("click", () => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  });
}

function logout() {
  // Limpia las cookies y el almacenamiento
  // Eliminar indicador de inicio de sesión y rol del usuario
  document.cookie = "token=; path=/; max-age=0; Secure";
  sessionStorage.clear(); // Elimina todos los datos de la sesión
  localStorage.clear();   //  Elimina todos los datos del almacenamiento local
  // Oculta botones y secciones específicas
  historyBtn.style.display = "none";
  logoutBtn.style.display = "none";
  addProductBtn.style.display = "none";
  // Redirige al usuario a la página de inicio o login
  window.location.href = "./../views/index.html"; // Cambia esto a la ruta que desees
}

function buyElement(e) {
  e.preventDefault();
  if (e.target.classList.contains("add-car")) {
    const element = e.target.closest(".product");
    readDataElement(element);
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

  renderCart(); // Llamar a la función para renderizar el carrito
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

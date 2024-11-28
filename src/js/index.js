import { renderCart } from './cart-utils.js';

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const historyBtn = document.getElementById("history-btn");
const logoutBtn = document.getElementById("logout-btn");
const addProductBtn = document.getElementById("add-product-btn");

const carShop = document.getElementById("car-shop");
const landingPage = document.getElementById("landing-page");
const listOfProducts = document.getElementById("list-of-products");

const sizeFilter = document.getElementById("size-filter");
const categoryFilter = document.getElementById("category-filter");
const applyFiltersBtn = document.getElementById("apply-filters");
const clearFiltersBtn = document.getElementById("clear-filters");

let allProducts = [];
let currentUserRole = null;

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

function loadProducts(userRole, sizeId = null, categoryId = null) {
  let url = "http://localhost:8080/products";

  if (sizeId) {
    url = `http://localhost:8080/products/filter-by-size?size=${sizeId}`;
  }
  if (categoryId) {
    url = `http://localhost:8080/products/filter-by-category?categoryId=${categoryId}`;
  }

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.split("=")[1]}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      allProducts = products;
      displayProducts(products, userRole);
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
      const productContent = document.querySelector(".product-content");
      productContent.innerHTML = `
        <p style="color: red; text-align: center;">
          Ocurrió un error al cargar los productos. Inténtalo de nuevo más tarde.
        </p>
      `;
    });
}

function displayProducts(products, userRole) {
  const productContent = document.querySelector(".product-content");
  productContent.innerHTML = "";

  if (products.length === 0) {
    productContent.innerHTML = `
      <p style="text-align: center; font-size: 18px; margin-top: 20px;">
        No hay productos disponibles con los filtros seleccionados.
      </p>
    `;
    return;
  }

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const productImg = document.createElement("img");
    productImg.src = product.imageUrl;
    productImg.alt = product.name;
    productImg.style.width = "100%";
    productImg.style.objectFit = "cover";

    // Agregar evento click para redirigir y guardar ID del producto
    productImg.addEventListener("click", () => {
      // Guardar el id del producto en sessionStorage
      sessionStorage.setItem("selectedProductId", product.id);

      // Redirigir a la pantalla de reseñas del producto
      window.location.href = "/product/reviews";
    });

    imageContainer.appendChild(productImg);
    productDiv.appendChild(imageContainer);

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

    if (userRole !== "admin") {
      const addCarButton = document.createElement("a");
      addCarButton.href = "#";
      addCarButton.classList.add("add-car", "btn-2");
      addCarButton.textContent = "Agregar al carrito";
      addCarButton.setAttribute("data-id", product.id);
      productTxt.appendChild(addCarButton);
    }

    productDiv.appendChild(productTxt);
    productContent.appendChild(productDiv);
  });
}

function applyFilters() {
  const selectedSize = sizeFilter.value;
  const selectedCategory = categoryFilter.value;

  console.log("Talla seleccionada:", selectedSize);
  console.log("Categoría seleccionada:", selectedCategory);

  applyFiltersBtn.disabled = true;

  loadProducts(currentUserRole, selectedSize, selectedCategory);

  setTimeout(() => {
    applyFiltersBtn.disabled = false;
  }, 500);
}

function clearFilters() {
  sizeFilter.value = "";
  categoryFilter.value = "";

  loadProducts(currentUserRole);
}

function loadEventListeners() {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });

  applyFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilters();
  });

  clearFiltersBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearFilters();
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
  window.location.href = "/"; // Cambia esto a la ruta que desees
}
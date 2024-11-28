// Recuperar el ID del producto desde sessionStorage
const selectedProductId = sessionStorage.getItem("selectedProductId");

const reviewsData = [
    { id: "1", rating: 5, comment: "Excelente producto.", date: "2024-11-25", userId: 101 },
    { id: "2", rating: 4, comment: "Muy bueno.", date: "2024-11-24", userId: 102 },
    { id: "3", rating: 3, comment: "Aceptable.", date: "2024-11-23", userId: 103 },
    { id: "4", rating: 2, comment: "No fue lo que esperaba.", date: "2024-11-22", userId: 104 },
    { id: "5", rating: 1, comment: "Mala experiencia.", date: "2024-11-21", userId: 105 },
];

// Cargar datos del producto desde el backend
async function loadProduct(productId) {
    try {
        // Realizar la solicitud al backend para obtener los datos del producto
        const response = await fetch(`http://localhost:8080/products/${productId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.split("=")[1]}`,
                }
            },
        );

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al cargar el producto: ${response.statusText}`);
        }

        // Parsear los datos de la respuesta como JSON
        const productData = await response.json();

        // Asignar los datos al DOM
        document.getElementById("product-name").textContent = productData.name;
        document.getElementById("product-description").textContent = productData.description;
        document.getElementById("product-price").textContent = `\$${productData.price.toFixed(2)}`;
        document.getElementById("product-stock").textContent = productData.stockQuantity;
        document.getElementById("product-creation-date").textContent = new Date(
            productData.creationDate
        ).toLocaleDateString();
        document.getElementById("product-category").textContent = productData.categoryName || "N/A";
        document.getElementById("product-size").textContent = productData.sizeName || "N/A";
        document.getElementById("product-image").src = productData.imageUrl;
    } catch (error) {
        console.error("Error al cargar los datos del producto:", error);
        // Mostrar un mensaje de error al usuario
        document.querySelector(".product-content").innerHTML = `
        <p style="color: red; text-align: center; font-size: 18px;">No se pudo cargar la información del producto.</p>
    `;
    }
}

// Cargar reseñas
function loadReviewsInPage(reviews) {
    const reviewsList = document.getElementById("reviews-list");
    reviewsList.innerHTML = ""; // Limpiar reseñas previas

    // Verificar si hay reseñas disponibles
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
                <p style="text-align: center; font-size: 18px; margin-top: 20px;">
                    No hay reseñas disponibles para este producto.
                </p>
            `;
        return;
    }

    // Renderizar cada reseña en el DOM
    reviews.forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
                <strong>Calificación:</strong> ${review.rating} Estrellas<br>
                <strong>Comentario:</strong> ${review.comment || "Sin comentario"}<br>
                <small><em>${new Date(review.date).toLocaleDateString()}</em></small>
            `;
        reviewsList.appendChild(reviewItem);
    });
}

// Cargar reseñas desde el backend
async function loadReviews(productId) {
    try {
        // Realizar la solicitud al backend para obtener las reseñas del producto
        const response = await fetch(`http://localhost:8080/reviews/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${document.cookie.split("=")[1]}`, // Reemplaza esto si usas otro método de autenticación
            },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al cargar las reseñas: ${response.statusText}`);
        }

        // Parsear los datos de la respuesta como JSON
        const reviewsData = await response.json();

        loadReviewsInPage(reviewsData);

    } catch (error) {
        console.error("Error al cargar las reseñas:", error);
        // Mostrar un mensaje de error al usuario
        reviewsList.innerHTML = `
            <p style="color: red; text-align: center; font-size: 18px;">
                No se pudieron cargar las reseñas. Por favor, intenta más tarde.
            </p>
        `;
    }
}

// Filtrar reseñas por puntaje usando el backend
async function filterReviews(rating) {
    if (!selectedProductId) {
        console.error("El ID del producto es obligatorio para filtrar las reseñas.");
        return;
    }

    // Calcular el rango de estrellas basado en la calificación
    let minRating = 0.0;
    let maxRating = 5.0;

    if (rating) {
        minRating = rating - 0.5;
        maxRating = rating === 5 ? 5.0 : rating + 0.4;
    }

    try {
        // Hacer la solicitud al backend con los parámetros calculados y el selectedProductId
        const response = await fetch(
            `http://localhost:8080/reviews/filter-by-rating?minRating=${minRating}&maxRating=${maxRating}&productId=${selectedProductId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${document.cookie.split("=")[1]}`,
                },
            }
        );

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error al filtrar las reseñas: ${response.statusText}`);
        }

        // Parsear la respuesta
        const filteredReviews = await response.json();

        // Cargar las reseñas filtradas
        loadReviewsInPage(filteredReviews);
    } catch (error) {
        console.error("Error al filtrar reseñas:", error);

        // Mostrar un mensaje de error al usuario
        const reviewsList = document.getElementById("reviews-list");
        reviewsList.innerHTML = `
            <p style="color: red; text-align: center; font-size: 18px;">No se pudieron cargar las reseñas filtradas.</p>
        `;
    }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    if (selectedProductId) {
        loadProduct(selectedProductId);
        loadReviews(selectedProductId);
    } else {
        console.error("No se encontró ningún producto seleccionado.");
        document.querySelector(".product-content").innerHTML = `
            <p style="color: red; text-align: center; font-size: 18px;">No se encontró información del producto.</p>
        `;
    }
});
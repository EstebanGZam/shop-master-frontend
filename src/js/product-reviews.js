// Mock data para pruebas
const productData = {
    id: "1",
    name: "Producto Ejemplo",
    description: "Este es un producto de ejemplo con toda la información detallada.",
    price: 49.99,
    stockQuantity: 15,
    creationDate: "2024-11-20T15:30:00",
    sizeName: "Mediano",
    categoryName: "Electrónica",
    imageUrl: "https://png.pngtree.com/png-vector/20240326/ourmid/pngtree-cheerful-cartoon-rooster-giving-thumbs-up-sign-png-image_12241786.png",
};

const reviewsData = [
    { id: "1", rating: 5, comment: "Excelente producto.", date: "2024-11-25", userId: 101 },
    { id: "2", rating: 4, comment: "Muy bueno.", date: "2024-11-24", userId: 102 },
    { id: "3", rating: 3, comment: "Aceptable.", date: "2024-11-23", userId: 103 },
    { id: "4", rating: 2, comment: "No fue lo que esperaba.", date: "2024-11-22", userId: 104 },
    { id: "5", rating: 1, comment: "Mala experiencia.", date: "2024-11-21", userId: 105 },
];

// Cargar datos del producto
function loadProduct() {
    document.getElementById("product-name").textContent = productData.name;
    document.getElementById("product-description").textContent = productData.description;
    document.getElementById("product-price").textContent = `\$${productData.price.toFixed(2)}`;
    document.getElementById("product-stock").textContent = productData.stockQuantity;
    document.getElementById("product-creation-date").textContent = new Date(
        productData.creationDate
    ).toLocaleDateString();
    document.getElementById("product-category").textContent = productData.categoryName;
    document.getElementById("product-size").textContent = productData.sizeName;
    document.getElementById("product-image").src = productData.imageUrl;
}


// Cargar reseñas
function loadReviews(reviews) {
    const reviewsList = document.getElementById("reviews-list");
    reviewsList.innerHTML = ""; // Limpiar reseñas previas
    reviews.forEach((review) => {
        const reviewItem = document.createElement("div");
        reviewItem.classList.add("review-item");
        reviewItem.innerHTML = `
        <strong>Calificación:</strong> ${review.rating} Estrellas<br>
        <strong>Comentario:</strong> ${review.comment}<br>
        <small><em>${new Date(review.date).toLocaleDateString()}</em></small>
    `;
        reviewsList.appendChild(reviewItem);
    });
}

// Filtrar reseñas por puntaje
function filterReviews(rating) {
    if (rating) {
        const filteredReviews = reviewsData.filter((review) => review.rating === rating);
        loadReviews(filteredReviews);
    } else {
        loadReviews(reviewsData); // Mostrar todas
    }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
    loadReviews(reviewsData);
});

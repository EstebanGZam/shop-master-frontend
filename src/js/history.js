// JavaScript para manejar el historial de órdenes y carrusel de productos
document.addEventListener("DOMContentLoaded", async () => {
    const errorMessage = document.getElementById("error-message");
    const ordersTable = document.getElementById("orders-table");
    const tbody = document.getElementById("order-history-body");

    try {
        const response = await fetch(`http://localhost:8080/purchase/order-history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${document.cookie.split("=")[1]}`,
            },
        });

        if (response.ok) {
            const invoices = await response.json();

            if (invoices.length === 0) {
                errorMessage.textContent = "No hay órdenes registradas.";
                errorMessage.style.display = "block";
                ordersTable.style.display = "none";
                return;
            }

            invoices.forEach((invoice) => {
                const tr = document.createElement("tr");

                // ID de la factura
                const invoiceIdTd = document.createElement("td");
                invoiceIdTd.textContent = invoice.invoiceId;
                tr.appendChild(invoiceIdTd);

                // Fecha de emisión
                const dateTd = document.createElement("td");
                dateTd.textContent = new Date(invoice.issueDate).toLocaleString();
                tr.appendChild(dateTd);

                // Total
                const totalTd = document.createElement("td");
                totalTd.textContent = `$${invoice.total.toFixed(2)}`;
                tr.appendChild(totalTd);

                // Productos con carrusel mejorado
                const productsTd = document.createElement("td");
                const sliderId = `slider-${invoice.invoiceId}`;

                productsTd.innerHTML = `
                    <div class="slider-container">
                        <div class="slider" id="${sliderId}">
                            ${invoice.products.map((product, index) => `
                                <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                                    <div class="product-image">
                                        <img src="${product.imageUrl}" alt="${product.productName}">
                                    </div>
                                    <div class="product-info">
                                        <p class="product-name">${product.productName}</p>
                                        <p class="product-quantity">${product.quantity} x $${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="slider-controls">
                            <button class="prev-btn" onclick="moveSlide('${sliderId}', -1)">❮</button>
                            <button class="next-btn" onclick="moveSlide('${sliderId}', 1)">❯</button>
                        </div>
                        <div class="slider-dots">
                            ${invoice.products.map((_, index) => `
                                <span class="dot ${index === 0 ? 'active' : ''}" 
                                      onclick="goToSlide('${sliderId}', ${index})"></span>
                            `).join('')}
                        </div>
                    </div>
                `;
                tr.appendChild(productsTd);
                tbody.appendChild(tr);
            });
        } else if (response.status === 401) {
            errorMessage.textContent = "No estás autorizado para acceder a esta información.";
        } else if (response.status === 404) {
            errorMessage.textContent = "No se encontró información de órdenes para este usuario.";
        } else {
            errorMessage.textContent = "Ocurrió un error al recuperar el historial de órdenes.";
        }
    } catch (error) {
        console.error("Error al obtener el historial de órdenes:", error);
        errorMessage.textContent = "No se pudo conectar con el servidor. Inténtalo más tarde.";
        errorMessage.style.display = "block";
        ordersTable.style.display = "none";
    }
});

// Funciones para controlar el slider
function moveSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelectorAll('.slide');
    const currentSlide = slider.querySelector('.slide.active');
    const currentIndex = parseInt(currentSlide.dataset.index);
    const totalSlides = slides.length;

    let newIndex = currentIndex + direction;

    if (newIndex >= totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = totalSlides - 1;

    updateSlidePosition(sliderId, newIndex);
}

function goToSlide(sliderId, index) {
    updateSlidePosition(sliderId, index);
}

function updateSlidePosition(sliderId, newIndex) {
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.parentElement.querySelectorAll('.dot');

    // Actualizar slides
    slides.forEach(slide => slide.classList.remove('active'));
    slides[newIndex].classList.add('active');

    // Actualizar dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[newIndex].classList.add('active');
}
document.addEventListener("DOMContentLoaded", async () => {
    const errorMessage = document.getElementById("error-message");
    const ordersTable = document.getElementById("orders-table");
    const tbody = document.getElementById("order-history-body");

    try {
        const response = await fetch(`http://localhost:8080/history`, {
            method: "GET",
            headers: {
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

                // Productos
                const productsTd = document.createElement("td");
                const carouselId = `carousel-${invoice.invoiceId}`;

                productsTd.innerHTML = `
                  <div class="carousel-container" id="${carouselId}">
                      ${invoice.products
                        .map(
                            (product, index) => `
                              <div class="carousel-item ${index === 0 ? "active" : ""}">
                                  <img src="${product.image}" alt="${product.productName}">
                                  <div class="carousel-caption">
                                      <p>${product.quantity} x $${product.price.toFixed(2)}</p>
                                  </div>
                              </div>
                          `
                        )
                        .join("")}
                      <div class="carousel-control-prev" onclick="prevSlide('${carouselId}')">&#10094;</div>
                      <div class="carousel-control-next" onclick="nextSlide('${carouselId}')">&#10095;</div>
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

        errorMessage.style.display = "block";
        ordersTable.style.display = "none";
    } catch (error) {
        console.error("Error al obtener el historial de órdenes:", error);
        errorMessage.textContent = "No se pudo conectar con el servidor. Inténtalo más tarde.";
        errorMessage.style.display = "block";
        ordersTable.style.display = "none";
    }
});
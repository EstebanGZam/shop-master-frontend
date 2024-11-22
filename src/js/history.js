document.addEventListener("DOMContentLoaded", async () => {
  const username = sessionStorage.getItem("User");
  const response = await fetch(`/history/${username}`);
  const data = await response.json();

  if (data.success) {
      const orders = data.orders;
      const tbody = document.getElementById("order-history-body");

      orders.forEach((order) => {
          const tr = document.createElement("tr");

          const orderId = document.createElement("td");
          orderId.textContent = order.id;
          tr.appendChild(orderId);

          const dateTd = document.createElement("td");
          dateTd.textContent = new Date(order.date).toLocaleString();
          tr.appendChild(dateTd);

          const totalTd = document.createElement("td");
          totalTd.textContent = `$${order.total.toFixed(2)}`;
          tr.appendChild(totalTd);

          const productsTd = document.createElement("td");
          const carouselId = `carousel-${order.id}`;

          productsTd.innerHTML = `
              <div class="carousel-container" id="${carouselId}">
                  ${order.items
                      .map(
                          (item, index) => `
                          <div class="carousel-item ${index === 0 ? "active" : ""}">
                              <img src="${item.image}" alt="${item.name}">
                              <div class="carousel-caption">
                                  <p>${item.quantity} x $${item.price.toFixed(2)}</p>
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
  } else {
      const errorMessage = document.getElementById("error-message");
      errorMessage.style.display = "block";  // Muestra el mensaje de error
  }
});

function nextSlide(carouselId) {
  const carousel = document.getElementById(carouselId);
  const items = carousel.querySelectorAll(".carousel-item");
  let currentIndex = Array.from(items).findIndex((item) => item.classList.contains("active"));
  items[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % items.length;
  items[currentIndex].classList.add("active");
}

function prevSlide(carouselId) {
  const carousel = document.getElementById(carouselId);
  const items = carousel.querySelectorAll(".carousel-item");
  let currentIndex = Array.from(items).findIndex((item) => item.classList.contains("active"));
  items[currentIndex].classList.remove("active");
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  items[currentIndex].classList.add("active");
}

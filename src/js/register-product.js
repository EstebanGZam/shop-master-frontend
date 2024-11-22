const form = document.getElementById("product-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData();

  // Crear el objeto JSON con los datos del producto
  const productDTO = {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value,
    price: parseFloat(document.getElementById("productPrice").value),
    stockQuantity: parseInt(document.getElementById("productQuantity").value, 10),
    sizeId: document.getElementById("productSize").value,
    categoryId: document.getElementById("productCategory").value,
  };

  // Agregar la parte JSON al FormData
  formData.append("productDTO", new Blob([JSON.stringify(productDTO)], { type: "application/json" }));

  // Agregar la imagen al FormData
  const imageFile = document.getElementById("productImage").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    console.log(formData);
    const response = await fetch("http://localhost:8080/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${document.cookie.split("=")[1]}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Producto registrado exitosamente");
    } else {
      alert("Hubo un error al registrar el producto", await response.text());
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
});

document.getElementById("back-to-index").addEventListener("click", () => {
  window.location.href = "/"; // Cambia la ruta si tu archivo está en un directorio diferente
});
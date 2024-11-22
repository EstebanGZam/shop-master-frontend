document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Recolectar valores de los campos
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;
    const role = parseInt(document.getElementById("role").value, 10); // Convertir a número

    // Crear objeto para enviar
    const requestBody = { username, email, password, address, role };

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        document.cookie = `token=${token}; path=/; max-age=14400; Secure`;
        // Almacenar indicadores en sessionStorage
        sessionStorage.setItem("LoggedIn", "true");
        sessionStorage.setItem("UserRole", role === 1 ? "admin" : "client");
        sessionStorage.setItem("User", username);
        window.location.href = "/";
      } else {
        alert("Hubo un error al registrar el usuario");
        // Limpiar campos del formulario en caso de error
        registerForm.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al conectar con el servidor");
    }
  });
});

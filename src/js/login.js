import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.esm.js';

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario ya está logueado
  const isLoggedIn = sessionStorage.getItem("LoggedIn") === "true";

  if (isLoggedIn) {
    alert(`Ya has iniciado sesión como ${sessionStorage.getItem("User")}. Si deseas iniciar sesión con otro usuario, primero debes cerrar sesión.`);
    window.location.href = "./../views/index.html"; // Redirigir al index
    return; // Detener ejecución del resto del script
  }

  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        document.cookie = `token=${token}; path=/; max-age=14400; Secure`;
        // Decodificar el token JWT
        const decodedToken = jwtDecode(token);
        // Almacenar indicador de inicio de sesión
        sessionStorage.setItem("LoggedIn", "true");
        // Almacenar indicador de tipo de usuario logueado
        sessionStorage.setItem("UserRole", decodedToken.roles[0].authority === "ROLE_ADMINISTRADOR" ? "admin" : "client");
        // Almacenar al usuario que está logueado
        sessionStorage.setItem("User", username);

        window.location.href = "./../views/index.html"; // Redirigir al index
      } else {
        if (response.status === 401) {
          alert("Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.");
        } else {
          alert("Hubo un error al iniciar sesión. Por favor, intenta nuevamente.");
        }
        // Limpiar campos del formulario en caso de error
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al conectar con el servidor");
    }
  });
});

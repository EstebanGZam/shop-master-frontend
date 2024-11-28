const express = require('express');
const path = require('path');

const app = express();
const PORT = 5173;

// Configurar directorio de vistas
const viewsPath = path.join(__dirname, '../src/views');
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use('/css', express.static(path.join(__dirname, '../src/css')));
app.use('/js', express.static(path.join(__dirname, '../src/js')));

// Definir rutas para los archivos HTML
app.get('/', (req, res) => res.sendFile(path.join(viewsPath, 'index.html')));
app.get('/auth/login', (req, res) => res.sendFile(path.join(viewsPath, 'login.html')));
app.get('/auth/register', (req, res) => res.sendFile(path.join(viewsPath, 'register.html')));
app.get('/purchase', (req, res) => res.sendFile(path.join(viewsPath, 'purchase.html')));
app.get('/purchase/order-history', (req, res) => res.sendFile(path.join(viewsPath, 'history.html')));
app.get('/products', (req, res) => res.sendFile(path.join(viewsPath, 'register-product.html')));
app.get('/product/reviews', (req, res) => res.sendFile(path.join(viewsPath, 'product-reviews.html')));

// Manejar rutas no encontradas
app.use((req, res) => res.sendFile(path.join(viewsPath, "404.html")));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

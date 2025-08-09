# 🛍️ Shop Master Frontend

Una moderna aplicación web de comercio electrónico para tienda de ropa, construida con tecnologías web estándar y diseño responsivo.

## ✨ Características

- **🔐 Autenticación Completa**: Sistema de login/registro con JWT
- **👕 Catálogo de Productos**: Navegación intuitiva con filtros por categoría y talla
- **🛒 Carrito de Compras**: Gestión dinámica con actualizaciones en tiempo real
- **💳 Sistema de Pagos**: Procesamiento seguro de transacciones
- **📱 Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **⭐ Sistema de Reseñas**: Valoraciones y comentarios de productos
- **📊 Panel de Administración**: Gestión de inventario para administradores
- **🔔 Notificaciones en Tiempo Real**: Actualizaciones automáticas con Server-Sent Events
- **📈 Historial de Pedidos**: Seguimiento completo de compras

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Servidor**: Node.js con Express.js
- **Estilos**: CSS custom + Bootstrap 5
- **Iconos**: SVG personalizados + Bootstrap Icons
- **Estado**: SessionStorage + Cookies para persistencia
- **Comunicación**: Fetch API + Server-Sent Events (SSE)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Backend de Shop Master ejecutándose

### Instalación

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/EstebanGZam/shop-master-frontend.git
   cd shop-master-frontend
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
src/
├── views/              # Páginas HTML
│   ├── index.html      # Página principal
│   ├── login.html      # Inicio de sesión
│   ├── register.html   # Registro de usuario
│   ├── purchase.html   # Carrito y checkout
│   ├── history.html    # Historial de pedidos
│   └── product-reviews.html # Detalles y reseñas
├── css/                # Estilos
│   ├── index.css       # Estilos principales
│   ├── login.css       # Estilos de autenticación
│   ├── purchase.css    # Estilos de checkout
│   └── ...
├── js/                 # JavaScript modules
│   ├── index.js        # Lógica principal
│   ├── shopping-cart.js # Gestión del carrito
│   ├── purchase.js     # Proceso de compra
│   └── ...
├── assets/             # Recursos estáticos
│   ├── *.svg          # Iconos personalizados
│   └── *.png          # Imágenes
└── app.js             # Servidor Express
```

## 🎯 Funcionalidades Principales

### Para Clientes

- **Navegación de Productos**: Explora el catálogo con filtros avanzados
- **Gestión de Carrito**: Añade, modifica y elimina productos
- **Proceso de Compra**: Checkout seguro con múltiples métodos de pago
- **Reseñas**: Valora y comenta productos comprados
- **Historial**: Consulta tus pedidos anteriores

### Para Administradores

- **Gestión de Inventario**: Añade nuevos productos al catálogo
- **Subida de Imágenes**: Integración con Cloudinary
- **Monitoreo**: Vista en tiempo real de la actividad

## 🔧 Scripts Disponibles

```bash
# Servidor de desarrollo con auto-recarga
npm run dev

# Solo instalar dependencias
npm install
```

## 🎨 Diseño y UX

- **Paleta de Colores**: Azules profesionales con acentos verdes
- **Tipografía**: Google Fonts (Poppins, Oswald)
- **Iconografía**: SVG optimizados para rendimiento
- **Responsividad**: Mobile-first design
- **Accesibilidad**: Contraste y navegación optimizados

## 🔗 Integración con Backend

El frontend se comunica con el backend de Shop Master a través de:

- **REST API**: Operaciones CRUD estándar
- **JWT Authentication**: Tokens seguros para autenticación
- **Server-Sent Events**: Actualizaciones en tiempo real
- **File Upload**: Gestión de imágenes de productos

## 🌐 Rutas Principales

- `/` - Página principal con catálogo
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuario
- `/purchase` - Carrito y checkout
- `/purchase/order-history` - Historial de pedidos
- `/products` - Gestión de productos (admin)
- `/product/reviews` - Detalles y reseñas de producto

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles iOS/Android

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Esteban Gaviria** - _Desarrollo Frontend_ - [@EstebanGZam](https://github.com/EstebanGZam)
- **Juan David Colonia** - _Desarrollo Frontend_ - [@jdColonia](https://github.com/jdColonia)
- **Juan Manuel Díaz** - _Desarrollo Frontend_ - [@Juanmadiaz45](https://github.com/Juanmadiaz45)

## 🙏 Agradecimientos

- Iconos de [Bootstrap Icons](https://icons.getbootstrap.com/)
- Fuentes de [Google Fonts](https://fonts.google.com/)
- Inspiración de diseño de tiendas modernas de e-commerce

---

⭐ ¡Dale una estrella si te gusta este proyecto!

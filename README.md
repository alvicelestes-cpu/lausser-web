# 🌸 Lausser Web - Plataforma de Belleza & Cosmética Belcorp

Plataforma web moderna **Mobile-First** para la venta y gestión de cosméticos y perfumería de las marcas **Ésika**, **Cyzone** y **L'Bel**, optimizada para consultoras y clientes.

---

## 🚀 Características Principales

1. **Interfaz Mobile-First & Responsive**:
   - Experiencia de usuario fluida, pensada especialmente para smartphones y tablets.
   - Barra de navegación inferior móvil para acceso rápido con el pulgar.
   - Header con selector de marcas distintivo (Ésika, Cyzone, L'Bel) y contador de carrito.

2. **Módulo de Catálogos & Revistas Digitales**:
   - Pestañas por marca con temas visuales propios.
   - Visor interactivo integrado (embed/iframe responsivo) y opción a pantalla completa.
   - Carrusel de páginas destacadas con acceso directo para añadir códigos.
   - **Banner con cuenta regresiva en vivo** para el cierre de campaña.
   - **Modal para pedir por código de revista**: Permite al cliente escribir el código de producto (5-6 dígitos), página, tono y cantidad para sumarlo a su pedido.

3. **Módulo de Entrega Inmediata (Stock Físico)**:
   - Cuadrícula de productos con fotos de alta calidad, precios regulares y con descuento.
   - Filtros por categoría (Perfumería, Maquillaje, Cuidado Facial, Cuidado Personal, Moda y Joyería).
   - Búsqueda en tiempo real por nombre, marca o código.
   - Modal de vista rápida y detalles con selector de cantidades.

4. **Carrito de Compras con Checkout vía WhatsApp**:
   - **Separación visual clara** de productos en:
     - ⚡ **Entrega Inmediata** (Despacho 24h)
     - 📖 **Pedido de Campaña** (Por código de revista)
   - Resumen financiero detallado (subtotales y total en COP).
   - Formulario de datos para la entrega (Nombre, WhatsApp, Dirección, Ciudad/Barrio, Notas y Método de pago).
   - **Generación automática del enlace de WhatsApp**: Genera el mensaje estructurado con emojis y detalle listo para enviar a la asesora.

5. **Panel de Administración (`/admin`)**:
   - Formulario rápido para subir productos en stock físico con selector de fotos preset o URLs personalizadas.
   - Modificación en línea de cantidades de inventario y eliminación de productos.
   - Configuración de la campaña: número de campaña, fecha y hora de cierre, número de WhatsApp y enlaces a catálogos oficiales.
   - Persistencia local automática en `localStorage` con botón para reiniciar datos de prueba.

---

## 🛠️ Stack Tecnológico

- **React 19**
- **Vite 8**
- **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide Icons**

---

## 💻 Instalación y Ejecución

Clonar el repositorio y entrar al directorio:
```bash
git clone https://github.com/alvicelestes-cpu/lausser-web.git
cd lausser-web
```

Instalar dependencias:
```bash
npm install
```

Iniciar servidor de desarrollo:
```bash
npm run dev
```

Compilar para producción:
```bash
npm run build
```

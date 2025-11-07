# Shopping Cart - Sistema de Carrito de Compras

Una aplicación web completa de e-commerce con carrito de compras, desarrollada con React (frontend) y Node.js (backend). Incluye un sistema completo de gestión de usuarios, productos y carritos con autenticación JWT y control de acceso basado en roles (RBAC).

## Características Principales

### Funcionalidades Core
- **Gestión de Usuarios**: Sistema de registro, login y perfiles de usuario
- **Carrito de Compras**: Agregar, editar y eliminar productos del carrito
- **Gestión de Productos**: CRUD completo para productos con validación de imágenes
- **Dashboard Administrativo**: Panel de control para administradores con supervisión de vendedores
- **Sistema de Roles**: Tres tipos de usuario (Admin, Seller, Customer)

### Características Técnicas
- **Autenticación JWT**: Tokens seguros para manejo de sesiones
- **RBAC (Role-Based Access Control)**: Control granular de permisos
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos
- **Toast Notifications**: Sistema de notificaciones profesional
- **Validación de Datos**: Validación completa en frontend y backend

## Tecnologías Utilizadas

### Frontend
- **React 18** con Hooks y componentes funcionales
- **Vite** como build tool y servidor de desarrollo
- **React Router** para navegación
- **CSS Modules** con variables CSS customizadas
- **Fetch API** para comunicación con el backend

### Backend
- **Node.js** con Express.js
- **MongoDB** con Mongoose ODM
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **CORS** configurado para desarrollo

## Estructura del Proyecto

```
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── hooks/          # Custom hooks
│   │   └── styles/         # Estilos CSS organizados
│   └── package.json
├── src/                     # Backend Node.js
│   ├── config/             # Configuración de BD y permisos
│   ├── handlers/           # Controladores de rutas
│   ├── middlewares/        # Middlewares de autenticación y permisos
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Definición de rutas
│   └── services/           # Lógica de negocio
└── package.json
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB
- npm o yarn

### Configuración del Backend

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar variables de entorno en `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shopping-cart
JWT_SECRET=tu_jwt_secret_aqui
```

### Configuración del Frontend

1. Navegar al directorio frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

## Ejecución de la Aplicación

### 1. Levantar la Base de Datos
```bash
mongod --dbpath C:\data\db
```

### 2. Iniciar el Backend
```bash
npm start
```
El servidor estará disponible en `http://localhost:3000`

### 3. Iniciar el Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

## Creación de Usuario Administrador

Para crear el primer usuario administrador, utiliza el endpoint de registro con un código secreto:

```bash
POST /api/auth/create-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "your_secure_password",
  "secretCode": "your_secret_code"
}
```

Una vez creado el administrador, puedes crear otros usuarios desde el panel de administración o mediante registro normal para sellers y customers.

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil del usuario

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (Seller/Admin)
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `PUT /api/cart/update` - Actualizar cantidad de producto
- `DELETE /api/cart/remove/:id` - Eliminar producto del carrito

### Administración (Solo Admin)
- `GET /api/users` - Listar todos los usuarios
- `GET /api/cart/all` - Listar todos los carritos

## Arquitectura de Seguridad

- **Autenticación JWT**: Tokens con expiración configurable
- **Hash de Contraseñas**: bcrypt con salt rounds
- **Validación de Datos**: Sanitización en frontend y backend
- **Control de Acceso**: Middleware RBAC para proteger rutas
- **CORS**: Configurado para permitir solo orígenes autorizados

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## Comando para levantar base de datos

mongod --dbpath C:\data\db
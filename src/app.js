const express = require('express');
const connectDB = require('./config/db');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Conexion a la base de datos
connectDB().catch((error) => {
  app.use((req, res, next) => next(error));
});

// Habilito CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middlewares globales para comprobar y parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use(routes);

// Middleware de manejo de errores
app.use(errorMiddleware);

module.exports = app;
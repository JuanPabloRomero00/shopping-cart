const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/BackendService';


 // Conexion a base de datos con mongoose y manejo de errores
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true, // Analizador moderno de URL
      useUnifiedTopology: true, // Motor de administración de conexiones moderno
    });
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
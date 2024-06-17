import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import houseRoutes from './routes/houseRoutes.js';
import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import os from 'os';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 4999;

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/', houseRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(port, () => {
  // Obtener la IP del servidor
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  for (const iface of Object.values(networkInterfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        addresses.push(alias.address);
      }
    }
  }

  const serverAddress = addresses.length > 0 ? addresses[0] : 'localhost';
  console.log(`Server running on http://${serverAddress}:${port}`);
});

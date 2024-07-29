import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import houseRoutes from './routes/houseRoutes.js';
import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import fs from 'fs';
import https from 'https';

// Configuración de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 4999;

// Middlewares
console.log('Setting up middlewares...');
app.use(express.json());
app.use(cors());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/', houseRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Leer los archivos del certificado
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/velzia.es/privkey.pem'),  // Ruta al archivo de clave
  cert: fs.readFileSync('/etc/letsencrypt/live/velzia.es/fullchain.pem') // Ruta al archivo de certificado
};

// Crear el servidor HTTPS
https.createServer(sslOptions, app).listen(port, '0.0.0.0', () => {
  console.log(`Server running on https://0.0.0.0:${port}`);
});
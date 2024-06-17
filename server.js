import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import houseRoutes from './routes/houseRoutes.js';
import { connectDB } from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import os from 'os';
import fs from 'fs';
import https from 'https';
import http from 'http';

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

// Leer los archivos del certificado
const sslOptions = {
  key: fs.readFileSync('/usr/local/vesta/ssl/certificate.key'),  // Ruta al archivo de clave
  cert: fs.readFileSync('/usr/local/vesta/ssl/certificate.crt') // Ruta al archivo de certificado
};

// Crear el servidor HTTPS
https.createServer(sslOptions, app).listen(port, () => {
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
  console.log(`Server running on https://${serverAddress}:${port}`);
});

// Redirigir tráfico HTTP a HTTPS
const httpApp = express();
httpApp.get('*', (req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});
http.createServer(httpApp).listen(80, () => {
  console.log('Redireccionando tráfico HTTP a HTTPS');
});

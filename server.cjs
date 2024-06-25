
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const houseRoutes = require('./routes/houseRoutes.cjs');
const errorHandler = require('./middleware/errorHandler.cjs');

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/houses', houseRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

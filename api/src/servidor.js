// src/servidor.js
// Punto de entrada del back-end en Node con Express
// Levanta Express, configura middlewares y monta las rutas.

const express = require('express');
const cors = require('cors');
const estudiantesRouter = require('./rutas/estudiantes');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Configuración de CORS con restricción en producción (Criterio de Seguridad)
// En desarrollo permite cualquier origen local; en producción restringe al bucket S3 del frontend.
const ORIGEN_S3_FRONT = process.env.FRONTEND_URL || 'http://cuc-bp-equipojs-sitio-2026.s3-website-us-east-1.amazonaws.com';
const ES_PRODUCCION = process.env.NODE_ENV === 'production';

if (ES_PRODUCCION) {
  app.use(cors({ origin: ORIGEN_S3_FRONT }));
} else {
  app.use(cors());
}

// Entiende cuerpos de peticiones en JSON
app.use(express.json());

// Middleware compartido: registra cada petición entrante (DRY en back-end)
function registrar(req, res, siguiente) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  siguiente();
}
app.use(registrar);

// Rutas de verificación y salud
app.get('/salud', (req, res) => {
  res.status(200).json({ estado: 'ok', timestamp: new Date().toISOString() });
});

app.get('/equipo', (req, res) => {
  res.status(200).json({
    equipo: 'Equipo ZipZap (Equipo JS)',
    integrantes: ['Juan Bernal', 'Samuel Buelvas']
  });
});

// Montaje modular de las rutas de estudiantes
app.use('/estudiantes', estudiantesRouter);

// Manejador centralizado para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Si no está siendo ejecutado por pruebas automatizadas, inicia el servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PUERTO, () => {
    console.log(`API escuchando en el puerto ${PUERTO}`);
  });
}

module.exports = app;

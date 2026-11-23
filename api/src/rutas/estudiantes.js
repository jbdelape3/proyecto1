// src/rutas/estudiantes.js
// Capa de rutas: solo recibe la petición HTTP, invoca lógica/datos y responde.
// No contiene reglas de negocio directas ni números mágicos.

const express = require('express');
const router = express.Router();
const repositorio = require('../datos/repositorio');
const { estaAprobado, calcularPromedio, validarNota } = require('../logica/reglas-notas');

// Función compartida para responder de manera consistente (DRY en back-end)
function responder(res, codigo, datos) {
  return res.status(codigo).json(datos);
}

// 1. Ruta que lista todos los estudiantes (GET /estudiantes)
router.get('/', (req, res) => {
  const estudiantes = repositorio.obtenerTodos();
  return responder(res, 200, estudiantes);
});

// 2. Ruta que devuelve cálculo consolidado (GET /estudiantes/resumen)
router.get('/resumen', (req, res) => {
  const estudiantes = repositorio.obtenerTodos();
  const notas = repositorio.obtenerNotas();
  const promedio = calcularPromedio(notas);
  const aprobados = estudiantes.filter(e => estaAprobado(e.nota)).length;
  const reprobados = estudiantes.length - aprobados;

  return responder(res, 200, {
    promedio: Number(promedio.toFixed(3)),
    aprobados,
    reprobados,
    total: estudiantes.length
  });
});

// 3. Ruta POST que recibe datos y valida SIEMPRE en el servidor (POST /estudiantes)
router.post('/', (req, res) => {
  const { nombre, nota } = req.body;

  // Validación de presencia y tipo de nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return responder(res, 400, { error: 'El nombre es obligatorio y no puede estar vacío' });
  }

  // Validación de la nota mediante las reglas del negocio
  const validacion = validarNota(nota);
  if (!validacion.valido) {
    return responder(res, 400, { error: validacion.error });
  }

  const nuevo = repositorio.agregar({ nombre, nota });
  return responder(res, 201, nuevo);
});

module.exports = router;

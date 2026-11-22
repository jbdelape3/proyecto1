// src/logica/reglas-notas.js
// Reglas de negocio puras. No menciona req ni res para permitir pruebas sin levantar el servidor HTTP.

// Constantes con nombre para evitar números mágicos (DRY)
// La nota mínima aprobatoria es 3.0 por reglamento estudiantil, artículo 42.
// Si cambia el reglamento, cambia aquí y en ninguna otra parte del backend.
const NOTA_MINIMA_APROBATORIA = 3.0;
const NOTA_MINIMA_PERMITIDA = 0.0;
const NOTA_MAXIMA_PERMITIDA = 5.0;

/**
 * Determina si una nota aprueba según la regla de negocio.
 * @param {number} nota
 * @returns {boolean}
 */
function estaAprobado(nota) {
  return nota >= NOTA_MINIMA_APROBATORIA;
}

/**
 * Calcula el promedio de una lista de notas.
 * @param {number[]} notas
 * @returns {number}
 */
function calcularPromedio(notas) {
  if (!notas || notas.length === 0) return 0;
  const suma = notas.reduce((acumulado, n) => acumulado + n, 0);
  return suma / notas.length;
}

/**
 * Valida que una nota sea numérica y esté en el rango permitido (0 a 5).
 * @param {any} nota
 * @returns {{ valido: boolean, error?: string }}
 */
function validarNota(nota) {
  if (nota === undefined || nota === null || nota === '' || isNaN(Number(nota))) {
    return { valido: false, error: 'La nota es requerida y debe ser numérica' };
  }
  const valor = Number(nota);
  if (valor < NOTA_MINIMA_PERMITIDA || valor > NOTA_MAXIMA_PERMITIDA) {
    return {
      valido: false,
      error: `La nota debe estar entre ${NOTA_MINIMA_PERMITIDA} y ${NOTA_MAXIMA_PERMITIDA}`
    };
  }
  return { valido: true };
}

module.exports = {
  NOTA_MINIMA_APROBATORIA,
  NOTA_MINIMA_PERMITIDA,
  NOTA_MAXIMA_PERMITIDA,
  estaAprobado,
  calcularPromedio,
  validarNota
};

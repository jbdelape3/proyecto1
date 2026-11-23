// src/datos/repositorio.js
// Capa de datos: de donde salen y donde se guardan los datos del sistema.
// Desacoplada de las rutas HTTP y de la lógica de negocio.

let estudiantes = [
  { id: 1, nombre: 'Ana', nota: 4.5 },
  { id: 2, nombre: 'Luis', nota: 2.8 },
  { id: 3, nombre: 'Carlos', nota: 3.5 },
  { id: 4, nombre: 'Maria', nota: 4.0 }
];

/**
 * Retorna todos los estudiantes registrados.
 * @returns {Array<{id: number, nombre: string, nota: number}>}
 */
function obtenerTodos() {
  return [...estudiantes];
}

/**
 * Retorna solo el arreglo de valores numéricos de las notas.
 * @returns {number[]}
 */
function obtenerNotas() {
  return estudiantes.map(e => e.nota);
}

/**
 * Agrega un nuevo estudiante al almacén de datos.
 * @param {{ nombre: string, nota: number }} datos
 * @returns {{ id: number, nombre: string, nota: number }}
 */
function agregar(datos) {
  const nuevo = {
    id: Date.now(),
    nombre: datos.nombre.trim(),
    nota: Number(datos.nota)
  };
  estudiantes.push(nuevo);
  return nuevo;
}

/**
 * Reinicia los datos a los valores iniciales (útil para pruebas o reinicios).
 */
function reiniciar() {
  estudiantes = [
    { id: 1, nombre: 'Ana', nota: 4.5 },
    { id: 2, nombre: 'Luis', nota: 2.8 },
    { id: 3, nombre: 'Carlos', nota: 3.5 },
    { id: 4, nombre: 'Maria', nota: 4.0 }
  ];
}

module.exports = {
  obtenerTodos,
  obtenerNotas,
  agregar,
  reiniciar
};

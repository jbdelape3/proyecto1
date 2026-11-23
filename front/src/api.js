// src/api.js
// DRY aplicado al despliegue: la dirección de la API vive en un solo lugar centralizado
// y cambiar de ambiente no obliga a tocar el código de los componentes.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function obtenerEstudiantes() {
  const respuesta = await fetch(`${BASE}/estudiantes`);
  if (!respuesta.ok) {
    throw new Error('No se pudo cargar la lista de estudiantes');
  }
  return respuesta.json();
}

export async function obtenerResumen() {
  const respuesta = await fetch(`${BASE}/estudiantes/resumen`);
  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el resumen de notas');
  }
  return respuesta.json();
}

export async function agregarEstudiante({ nombre, nota }) {
  const respuesta = await fetch(`${BASE}/estudiantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, nota: Number(nota) })
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error al agregar estudiante');
  }
  return datos;
}

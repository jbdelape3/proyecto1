const http = require('http');


const PUERTO = process.env.PORT || 80;
const NOTA_MINIMA_APROBATORIA = 3.0;
const NOTAS_DEL_CURSO = [4.5, 3.5, 2.5, 4.0];
const DATOS_EQUIPO = {
  equipo: 'Equipo ZipZap',
  integrantes: ['Juan Bernal', 'Samuel Buelvas']
};


function calcularPromedio(notas) {
  return notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
}

function estaAprobado(promedio) {
  return promedio >= NOTA_MINIMA_APROBATORIA;
}


function responder(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos, null, 2));
}

function responderSalud(res) {
  responder(res, 200, { estado: 'ok' });
}

function responderEquipo(res) {
  responder(res, 200, DATOS_EQUIPO);
}

function responderNotas(res) {
  const promedio = calcularPromedio(NOTAS_DEL_CURSO);
  responder(res, 200, { promedio: promedio, aprobado: estaAprobado(promedio) });
}

function responderNoEncontrada(res) {
  responder(res, 404, { error: 'Ruta no encontrada' });
}


const rutas = {
  '/salud': responderSalud,
  '/equipo': responderEquipo,
  '/notas': responderNotas
};

const servidor = http.createServer((req, res) => {
  const manejador = rutas[req.url] || responderNoEncontrada;
  manejador(res);
});

servidor.listen(PUERTO);
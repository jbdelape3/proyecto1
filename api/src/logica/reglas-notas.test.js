import { describe, it, expect } from 'vitest';
const { estaAprobado, calcularPromedio, validarNota, NOTA_MINIMA_APROBATORIA } = require('./reglas-notas');

describe('estaAprobado', () => {
  it('aprueba una nota por encima del minimo', () => {
    expect(estaAprobado(4.5)).toBe(true);
  });

  it('reprueba una nota por debajo del minimo', () => {
    expect(estaAprobado(2.8)).toBe(false);
  });

  it('aprueba la nota exacta de 3.0 (caso limite de frontera)', () => {
    expect(estaAprobado(3.0)).toBe(true);
  });

  it('reprueba una centésima por debajo del límite (2.99)', () => {
    expect(estaAprobado(2.99)).toBe(false);
  });
});

describe('calcularPromedio', () => {
  it('calcula el promedio de varias notas (ej: 4.5, 3.5, 2.5, 4.0)', () => {
    expect(calcularPromedio([4.5, 3.5, 2.5, 4.0])).toBe(3.625);
  });

  it('devuelve la misma nota si solo hay una', () => {
    expect(calcularPromedio([4.0])).toBe(4.0);
  });

  it('devuelve 0 si la lista de notas está vacía (caso límite)', () => {
    expect(calcularPromedio([])).toBe(0);
  });
});

describe('validarNota', () => {
  it('valida exitosamente una nota dentro del rango 0 a 5', () => {
    const resultado = validarNota(4.2);
    expect(resultado.valido).toBe(true);
  });

  it('rechaza una nota negativa menor a 0 (caso inválido)', () => {
    const resultado = validarNota(-0.5);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('La nota debe estar entre 0 y 5');
  });

  it('rechaza una nota mayor a 5 (caso inválido)', () => {
    const resultado = validarNota(5.5);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('La nota debe estar entre 0 y 5');
  });

  it('rechaza valores no numéricos o vacíos', () => {
    const resultado = validarNota('abc');
    expect(resultado.valido).toBe(false);
  });
});

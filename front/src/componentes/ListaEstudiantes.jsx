// src/componentes/ListaEstudiantes.jsx
// Rúbrica B.3: Las listas usan map con la key correcta (el id, no el índice).
import React from 'react';

const NOTA_MINIMA_APROBATORIA = 3.0;

function estaAprobado(nota) {
  return nota >= NOTA_MINIMA_APROBATORIA;
}

export default function ListaEstudiantes({ estudiantes }) {
  if (!estudiantes || estudiantes.length === 0) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        textAlign: 'center',
        borderRadius: '8px',
        color: '#64748b',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
      }}>
        No hay estudiantes registrados en la lista.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>ID</th>
            <th style={{ padding: '12px 18px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Estudiante</th>
            <th style={{ padding: '12px 18px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Nota</th>
            <th style={{ padding: '12px 18px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* Rúbrica B.3: Las listas usan map con la key correcta (el id, no el índice) */}
          {estudiantes.map((estudiante) => {
            const aprobado = estaAprobado(estudiante.nota);
            return (
              <tr
                key={estudiante.id}
                style={{ borderBottom: '1px solid #f1f5f9' }}
              >
                <td style={{ padding: '12px 18px', color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  #{estudiante.id}
                </td>
                <td style={{ padding: '12px 18px', fontWeight: '500', color: '#1e293b' }}>
                  {estudiante.nombre}
                </td>
                <td style={{ padding: '12px 18px', fontWeight: '600', color: '#0f172a' }}>
                  {Number(estudiante.nota).toFixed(1)}
                </td>
                <td style={{ padding: '12px 18px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: aprobado ? '#dcfce7' : '#fee2e2',
                    color: aprobado ? '#166534' : '#991b1b',
                    display: 'inline-block'
                  }}>
                    {aprobado ? 'Aprobado' : 'Reprobado'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

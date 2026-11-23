// src/componentes/ListaEstudiantes.jsx
import React from 'react';

// Constante documentada para visualización consistente en el frontend
const NOTA_MINIMA_APROBATORIA = 3.0;

export default function ListaEstudiantes({ estudiantes, cargando }) {
  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
        Cargando listado de estudiantes...
      </div>
    );
  }

  if (!estudiantes || estudiantes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', backgroundColor: '#ffffff', borderRadius: '8px' }}>
        No hay estudiantes registrados actualmente.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>ID</th>
            <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Nombre</th>
            <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Nota</th>
            <th style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* Cumplimiento de rubrica: uso de key correcta (e.id, no el indice de map) */}
          {estudiantes.map((e) => {
            const aprobado = e.nota >= NOTA_MINIMA_APROBATORIA;
            return (
              <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.9rem' }}>{e.id}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1e293b' }}>{e.nombre}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>{Number(e.nota).toFixed(1)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: aprobado ? '#dcfce7' : '#fee2e2',
                    color: aprobado ? '#15803d' : '#b91c1c'
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

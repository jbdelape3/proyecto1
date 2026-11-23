// src/componentes/TarjetaMetrica.jsx
// Componente reutilizable utilizado en tres lugares distintos para cumplir con DRY en front-end
import React from 'react';

export default function TarjetaMetrica({ titulo, valor, descripcion, tipo = 'info' }) {
  const coloresBorde = {
    info: '#3b82f6',
    exito: '#10b981',
    advertencia: '#f59e0b'
  };

  return (
    <div style={{
      borderLeft: `5px solid ${coloresBorde[tipo] || coloresBorde.info}`,
      borderRadius: '8px',
      padding: '16px 20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      backgroundColor: '#ffffff'
    }}>
      <h3 style={{
        margin: 0,
        fontSize: '0.85rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600'
      }}>
        {titulo}
      </h3>
      <p style={{
        margin: '8px 0 4px',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#0f172a'
      }}>
        {valor}
      </p>
      {descripcion && (
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {descripcion}
        </span>
      )}
    </div>
  );
}

// src/componentes/FormularioEstudiante.jsx
import React, { useState } from 'react';

export default function FormularioEstudiante({ onEstudianteCreado }) {
  const [nombre, setNombre] = useState('');
  const [nota, setNota] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');

    if (!nombre.trim()) {
      setErrorLocal('El nombre del estudiante es obligatorio');
      return;
    }

    const valorNota = Number(nota);
    if (isNaN(valorNota) || valorNota < 0 || valorNota > 5) {
      setErrorLocal('La nota debe ser un número válido entre 0.0 y 5.0');
      return;
    }

    try {
      setEnviando(true);
      await onEstudianteCreado({ nombre: nombre.trim(), nota: valorNota });
      setNombre('');
      setNota('');
    } catch (err) {
      setErrorLocal(err.message || 'Error al guardar el estudiante');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      marginBottom: '28px'
    }}>
      <h2 style={{ margin: '0 0 16px', fontSize: '1.25rem', color: '#1e293b' }}>
        Registrar Nuevo Estudiante
      </h2>

      {errorLocal && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          padding: '10px 14px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '0.9rem'
        }}>
          {errorLocal}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Pedro Martínez"
            required
            disabled={enviando}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
            Nota final (0.0 a 5.0)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: 3.8"
            required
            disabled={enviando}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        style={{
          marginTop: '16px',
          backgroundColor: enviando ? '#94a3b8' : '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: enviando ? 'not-allowed' : 'pointer'
        }}
      >
        {enviando ? 'Guardando...' : 'Guardar Estudiante'}
      </button>
    </form>
  );
}

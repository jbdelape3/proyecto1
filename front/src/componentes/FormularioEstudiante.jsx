// src/componentes/FormularioEstudiante.jsx
// Manejo de estado local con useState y validación previa antes del envío a la API
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
      setErrorLocal('El nombre es obligatorio.');
      return;
    }

    const valorNota = parseFloat(nota);
    if (isNaN(valorNota) || valorNota < 0 || valorNota > 5) {
      setErrorLocal('La nota debe ser un número entre 0.0 y 5.0');
      return;
    }

    try {
      setEnviando(true);
      await onEstudianteCreado({ nombre: nombre.trim(), nota: valorNota });
      setNombre('');
      setNota('');
    } catch (err) {
      setErrorLocal(err.message || 'Error al guardar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#ffffff',
      padding: '20px 24px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      marginBottom: '28px'
    }}>
      <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#1e293b', marginBottom: '16px' }}>
        Registrar Calificación de Estudiante
      </h2>

      {errorLocal && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '10px 14px',
          borderRadius: '6px',
          marginBottom: '14px',
          fontSize: '0.9rem'
        }}>
          {errorLocal}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
        gap: '14px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
            Nombre completo
          </label>
          <input
            type="text"
            placeholder="Ej. Sofia Vergara"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={enviando}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
            Nota (0.0 a 5.0)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="Ej. 4.2"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            disabled={enviando}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '11px 22px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: enviando ? 'not-allowed' : 'pointer',
            opacity: enviando ? 0.7 : 1,
            height: '42px'
          }}
        >
          {enviando ? 'Guardando...' : 'Agregar'}
        </button>
      </div>
    </form>
  );
}

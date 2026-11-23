// src/App.jsx
import React, { useState, useEffect } from 'react';
import { obtenerEstudiantes, obtenerResumen, agregarEstudiante } from './api';
import TarjetaMetrica from './componentes/TarjetaMetrica';
import FormularioEstudiante from './componentes/FormularioEstudiante';
import ListaEstudiantes from './componentes/ListaEstudiantes';

export default function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [resumen, setResumen] = useState({ promedio: 0, aprobados: 0, reprobados: 0, total: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [notificacion, setNotificacion] = useState('');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      const [lista, res] = await Promise.all([
        obtenerEstudiantes(),
        obtenerResumen()
      ]);
      setEstudiantes(lista);
      setResumen(res);
    } catch (err) {
      setError(err.message || 'Error al conectar con la API');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearEstudiante = async (datos) => {
    const nuevo = await agregarEstudiante(datos);
    setNotificacion(`Estudiante "${nuevo.nombre}" registrado exitosamente con nota ${nuevo.nota}`);
    setTimeout(() => setNotificacion(''), 4000);
    await cargarDatos();
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '36px 20px',
      color: '#0f172a'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '28px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: '700' }}>
            Control de Notas Estudiantiles
          </h1>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Proyecto Final · Buenas Prácticas de Desarrollo de Software (CUC) · Equipo ZipZap (Juan Bernal & Samuel Buelvas)
          </p>
        </header>

        {notificacion && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#15803d',
            padding: '12px 18px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontWeight: '500',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {notificacion}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 18px',
            borderRadius: '6px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>Error de conexión con la API:</strong> {error}
            </div>
            <button
              onClick={cargarDatos}
              style={{
                backgroundColor: '#b91c1c',
                color: '#ffffff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Criterio DRY: TarjetaMetrica es un componente reutilizable usado en tres lugares distintos */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Uso 1: Promedio General */}
          <TarjetaMetrica
            titulo="Promedio General"
            valor={cargando ? '...' : (resumen.promedio || 0).toFixed(2)}
            descripcion="Escala de 0.0 a 5.0"
            tipo="info"
          />

          {/* Uso 2: Estudiantes Aprobados */}
          <TarjetaMetrica
            titulo="Estudiantes Aprobados"
            valor={cargando ? '...' : `${resumen.aprobados || 0} de ${resumen.total || 0}`}
            descripcion="Umbral mínimo: 3.0"
            tipo="exito"
          />

          {/* Uso 3: Total Estudiantes Registrados */}
          <TarjetaMetrica
            titulo="Total Registrados"
            valor={cargando ? '...' : (resumen.total || 0)}
            descripcion="Estudiantes en el curso"
            tipo="advertencia"
          />
        </section>

        <FormularioEstudiante onEstudianteCreado={handleCrearEstudiante} />

        <section>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
              Listado de Estudiantes y Notas
            </h2>
            <button
              onClick={cargarDatos}
              disabled={cargando}
              style={{
                backgroundColor: '#e2e8f0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#334155'
              }}
            >
              {cargando ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          <ListaEstudiantes estudiantes={estudiantes} />
        </section>
      </div>
    </div>
  );
}

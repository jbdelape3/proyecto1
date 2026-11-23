# Sistema de Gestión de Calificaciones y Estudiantes

Sistema integral para el registro, consulta y análisis estadístico de calificaciones estudiantiles, diseñado para docentes y estudiantes de la Universidad de la Costa (CUC).

## Integrantes

- **Juan Bernal**: Desarrollo del backend en Node.js y Express con arquitectura por capas (rutas, lógica de negocio y datos), configuración de pruebas unitarias con Vitest y despliegue del frontend en Amazon S3.
- **Samuel Buelvas**: Desarrollo del frontend modular en React con Vite, implementación de componentes reutilizables (DRY), manejo de estados con hooks, integración con la API REST y configuración de infraestructura en AWS EC2 y S3.

## Tecnologias

- **Front-end**: React 18, Vite 6, JavaScript (ES6+), CSS modular.
- **Back-end**: Node.js, Express 4, CORS.
- **Testing**: Vitest 3.
- **Infraestructura Cloud**: AWS S3 (Hosting estático público y bucket privado de respaldo), AWS EC2 (Servidor de API en Linux).
- **Control de Versiones**: Git, GitHub (Flujo GitFlow con ramas `main`, `dev`, `pruebas` y `feature/*`, Conventional Commits y Pull Requests revisados).

## Como levantarlo en local

### 1. Clonar el repositorio
```bash
git clone https://github.com/jbdelape3/proyecto1.git
cd proyecto1
```

### 2. Levantar la API (Back-end)
```bash
cd api
npm install
npm run dev
```
*La API estará escuchando en `http://localhost:3000`.*

### 3. Levantar la interfaz (Front-end)
En una nueva terminal:
```bash
cd front
npm install
npm run dev
```
*La aplicación web estará disponible en `http://localhost:5173`.*

### Variables de entorno necesarias y de dónde se sacan
El proyecto cuenta con archivos `.env.example` en la raíz, en `api/` y en `front/` como plantilla sin secretos sensibles:

- **Back-end (`api/.env`):**
  - `PORT`: Puerto donde corre la API (por defecto `3000`).
  - `NODE_ENV`: Ambiente de ejecución (`development` o `production`).
  - `FRONTEND_URL`: URL del bucket S3 del frontend permitida por la política de CORS en producción (ej. `http://cuc-bp-equipojs-sitio-2026.s3-website-us-east-1.amazonaws.com`).
- **Front-end (`front/.env.development` y `front/.env.production`):**
  - `VITE_API_URL`: Dirección base de la API. En local se define como `http://localhost:3000`, y en producción como `http://SU-IP-PUBLICA:3000`.

## Endpoints de la API

| Método | Ruta | Qué hace | Respuesta |
| :--- | :--- | :--- | :--- |
| **GET** | `/salud` | Verificación de estado del servidor | `200` · `{"estado": "ok", "timestamp": "..."}` |
| **GET** | `/equipo` | Información del equipo de desarrollo | `200` · `{"equipo": "Equipo ZipZap", "integrantes": [...]}` |
| **GET** | `/estudiantes` | Lista todos los estudiantes registrados | `200` · Arreglo de objetos `[{ id, nombre, nota }]` |
| **GET** | `/estudiantes/resumen` | Estadísticas consolidadas (promedio, total, aprobados, reprobados) | `200` · Objeto con métricas calculadas |
| **POST** | `/estudiantes` | Agrega un nuevo estudiante con validación de nombre y rango de nota (0.0 - 5.0) | `201` · Objeto creado<br>`400` · `{"error": "mensaje descriptivo"}` |

## Como correr las pruebas

Las pruebas unitarias están automatizadas con **Vitest** y verifican las reglas de negocio del sistema de forma aislada (sin depender de peticiones HTTP ni requerir levantar el servidor).

Para ejecutar todas las pruebas:
```bash
# Desde la carpeta api:
cd api
npm test

# O desde la raíz del repositorio:
npm test
```

Para correr las pruebas en modo observador (watch):
```bash
cd api
npm run test:watch
```

### Evidencia de Casos Probados
1. **`estaAprobado`**:
   - Aprueba nota superior al mínimo (ej. `4.5`).
   - Reprueba nota inferior al mínimo (ej. `2.8`).
   - **Caso límite frontera**: Aprueba la nota exacta de `3.0`.
   - Reprueba una centésima menor a la frontera (`2.99`).
2. **`calcularPromedio`**:
   - Promedio de un conjunto de calificaciones (`[4.5, 3.5, 2.5, 4.0] = 3.625`).
   - Promedio de una lista con una sola nota (`[4.0] = 4.0`).
   - **Caso límite**: Lista vacía (`[] = 0`).
3. **`validarNota`**:
   - Valida nota correcta en rango (`4.2`).
   - **Caso inválido**: Nota negativa (`-0.5`).
   - **Caso inválido**: Nota mayor al tope (`5.5`).
   - **Caso inválido**: Valores no numéricos (`'abc'`).

> **Prueba intencional de fallo:** Si se modifica la regla en `api/src/logica/reglas-notas.js` cambiando `nota >= NOTA_MINIMA_APROBATORIA` por `nota > NOTA_MINIMA_APROBATORIA`, la prueba del caso límite `3.0` falla de inmediato, demostrando que la suite de pruebas valida con exactitud el cumplimiento de las reglas del negocio.

## Despliegue

### Dónde está publicado

| Integrante | Componente | URL / Identificador | Tipo de Acceso |
| :--- | :--- | :--- | :--- |
| **Juan Bernal** | Frontend (S3 Público) | `http://cuc-bp-equipojs-sitio-2026.s3-website-us-east-1.amazonaws.com` | Web pública (200 OK) |
| **Juan Bernal** | Almacenamiento Privado (S3) | `cuc-bp-eqjs-bernal-privado-2026` | Bloqueado al público (403 Forbidden) |
| **Samuel Buelvas** | Frontend (S3 Público) | `http://cuc-bp-equipojs-buelvas-sitio-2026.s3-website-us-east-1.amazonaws.com` | Web pública (200 OK) |
| **Samuel Buelvas** | Almacenamiento Privado (S3) | `cuc-bp-eqjs-buelvas-privado-2026` | Bloqueado al público (403 Forbidden) |
| **API Backend** | Servidor Node/Express (EC2) | `http://SU-IP-EC2:3000` | Puerto 3000 abierto en Security Group |

### Pasos para volver a desplegarlo

#### 1. Despliegue del Backend en AWS EC2
1. Iniciar la instancia EC2 (Ubuntu / Amazon Linux) en AWS Learner Lab.
2. Configurar el **Security Group**: permitir únicamente tráfico entrante en el puerto de la API (`3000`) desde `0.0.0.0/0` (y SSH temporal solo desde la IP propia si se requiere mantenimiento, cerrándolo al finalizar).
3. Clonar el repositorio en la instancia o transferir la carpeta `api/`.
4. Instalar dependencias e iniciar el servicio con Node o gestor de procesos PM2:
   ```bash
   cd api
   npm install --omit=dev
   NODE_ENV=production PORT=3000 node src/servidor.js
   ```
5. Comprobar desde el navegador con `http://<IP-PUBLICA>:3000/salud`.

#### 2. Despliegue del Frontend en AWS S3
1. Configurar la URL de la API en `front/.env.production`:
   ```env
   VITE_API_URL=http://<IP-PUBLICA-EC2>:3000
   ```
2. Generar el paquete optimizado de producción:
   ```bash
   cd front
   npm run build
   ```
   *(Esto compila los activos estáticos HTML, CSS y JS minimizados dentro de la carpeta `dist/`).*
3. Subir el **contenido** de la carpeta `dist/` a la raíz del bucket S3 público configurado como Static Website Hosting.
4. Verificar el acceso abriendo la URL del bucket en el navegador y realizando operaciones de lectura y guardado de estudiantes conectadas a la API en EC2.
5. Una vez tomadas las evidencias requeridas para la entrega, detener o terminar las instancias y recursos en AWS Learner Lab para salvaguardar el presupuesto.

---

## Aplicación del Principio DRY (Don't Repeat Yourself)

### Front-end
- **Componente Reutilizable (`TarjetaMetrica.jsx`):** Empleado en tres lugares distintos dentro del panel principal:
  1. *Tarjeta 1*: Promedio General.
  2. *Tarjeta 2*: Estudiantes Aprobados.
  3. *Tarjeta 3*: Total de Estudiantes Registrados.
- **Centralización del consumo de la API (`src/api.js`):** La variable base `VITE_API_URL` y las llamadas fetch se concentran en un único módulo, evitando direcciones URL hardcodeadas dispersas en componentes.

### Back-end
- **Función compartida `responder(res, codigo, datos)`:** Estandariza la estructura de retorno JSON y código de estado en todas las rutas del servidor.
- **Middleware compartido `registrar(req, res, siguiente)`:** Manejo centralizado de bitácora de peticiones entrantes.
- **Sin números mágicos:** Las constantes de umbral (`NOTA_MINIMA_APROBATORIA = 3.0`, `NOTA_MINIMA_PERMITIDA = 0.0`, `NOTA_MAXIMA_PERMITIDA = 5.0`) residen en `reglas-notas.js`.

### Tabla de Medición de DRY

| Regla / Elemento | Copias eliminadas | Archivos a tocar hoy si cambia la regla |
| :--- | :---: | :---: |
| **Nota mínima aprobatoria (3.0)** | 4 | **1 solo archivo** (`api/src/logica/reglas-notas.js`) |
| **Componente de Tarjeta de Métricas** | 2 | **1 solo archivo** (`front/src/componentes/TarjetaMetrica.jsx`) |
| **Formato de respuesta JSON de la API** | 5 | **1 solo archivo** (`api/src/rutas/estudiantes.js`) |
| **URL Base de conexión con el Backend** | 3 | **1 solo archivo** (`front/src/api.js` o variable de entorno) |

---

## Reporte de Seguridad y Auditoría de Dependencias

### 1. Validación en el Servidor
Toda petición `POST /estudiantes` valida rigurosamente en el servidor tanto la presencia del nombre como el rango numérico permitido (0.0 a 5.0). Si la petición es inválida, responde con código `400 Bad Request` y un mensaje explícito de error.

### 2. Gestión de Secretos en Git
El archivo `.gitignore` excluye completamente `.env`, `.env.*`, `node_modules/` y directorios de compilación `dist/`. Únicamente se incluye `.env.example` con variables de referencia y valores ficticios.

### 3. Restricción de CORS
En ambiente de producción (`NODE_ENV=production`), CORS restringe el acceso exclusivamente al origen del bucket de frontend en Amazon S3, evitando peticiones no autorizadas desde otros dominios.

### 4. Auditoría de Dependencias (`npm audit`)
- **Frontend (`front/`):** `0 vulnerabilities` tras analizar 67 paquetes.
- **Backend (`api/`):** Al ejecutar `npm audit` se reportan 3 vulnerabilidades (1 moderada y 2 críticas) asociadas a `vitest` (`@vitest/mocker` y `tinypool`).
- **Análisis de riesgo:** Dichas dependencias corresponden exclusivamente a herramientas de desarrollo y pruebas automatizadas (`devDependencies`), por lo que no forman parte del runtime de producción desplegado en AWS EC2, mitigando el vector de exposición en el servidor público.

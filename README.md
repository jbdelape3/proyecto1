# Gestor de Notas Estudiantiles

Sistema web integral para el registro, consulta y cálculo consolidado del rendimiento académico de estudiantes, desarrollado con buenas prácticas de ingeniería de software para la Universidad de la Costa (CUC).

## Integrantes
- **Samuel Buelvas** (GitHub: `Holakabron321`): Arquitectura y desarrollo del backend con Node.js y Express, desacoplamiento en capas (rutas, lógica pura y persistencia), pruebas unitarias con Vitest, control de versiones y configuración de despliegue.
- **Juan Bernal** (GitHub: `jbdelape3`): Desarrollo de la interfaz de usuario en React con Vite, componentes reutilizables, consumo asíncrono de la API, infraestructura AWS en S3/EC2 y documentación de arquitectura.

## Tecnologias
- **Frontend:** React 18, Vite 6, JavaScript moderno (ESModules), CSS responsive.
- **Backend:** Node.js, Express 4, CORS.
- **Pruebas Automatizadas:** Vitest 3.
- **Infraestructura Cloud:** AWS S3 (Static Website Hosting público y almacenamiento de soporte privado) y AWS EC2 (Servidor API REST).
- **Control de Versiones:** Git, GitHub Flow, Conventional Commits.

## Como levantarlo en local

### Prerrequisitos
- Node.js instalado (v18 o superior).
- npm (v9 o superior).

### 1. Clonar el repositorio
```bash
git clone https://github.com/jbdelape3/proyecto1.git
cd proyecto1
```

### 2. Configurar variables de entorno
Copiar los archivos de ejemplo en el backend y frontend:
```bash
cp api/.env.example api/.env
cp front/.env.example front/.env.development
```

### 3. Levantar la API (Backend)
```bash
cd api
npm install
npm run dev
```
La API quedará escuchando en `http://localhost:3000`.

### 4. Levantar la Interfaz (Frontend)
En una nueva terminal:
```bash
cd front
npm install
npm run dev
```
La aplicación web abrirá en el navegador en `http://localhost:5173`.

## Endpoints de la API

| Método | Ruta | Qué hace | Código y Respuesta esperada |
| :--- | :--- | :--- | :--- |
| **GET** | `/estudiantes` | Retorna el listado completo de estudiantes registrados | `200 OK` · Arreglo JSON de objetos estudiante |
| **GET** | `/estudiantes/resumen` | Retorna el consolidado de métricas académicas (promedio general, aprobados, reprobados y total) | `200 OK` · Objeto JSON con cálculos procesados |
| **POST** | `/estudiantes` | Registra un nuevo estudiante tras validar nombre y nota en el servidor | `201 Created` · Objeto del estudiante creado con ID autogenerado<br>`400 Bad Request` · JSON con mensaje descriptivo de error |
| **GET** | `/salud` | Endpoint de healthcheck para monitoreo del servidor | `200 OK` · `{ estado: "ok", timestamp: ... }` |
| **GET** | `/equipo` | Retorna los nombres de los integrantes del equipo | `200 OK` · `{ equipo: "...", integrantes: [...] }` |

## Como correr las pruebas

El proyecto utiliza **Vitest** para ejecutar pruebas unitarias sobre la lógica de negocio sin depender del servidor HTTP.

Para ejecutar la suite de pruebas automatizadas:
```bash
cd api
npm test
```
O de manera continua mientras se edita el código:
```bash
cd api
npm run test:watch
```

La suite incluye 11 pruebas unitarias divididas en 3 bloques (`estaAprobado`, `calcularPromedio`, `validarNota`), cubriendo casos normales y casos límite de frontera (como nota exacta de 3.0, nota 2.99, arreglos vacíos y validación de rangos numéricos).

## Despliegue

### Ubicación de los recursos en AWS

| Integrante | Rol / Recurso | Identificador / URL | Estado de acceso |
| :--- | :--- | :--- | :--- |
| **Samuel Buelvas** | Frontend (S3 Público) | `http://cuc-bp-equipojs-buelvas-sitio-2026.s3-website-us-east-1.amazonaws.com` | Web pública (200 OK) |
| **Samuel Buelvas** | Almacenamiento Privado (S3) | `cuc-bp-eqjs-buelvas-privado-2026` | Bloqueado al público (403 Forbidden) |
| **Juan Bernal** | Frontend (S3 Público) | `http://cuc-bp-equipojs-sitio-2026.s3-website-us-east-1.amazonaws.com` | Web pública (200 OK) |
| **Juan Bernal** | Almacenamiento Privado (S3) | `cuc-bp-eqjs-bernal-privado-2026` | Bloqueado al público (403 Forbidden) |
| **API Backend** | Servidor Node/Express (EC2) | `http://SU-IP-EC2:3000` | Puerto 3000 restringido en Security Group |

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

## Principio DRY (Don't Repeat Yourself)

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

## Seguridad y Auditoría de Dependencias

### 1. Validación en el Servidor
Toda petición `POST /estudiantes` valida rigurosamente en el servidor tanto la presencia del nombre como el rango numérico permitido (0.0 a 5.0). Si la petición es inválida, responde con código `400 Bad Request` y un mensaje explícito de error.

### 2. Gestión de Secretos en Git
El archivo `.gitignore` excluye completamente `.env`, `.env.*`, `node_modules/` y directorios de compilación `dist/`. Únicamente se incluye `.env.example` con variables de referencia y valores ficticios.

### 3. Restricción de CORS
En ambiente de producción (`NODE_ENV=production`), CORS restringe el acceso exclusivamente al origen del bucket de frontend de Samuel Buelvas en Amazon S3 (`http://cuc-bp-equipojs-buelvas-sitio-2026.s3-website-us-east-1.amazonaws.com`), evitando peticiones no autorizadas desde otros dominios.

### 4. Auditoría de Dependencias (`npm audit`)
- **Frontend (`front/`):** `0 vulnerabilities` tras analizar los paquetes instalados.
- **Backend (`api/`):** Al ejecutar `npm audit` se reportan 3 vulnerabilidades (1 moderada y 2 críticas) asociadas a dependencias indirectas de desarrollo de `vitest` (`@vitest/mocker` y `tinypool`).
- **Análisis de riesgo:** Dichas dependencias corresponden exclusivamente a herramientas de desarrollo y pruebas automatizadas (`devDependencies`), por lo que no forman parte del runtime de producción desplegado en AWS EC2, mitigando el vector de exposición en el servidor público.

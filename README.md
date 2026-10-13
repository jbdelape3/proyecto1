Samuel Buelvas Juan Bernal

Conectamos personas, organizamos información y transformamos ideas en soluciones: un gestor de contactos creado por estudiantes de Ingeniería de Sistemas.

Funcionalidades: Agregar contactos

Permitir registrar información básica como: Nombre, Apellido, Número de teléfono, Correo electrónico, Dirección
Editar y eliminar contactos
Marcar contactos como favoritos


## Despliegue en AWS
| Integrante | URL del sitio | Bucket publico | Bucket privado |
|---|---|---|---|
| Juan Benral | http://cuc-bp-equipojs-sitio-2026.s3-website-us-east-1.amazonaws.com | cuc-bp-equipojs--sitio-2026 | cuc-bp-eqjs-bernal-privado-2026 |
| Samuel Buelvas | http://cuc-bp-equipojs-buelvas-sitio-2026.s3-website-us-east-1.amazonaws.com | cuc-bp-eqjs-buelvas-sitio-2026 | cuc-bp-eqjs-buelvas-privado-2026 |

El sitio dejó de estar en Netlify y pasó a S3 para tener todo en nuestra propia cuenta de AWS, con más control y sin depender de un servicio externo. Usamos dos buckets: uno guarda y muestra los archivos del sitio, y el otro solo redirige a los visitantes que entran por la dirección alternativa hacia el principal.

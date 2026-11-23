 ADR-001: Diseño del almacenamiento del proyecto en Amazon S3- Fecha:- Autor:- Estado: Aceptada
## Contexto
El proyecto consistía originalmente en una aplicación web de gestor de contactos cuyo backend está desarrollado en Python. En las etapas iniciales, el sistema no contaba con un esquema formal de almacenamiento desacoplado en la nube y utilizaba un único bucket privado en Amazon S3 con un archivo de prueba provisional. Para desplegar la solución en producción de manera segura y escalable, era necesario definir una arquitectura de almacenamiento en S3 que resolviera la separación entre los activos web públicos (interfaz de usuario) y la información privada de la aplicación (bases de datos, respaldos, configuraciones y registros de auditoría). El problema principal a resolver era garantizar que los componentes estáticos estuvieran accesibles públicamente para el cliente sin poner en riesgo la privacidad de los datos personales de los contactos ni la seguridad del servidor backend.
## Decision
Se adoptó la siguiente estructura de almacenamiento y políticas en Amazon S3:

Estructura de Buckets y Control de Acceso:

Bucket Público: Diseñado para alojar el sitio web estático. Permite el acceso de lectura público (Cualquier visitante) para servir la interfaz web.

Bucket Privado: Diseñado para almacenar datos sensibles del sistema. Se encuentra cerrado al público general y solo es accesible por integrantes autorizados y el backend en Python.

Organización por Prefijos (Carpetas lógicas):

En Bucket Público:

web/ (o static/): Para archivos index.html, styles.css y scripts de la interfaz web.

images/: Para logotipos e imágenes públicas de la página.

En Bucket Privado:

database/: Para archivos de base de datos (.db / .json).

backups/: Para copias de seguridad comprimidas (.zip).

config/: Para parámetros y credenciales del backend (.env).

logs/: Para registros de eventos del servidor (app.log).

Versionado:

Activado en el bucket de activos críticos/producción para proteger los archivos web de borrados o modificaciones accidentales y permitir restauraciones rápidas mediante la eliminación de delete markers.

Reglas de Ciclo de Vida (Lifecycle Rules):

Transición a S3 Standard-IA (Acceso poco frecuente): A los 30 días (mínimo requerido por AWS para maximizar rentabilidad).

Transición a S3 Glacier (Archivado): A los 60 días para mover respaldos e historiales no consultados a almacenamiento de bajo costo.

Eliminación de versiones no vigentes: A los 90 días para mantener historial de recuperaciones sin acumular costos indefinidos.
## Alternativas consideradas
Utilizar un único Bucket Público con carpetas restringidas:

Razón de descarte: Presentaba un alto riesgo de configuración errónea (security misconfiguration). Exponer la raíz del bucket públicamente podía derivar en la filtración accidental de bases de datos o archivos .env si fallaba una política de carpeta individual.

Almacenar todos los archivos y bases de datos directamente en el disco local de la máquina del backend:

Razón de descarte: Impedía la escalabilidad horizontal de la aplicación, desacoplada de la infraestructura en la nube, y aumentaba drásticamente el riesgo de pérdida total de información ante fallas del servidor o reinicios del contenedor/máquina virtual.
## Consecuencias
### Positivas
Seguridad y privacidad garantizadas: Se aísla por completo la información sensible (contactos, logs y claves) de la interfaz web pública.

Alta disponibilidad y recuperabilidad: El versionado en el bucket principal protege el sitio web contra borrados o sobreescrituras accidentales.

Optimización de costos: El ciclo de vida automático reduce el gasto de almacenamiento en aproximadamente un 65% anual al trasladar archivos antiguos a Standard-IA y Glacier.
### Costos o desventajas que aceptamos
Ligero incremento operacional al tener que administrar y mantener dos buckets independientes con políticas de acceso y roles de IAM diferenciados.

Tiempos de retardo (de minutos a horas) al intentar recuperar respaldos antiguos que hayan sido trasladados a la clase S3 Glacier.
### Que habria que revisar mas adelante
Evaluar el crecimiento del volumen de datos de los usuarios a medida que la plataforma escale para verificar si los plazos del ciclo de vida (30/90/180 días) siguen siendo óptimos o requieren ajuste.

Implementar URLs prefirmadas (Presigned URLs) en caso de que en futuras versiones del gestor de contactos se permita adjuntar archivos privados por cada contacto.
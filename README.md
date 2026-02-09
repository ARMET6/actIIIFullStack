# API de Gestión de Tareas - Actividad III

Este repositorio contiene la solución para la Actividad III de la materia Full Stack Development. Se presenta una API RESTful construida con Node.js y Express.js, diseñada para la gestión de tareas con persistencia de datos local y un sistema de seguridad basado en tokens de acceso.

## Información del Estudiante
* Nombre: Adrián
* Institución: Universidad Tecmilenio
* Matrícula: Al03050102


## Instalación y Ejecución Local

Para revisar y probar este proyecto en un entorno local, siga los pasos detallados a continuación:

1. Clonar el repositorio:
   git clone https://github.com/ARMET6/actIIIFullStack.git

2. Instalar dependencias:
   Entre a la carpeta del proyecto y ejecute el siguiente comando en la terminal:
   npm install
   (Esto instalará las librerías express, bcryptjs, jsonwebtoken y body-parser).

3. Iniciar el servidor:
   Ejecute el comando:
   node server.js
   El servidor iniciará la escucha en el puerto 3000.

---

## Especificaciones Técnicas

### Seguridad y Autenticación
* Cifrado de Datos: Las contraseñas de los usuarios se procesan mediante un algoritmo de hash proporcionado por bcryptjs antes de su almacenamiento.
* Manejo de Sesiones: Implementación de JSON Web Tokens (JWT) para la validación de identidad y protección de rutas.
* Middleware de Control: Se utiliza un middleware de autenticación personalizado para interceptar peticiones a las rutas de tareas y verificar la validez del token en el encabezado Authorization.

### Gestión de Tareas (CRUD)
* GET /tareas: Recupera la lista completa de tareas almacenadas.
* POST /tareas: Permite la creación de nuevas tareas (requiere los campos titulo y descripcion).
* PUT /tareas/:id: Actualiza la información de una tarea existente identificada por su ID.
* DELETE /tareas/:id: Elimina de forma permanente una tarea del sistema utilizando su ID.

### Persistencia y Manejo de Archivos
* Se utiliza el módulo nativo fs.promises para realizar operaciones de lectura y escritura de forma asíncrona en los archivos tareas.json y usuarios.json. Esto garantiza que el servidor no bloquee el Event Loop durante el acceso a disco.

---

## Evidencia de Funcionamiento
* Video Demostrativo: [https://youtu.be/ooTvu5gNjVw]
* Documentación: Se adjunta de forma complementaria un archivo Word con las capturas de pantalla de las pruebas de integración realizadas.

Se integró una interfaz gráfica desarrollada con HTML5 y CSS3, conectada a la API mediante Fetch API, permitiendo una gestión visual de las tareas y el inicio de sesión del usuario.
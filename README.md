# Task Manager Backend

Este proyecto es una API RESTful desarrollada con [NestJS](https://nestjs.com/) y TypeScript, diseñada para gestionar tareas y soportar sincronización offline/online. Utiliza TypeORM para la gestión de datos y SQLite como base de datos local, facilitando el desarrollo y pruebas rápidas.

---

## Justificación de la elección de tecnologías

- **NestJS**: Framework progresivo para Node.js que permite estructurar aplicaciones escalables y mantenibles, con soporte nativo para TypeScript y principios SOLID.
- **TypeScript**: Proporciona tipado estático, mejorando la calidad del código y la experiencia de desarrollo.
- **TypeORM**: ORM maduro y flexible que facilita la integración con múltiples bases de datos y el manejo de entidades.
- **SQLite**: Base de datos ligera y embebida, ideal para entornos de desarrollo y pruebas rápidas sin necesidad de configuración adicional.
- **pnpm**: Gestor de paquetes rápido y eficiente, que optimiza el uso de espacio en disco y la instalación de dependencias.

---

## Implementación de la sincronización offline/online

La sincronización está implementada en el método [`TasksService.sync`](src/tasks/tasks.service.ts), permitiendo que las tareas creadas o modificadas mientras el usuario está offline se almacenen localmente y se sincronicen con el backend cuando la conexión se restablece.

### Flujo de sincronización

1. **Modo Offline**:

   - Las tareas se almacenan localmente (por ejemplo, en localstorage en el frontend).
   - Se marca cada tarea con `pendingSync: true` para indicar que requiere sincronización.

2. **Modo Online**:
   - Al recuperar la conexión, el frontend envía las tareas pendientes al endpoint de sincronización.
   - El backend procesa cada tarea:
     - Si la tarea es nueva (`id < 0`), se crea en la base de datos.
     - Si la tarea ya existe, se actualiza.
   - Tras la sincronización, las tareas se marcan como sincronizadas (`pendingSync: false`).

---

## Detalles técnicos relevantes

- **Almacenamiento local**:  
  El almacenamiento offline se realiza en el frontend, usando tecnologías como IndexedDB o LocalStorage. El backend está preparado para recibir lotes de tareas pendientes de sincronización.

- **Políticas de reintento**:  
  El frontend puede implementar reintentos automáticos en caso de fallo de sincronización, reenviando las tareas hasta recibir confirmación del backend.

- **Manejo de errores**:  
  El backend responde con mensajes claros en caso de error (por ejemplo, tarea no encontrada o error de validación). El frontend debe interpretar estos mensajes y decidir si reintentar o notificar al usuario.

- **Integración con TypeORM**:  
  Todas las operaciones de persistencia se realizan mediante el repositorio de TypeORM, asegurando transacciones seguras y consistentes.

---

## Instrucciones para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar la base de datos

- Asegúrate de tener SQLite instalado y accesible en tu PATH.
- Crea un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`, y configura las variables de entorno según tus necesidades.

### 4. Ejecutar las migraciones

```bash
pnpm typeorm migration:run
```

### 5. Iniciar el servidor

```bash
pnpm start
```

---

## Endpoints principales

- `POST /tasks/sync`: Sincroniza tareas entre el cliente y el servidor.
- `GET /tasks`: Obtiene la lista de tareas.
- `POST /tasks`: Crea una nueva tarea.
- `PUT /tasks/:id`: Actualiza una tarea existente.
- `DELETE /tasks/:id`: Elimina una tarea.

---

## Ejemplo de sincronización

1. El usuario crea una tarea en el frontend mientras está offline.
2. La tarea se almacena en localstorage con `pendingSync: true`.
3. Cuando el usuario vuelve a estar online, el frontend envía la tarea al backend.
4. El backend recibe la tarea y la guarda en la base de datos.
5. El backend responde confirmando la creación o actualización de la tarea.
6. El frontend recibe la respuesta y actualiza el estado de la tarea a `pendingSync: false`.

---

Aunque es una prueba tecnica, tengo pensado trabajar más en este proyecto y mejorar las funcionalidades para que sea un sistema completo y robusto.
Tengo pensado impelementar un sistema de registro de usuarios y que las tareas esten vinculadas con un usuario, y así no sea un sistema para una persona sino que apra muchas personas.

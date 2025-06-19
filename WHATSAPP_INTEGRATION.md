# Integración WhatsApp en ViveColegios

## Descripción
Esta integración permite enviar mensajes de WhatsApp simultáneamente cuando se envía un mensaje desde el sistema de Inbox de ViveColegios.
 SASA
## Características implementadas
### Frontend (InboxCreate.tsx)
- ✅ Checkbox para activar/desactivar envío por WhatsApp
- ✅ Campo de número de teléfono para mensajes individuales
- ✅ Selección de tipo de mensaje (texto o plantilla)
- ✅ Campo opcional para mensaje personalizado de WhatsApp
- ✅ Indicador visual en el footer cuando WhatsApp está activado
- ✅ Estado de carga durante el envío de WhatsApp
- ✅ Manejo de errores y logs detallados

### API de WhatsApp
- ✅ Función para enviar mensajes de texto
- ✅ Función para enviar mensajes con plantilla
- ✅ Manejo de múltiples destinatarios
- ✅ Limpieza automática de números de teléfono
- ✅ Manejo de respuestas y errores de la API

## Configuración requerida

### Variables de entorno
Crear un archivo `.env` en el frontend con:
```
REACT_APP_WHATSAPP_TOKEN=tu_token_de_whatsapp_business_api
```

### WhatsApp Business API
1. Configurar WhatsApp Business API en Facebook Business Manager
2. Obtener el token de acceso
3. Configurar el webhook (opcional)
4. Crear plantillas de mensaje si se van a usar

## Cómo funciona

### Flujo de envío
1. Usuario completa el formulario normal de mensaje
2. Si activa WhatsApp, puede personalizar el mensaje
3. Al enviar, primero se guarda en el backend (sin modificaciones)
4. Luego se envía por WhatsApp usando la API oficial
5. Se muestran los resultados de ambos envíos

### Tipos de mensaje soportados

#### Mensaje individual (Pestaña 1)
- ✅ Implementado
- Requiere número de teléfono manual
- Envía a un solo destinatario

#### Mensaje a curso (Pestaña 2)
- ⚠️ Parcialmente implementado
- Necesita consulta adicional para obtener usuarios del curso con teléfonos
- Actualmente solo muestra advertencia en consola

#### Mensaje a mis cursos (Pestaña 3)
- ⚠️ Parcialmente implementado
- Necesita consulta adicional para obtener usuarios de los cursos del profesor
- Actualmente solo muestra advertencia en consola

#### Mensaje institucional (Pestaña 4)
- ⚠️ Parcialmente implementado
- Necesita consulta adicional para obtener todos los usuarios
- Actualmente solo muestra advertencia en consola

## Pendientes para completar

### Para mensajes masivos (pestañas 2, 3, 4)
1. Crear queries GraphQL adicionales para obtener usuarios con teléfonos:
   - `getUsersByCourse(courseId: ID!)`
   - `getUsersByTeacher(teacherId: ID!)`
   - `getAllUsers()`

2. Implementar lógica para extraer números de teléfono de las respuestas

3. Considerar límites de rate de la API de WhatsApp para envíos masivos

### Mejoras opcionales
- Validación de formato de números de teléfono
- Preview del mensaje antes de enviar
- Historial de envíos de WhatsApp
- Configuración de plantillas desde la UI
- Envío programado
- Estados de entrega de WhatsApp

## Archivos modificados
- `frontend/src/components/app/Inbox/InboxCreate.tsx`
- `frontend/.env.example` (creado)

## Archivos NO modificados (cumple requisito)
- Backend completo
- Otros componentes del frontend
- Base de datos
- Configuración de servidor

## Notas de desarrollo
- La integración es 100% frontend
- No interfiere con el flujo normal del sistema
- Fácil de activar/desactivar
- Logs detallados para debugging
- Manejo robusto de errores

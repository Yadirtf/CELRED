📝 Especificaciones Técnicas: Módulo de Referencias
1. Interfaz de Registro (Input de Datos)
Para que el asesor sea ágil, el formulario debe permitir agregar múltiples referidos para un mismo comprador en un solo paso.

Bloque del Comprador:

Nombre del Cliente Comprador (Texto)

WhatsApp del Comprador (Número)

Bloque de Referencias (Dinámico):

Nombre de la Referencia

WhatsApp de la Referencia

Parentesco (Dropdown: Amigo, Familiar, Compañero, Otro)

Botón [+]: Para añadir otra fila de referencia sin repetir los datos del comprador.

2. Configuración del Mensaje Maestro
Un campo de texto (Textarea) donde el Admin define el mensaje. Debe soportar etiquetas dinámicas para que el sistema las reemplace:

{nombre_referido}: Se cambia por el nombre del contacto.

{nombre_comprador}: Se cambia por el nombre de quien compró.

{celular_comprador}: Se cambia por el número del que compró (opcional).

Ejemplo de mensaje configurado:

"¡Hola {nombre_referido}! 👋 Tu amigo {nombre_comprador} nos pasó tu contacto porque sabe que quieres estrenar celular. Tenemos el Redmi Note 15 Pro sin inicial para ti. 📱"

3. Visualización y UX de la Tabla (Dashboard)
Para evitar desorden cuando un cliente da 5 o más referencias, la tabla debe usar un sistema de "Agrupación por Comprador".


Comprador (Origen),Referencia (Potencial Cliente),Parentesco,WhatsApp Acción,Estado
Juan Pérez,Carlos Ruiz,Amigo,[🟢 Enviar WhatsApp],⏳ Pendiente
(310-555-0000),Ana Gómez,Prima,[🟢 Enviar WhatsApp],✅ Contactado
,Luis Pérez,Hermano,[🟢 Enviar WhatsApp],⏳ Pendiente
---,---,---,---,---
María López,Sofía Castro,Amiga,[🟢 Enviar WhatsApp],⏳ Pendiente

Detalles de UX clave para el desarrollador:

Celdas combinadas: Si un comprador tiene 3 referencias, su nombre solo aparece una vez en la primera columna abarcando las 3 filas (Rowspan). Esto permite al asesor identificar visualmente grupos de contactos.

Botón de Acción Inteligente: Al hacer clic en el botón de WhatsApp, debe abrir una nueva pestaña con el enlace de la API: https://wa.me/{numero_referencia}?text={mensaje_procesado}.

Check de Seguimiento: Al hacer clic en el botón de WhatsApp, el "Estado" debe cambiar automáticamente de "Pendiente" a "Contactado" para que otro asesor no repita el mensaje.

4. Flujo de Trabajo para el Asesor
Paso 1: El asesor termina una venta y abre el formulario de Referencias.

Paso 2: Registra al comprador y sus 2 o 3 referidos.

Paso 3: En la tabla, pulsa el botón de WhatsApp de cada referido recién creado.

Paso 4: WhatsApp se abre con el mensaje personalizado listo, el asesor solo da "Enter".
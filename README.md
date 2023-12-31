# Cheatsheet de IndexedDB

## Configuración Inicial

### Crear o Abrir una Base de Datos
indexedDB.open("nombreBaseDatos", versión);

### Manejar Evento de Actualización
openRequest.onupgradeneeded = function(event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('Almacen')) {
    db.createObjectStore('Almacen', { keyPath: 'clavePrimaria' });
  }
};

### Manejar Evento de Éxito al Abrir
openRequest.onsuccess = function() {
  const db = openRequest.result;
  // Realizar operaciones dentro de la base de datos
};

### Manejar Evento de Error al Abrir
openRequest.onerror = function() {
  console.error('Error al abrir la base de datos');
};

## Operaciones Básicas

### Agregar un Registro
const transaction = db.transaction(['Almacen'], 'readwrite');
const store = transaction.objectStore('Almacen');
const request = store.add({ clavePrimaria: valor });

### Obtener un Registro por Clave Primaria
const getRequest = store.get(clavePrimaria);
getRequest.onsuccess = function(event) {
  const registro = event.target.result;
};

### Actualizar un Registro
const updateTransaction = db.transaction(['Almacen'], 'readwrite');
const updateStore = updateTransaction.objectStore('Almacen');
const updateRequest = updateStore.put({ clavePrimaria: nuevoValor });

### Eliminar un Registro
const deleteTransaction = db.transaction(['Almacen'], 'readwrite');
const deleteStore = deleteTransaction.objectStore('Almacen');
const deleteRequest = deleteStore.delete(clavePrimaria);

## Consultas Avanzadas

### Obtener un Cursor para Recorrer Registros
const cursorRequest = store.openCursor();
cursorRequest.onsuccess = function(event) {
  const cursor = event.target.result;
  if (cursor) {
    // Procesar cada registro
    cursor.continue();
  }
};

## Otros

### Manejar Evento de Éxito al Realizar una Operación
request.onsuccess = function(event) {
  console.log('Operación exitosa');
};

### Manejar Evento de Error al Realizar una Operación
request.onerror = function(event) {
  console.error('Error en la operación', event.target.error);
};

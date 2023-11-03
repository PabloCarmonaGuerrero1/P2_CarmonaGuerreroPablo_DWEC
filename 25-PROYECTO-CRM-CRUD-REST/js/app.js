// Espera a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Abre una solicitud para acceder a la base de datos "store" con la versión 1
  const openRequest = indexedDB.open("store", 1);

  // Maneja el evento de actualización de la base de datos
  openRequest.onupgradeneeded = function(event) {
    // Obtiene la instancia de la base de datos
    const db = event.target.result;

    // Si la base de datos no contiene un almacén de objetos llamado 'Clientes', lo crea
    if (!db.objectStoreNames.contains('Clientes')) {
      db.createObjectStore('Clientes', { keyPath: 'email' });
    }
  };

  // Maneja el evento de éxito al abrir la base de datos
  openRequest.onsuccess = function () {
    // Obtiene la instancia de la base de datos
    const db = openRequest.result;

    // Inicia una transacción de solo lectura en el almacén de objetos 'Clientes'
    const transaction = db.transaction(['Clientes'], 'readonly');
    const store = transaction.objectStore('Clientes');

    // Obtiene una referencia al elemento HTML con el id "listado-clientes"
    const listadoClientes = document.getElementById("listado-clientes");

    // Abre un cursor para recorrer los registros en el almacén de objetos
    const cursorRequest = store.openCursor();

    // Maneja el evento de éxito al abrir el cursor
    cursorRequest.onsuccess = function (event) {
      const cursor = event.target.result;

      // Si hay un registro disponible en el cursor
      if (cursor) {
        // Crea elementos HTML dinámicamente para mostrar los datos del cliente
        const tr = document.createElement("tr");

        // Crea celdas para mostrar el nombre, teléfono y empresa del cliente
        const tdNombre = document.createElement("td");
        tdNombre.textContent = cursor.value.nombre;

        const tdTelefono = document.createElement("td");
        tdTelefono.textContent = cursor.value.telefono;

        const tdEmpresa = document.createElement("td");
        tdEmpresa.textContent = cursor.value.empresa;

        // Crea botones "Borrar" y "Editar" para cada cliente
        const tdAcciones = document.createElement("td");

        // Botón "Borrar"
        const borrarButton = document.createElement("button");
        borrarButton.textContent = "Borrar";
        borrarButton.classList.add("text-red-600", "hover:text-red-900");
        borrarButton.setAttribute("data-cliente-id", cursor.value.email); // Almacena el ID del cliente como un atributo del botón

        // Agrega un evento click al botón "Borrar" para eliminar el cliente
        borrarButton.addEventListener("click", function (event) {
          const clienteId = event.target.getAttribute("data-cliente-id");

          // Abre una nueva transacción para eliminar el cliente
          const deleteTransaction = db.transaction(['Clientes'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('Clientes');

          // Elimina el cliente de la base de datos
          const deleteRequest = deleteStore.delete(clienteId);

          // Maneja el evento de éxito al eliminar el cliente
          deleteRequest.onsuccess = function () {
            console.log("Cliente eliminado de la base de datos");

            // Elimina la fila de la lista en la tabla HTML
            listadoClientes.removeChild(tr);
          };

          // Maneja el evento de error al eliminar el cliente
          deleteRequest.onerror = function () {
            console.error("Error al eliminar el cliente de la base de datos");
          };

          // Cierra la transacción de eliminación
          deleteTransaction.oncomplete = function () {
            console.log("Transacción de eliminación completada");
          };
        });

        // Botón "Editar"
        const editarButton = document.createElement("button");
        editarButton.textContent = "Editar";
        editarButton.classList.add("text-blue-600", "hover:text-blue-900");
        editarButton.setAttribute("data-cliente-id", cursor.value.email); // Almacena el ID del cliente como un atributo del botón

        // Agrega un evento click al botón "Editar" para redirigir a la página de edición del cliente
        editarButton.addEventListener("click", function (event) {
          const clienteId = event.target.getAttribute("data-cliente-id");
          window.location.href = `editar-cliente.html?id=${clienteId}`;
        });

        // Agrega los elementos de botones a la celda de acciones
        tdAcciones.appendChild(borrarButton);
        tdAcciones.appendChild(editarButton);

        // Agrega las celdas al elemento de fila
        tr.appendChild(tdNombre);
        tr.appendChild(tdTelefono);
        tr.appendChild(tdEmpresa);
        tr.appendChild(tdAcciones);

        // Agrega la fila al elemento de lista de clientes
        listadoClientes.appendChild(tr);

        // Avanza al siguiente registro en el cursor
        cursor.continue();
      } else {
        console.log("No hay más registros");
      }
    };
  };

  // Maneja el evento de error al abrir la base de datos
  openRequest.onerror = function () {
    console.error('Error al abrir la base de datos');
  };
});

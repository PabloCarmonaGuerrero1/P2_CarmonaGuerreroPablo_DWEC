document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el ID del cliente de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const clienteId = urlParams.get("id");
  const formulario = document.querySelector("#formulario");
  if (!clienteId) {
    console.error("El ID del cliente no se proporcionó en la URL");
    return;
  }

  // Declarar un objeto cliente para almacenar los datos
  let cliente = null;

  // Abre la base de datos y obtiene el cliente por ID
  const openRequest = indexedDB.open("store", 1);

  openRequest.onsuccess = function (e) {
    const db = openRequest.result;
    const transaction = db.transaction(['Clientes'], 'readwrite'); // Cambia a 'readwrite' para actualizar la base de datos
    const store = transaction.objectStore('Clientes');

    const getRequest = store.get(clienteId);

    getRequest.onsuccess = function (e) {
      cliente = getRequest.result;
      // Rellena los campos de entrada con los datos del cliente
      document.getElementById("nombre").value = cliente.nombre;
      document.getElementById("telefono").value = cliente.telefono;
      document.getElementById("email").value = cliente.email;
      document.getElementById("empresa").value = cliente.empresa;

      // Agregar un evento click al botón de actualización
      formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        // Actualiza los valores del objeto cliente con los datos de los campos de entrada
        cliente.nombre = document.getElementById("nombre").value;
        cliente.telefono = document.getElementById("telefono").value;
        cliente.email = document.getElementById("email").value;
        cliente.empresa = document.getElementById("empresa").value;

        // Abre una nueva transacción para guardar los cambios
        const updateTransaction = db.transaction(['Clientes'], 'readwrite');
        const updateStore = updateTransaction.objectStore('Clientes');
        const updateRequest = updateStore.put(cliente);

        updateRequest.onsuccess = function (e) {
          console.log("Cliente actualizado");
        };

        updateRequest.onerror = function (e) {
          console.error("Error al actualizar el cliente", e.target.error);
        };
      });
    };
  };
});

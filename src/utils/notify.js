// Necesita la instancia de $q ya que no se puede utilizar en un fichero js

// VERSION INICIAL SIN TRADUCCIONES
// export const notify = ($q, message, type = "ok") => {
  // Función para mostrar notificaciones
//   if (type === "ok") {
//     $q.notify({
//       color: "positive",
//       message: message,
//       icon: "done",
//       position: "top",
//       timeout: 2500,
//     });
//   } else if (type === "nok") {
//     $q.notify({
//       color: "negative",
//       message: message,
//       icon: "warning",
//       position: "top",
//       timeout: 2500,
//     });
//   } else if (type === "warning") {
//     $q.notify({
//       color: "warning",
//       message: message,
//       icon: "warning",
//       position: "top",
//       timeout: 2500,
//     });
//   }
// };

// Aplica traducción sobre el message (se pasa t como parámetro)
export const notify= ($q, t, message, type = "ok") => {
  // Aplicamos el idioma gracias a la instacia t
  const messageLocation = t(message);
  // Función para mostrar notificaciones
  if (type === "ok") {
    $q.notify({
      //color: "#daffe0",
      classes: "notify-ok",
      message: messageLocation,
      icon: "done",
      position: "top",
      timeout: 2500,
    });
  } else if (type === "nok") {
    $q.notify({
      //color: "#ffdddd",
      classes: "notify-nok",
      message: messageLocation,
      icon: "warning",
      position: "top",
      timeout: 2500,
    });
  } else if (type === "warning") {
    $q.notify({
      //color: "#ffebb1",
      classes: "notify-warning",
      message: messageLocation,
      icon: "warning",
      position: "top",
      timeout: 2500,
    });
  }
};



// Función que genera una notificación que permanece visible de manera indefinida
export const notifyInf = ($q, message) => {
  const notification = $q.notify({
    color: "negative",
    message: message,
    icon: "error",
    position: "top",
    timeout: 0,
  });
  return notification;
};

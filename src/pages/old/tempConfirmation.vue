<template>
  <div v-if="pending">
    Se ha cargado una reserva previa. Por favor finalice la reserva previa antes de realizar una nueva.
  </div>

  <div class="column items-center q-mt-lg">
      <h4>Confirmación de reserva</h4>
              <p><strong>Usuario:</strong> {{ reservation.userName }}</p>
              <p><strong>idUsuario:</strong> {{ reservation.idUser }}</p>
              <p><strong>Email:</strong> {{ reservation.userEmail }}</p>
              <p><strong>Teléfono:</strong> {{ reservation.userPhone }}</p>
              <p><strong>idReserva:</strong> {{ reservation.idReservation }}</p>
              <p><strong>idRecurso:</strong> {{ reservation.idResource }}</p>
              <p><strong>Recurso:</strong> {{ reservation.resource }}</p>
              <p><strong>FechaUTC:</strong> {{ reservation.date }}</p>
              <p><strong>Día:</strong> {{ reservation.dateString}}</p>
              <p><strong>Hora:</strong> {{ reservation.hour }}</p>
              <p><strong>Duración:</strong> {{ reservation.slotDuration}}</p>
              <p><strong>Fecha Expiración:</strong> {{ reservation.expirationDate}}</p>
              <p><strong>Tiempo restante:</strong> {{ countdown }}</p>
  </div>

  <!-- Fila con los botones para guardar o cancelar -->
            <div class="row justify-center q-mt-lg">
              <div>
                <q-btn
                  class="q-mr-sm"
                  color="primary"
                  label="Cancelar"
                  no-caps
                  size="md"
                  type="button"
                  @click="cancelReservation"
                  style="min-width: 100px;" />
              </div>
              
              <div>
                <q-btn
                  color="primary"
                  label="Reservar"
                  no-caps
                  size="md"
                  @click="confirmReservation"
                  style="min-width: 100px;" />
              </div>
            </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { notify } from 'src/utils/notify';
import { useRouter } from 'vue-router'; // Importamos el router
import { useNavigationStore } from 'src/stores/navigationStore.js';
import { apiAddReservation, apiDeleteReservation, apiConfirmReservation } from 'src/services/apiRequests';
import { DateTime } from 'luxon';

const navStore = useNavigationStore(); // Instancia de la store

const router = useRouter(); // Instancia del router de Vue

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q

const reservation = ref({
  idReservation: null,
  idUser: null,
  idResource: null,
  resource: null,
  date: null,
  dateString: null,
  hour: null,
  slotDuration: null,
  expirationDate: null,
});

const pending = ref(false);

const countdown = ref('');
const timer = ref(null);


const previousRoute = navStore.previousRoute;

onMounted( async() => {
  try {
    // Leemos del store la reserva almacenada
    const storedReservation = navStore.storedReservation;

    // Ejemplo objeto que tenemos en el store de navegación
    //const reservationInfo = {
      // idResource: 0,
      // date: '',
      // dateString: '',
      // hour: '',
      // slotDuration: 0,
    //};

    if (!storedReservation) {
      // notify($q, 'Reserva vacia', 'nok');
      // router.push('/');
      throw new Error('Reserva vacia');
    };

    reservation.value = storedReservation;
    // Vaciamos la reserva de la store
    navStore.clearStoredReservation();
    //console.log(reservation.value);

    // Llamamos a la API para generar reserva temporal (verificamos si tiene alguna pendiente)
    const response = await apiAddReservation(reservation.value.idResource, reservation.value.date);
    //console.log("Response: ", response);

    // Ejemplo objeto response
    /*
    {
    pending: true,
    reservation = {
        "idReservation": "f994f567-4a49-4f73-8227-6003742adfe6",
        "idUser": 2,
        "idResource": 1,
        "resource": "Padel Pueblo",
        "date": "2024-12-25T07:00:00.000Z",
        "expirationDate": ""2024-12-23T07:39:48.191Z"
        "idUser": 2,
        "userName": "Ian",
        "userSurname": "Martinez",
        "userEmail": "ian.martinez@turiasmart.com",
        "userPhone": "1234",
      }
    }  
    */

    displayReservationInfo(response.pending, response.reservation);

    // Iniciamos la cuenta atrás
    startCountdown();

  } catch (error) {
    notify($q, error.message, 'nok');
    router.push('/');
  };  
});

const cancelReservation = async () => {
  try {

    clearInterval(timer.value);

  // Eliminamos la ruta previa del store
    navStore.setPreviousRoute(null);

  // Eliminamos la reserva del store
    navStore.setStoredReservation(null);

  // Eliminamos reserva temporal llamando a la API
    await apiDeleteReservation(reservation.value.idReservation);

    if (previousRoute) {
      router.push(previousRoute);
    } else {
      throw new Error('No hay ruta previa');
    }

  } catch (error) {
    notify($q, error.message, 'nok');
    router.push('/');
  };
  
};

const confirmReservation = async () => {
  try {
    clearInterval(timer.value);
    await apiConfirmReservation(reservation.value.idReservation);
    notify($q, 'Reserva confirmada', 'ok');
    router.push('/');
  } catch (error) {
    notify($q, error.message, 'nok');
    router.push('/');
  };
};

const startCountdown = () => {
  const expirationTime = new Date(reservation.value.expirationDate).getTime(); // Fecha de expiración en milisegundos

  // Función para actualizar la cuenta atrás
  const updateCountdown = () => {
    const now = new Date().getTime(); // Obtener el tiempo actual
    const remainingTime = expirationTime - now; // Calcular el tiempo restante

    if (remainingTime <= 0) { // Si el tiempo ha expirado
      countdown.value = '0min 00s'; // Mostrar la cuenta regresiva como 0
      notify($q, 'Reserva caducada', 'nok'); // Notificar al usuario que la reserva ha caducado
      clearInterval(timer.value); // Detener el intervalo
      cancelReservation(); // Cerrar la ventana y cancelar la reserva
    } else {
      const minutes = Math.floor(remainingTime / 60000); // Minutos restantes
      const seconds = Math.floor((remainingTime % 60000) / 1000); // Segundos restantes
      countdown.value = `${minutes}min ${seconds < 10 ? '0' : ''}${seconds}s`; // Mostrar el tiempo restante
    }
  };

  // Limpiar cualquier intervalo previo antes de crear uno nuevo
  if (timer.value) {
    clearInterval(timer.value);
  }

  // Crear un nuevo intervalo para actualizar cada segundo
  timer.value = setInterval(updateCountdown, 1000);

  // Ejecutar inmediatamente la primera actualización para evitar el retraso inicial de 1 segundo
  updateCountdown();
};

const displayReservationInfo = (isPending, res) => {
  // Si no hay una reserva temporal previa -> trabajamos con la reserva actual
  // Si hay una reserva temporal previa -> la recuperamos para que la finalice

  // Campos comunes
  reservation.value.idReservation = res.idReservation;
  reservation.value.idUser = res.idUser;
  reservation.value.userName = res.userName;
  reservation.value.userEmail = res.userEmail;
  reservation.value.userPhone = res.userPhone;

  if (isPending === false) {   // No hay reserva previa
    pending.value = false;
    // Actualizamos solo los campos que nos faltan
    reservation.value.resource = res.resource;
    reservation.value.expirationDate = res.expirationDate;
  } else {   // Hay reserva previa
    pending.value = true;

    // Procesamiento para obtener dateString y hour de la reserva previa
    // Creamos variable Luxon a partir de la propiedad date

    const date = DateTime.fromJSDate(new Date(res.date))
      .setZone('Europe/Madrid') // Establecer la zona horaria
      .setLocale('es'); // Establece la localización a español

    const dayName = date.toFormat('cccc');  // 'cccc' devuelve el nombre completo del día (por ejemplo, "jueves")
    const day = date.toFormat('dd');  // 'dd' devuelve el día con dos dígitos (por ejemplo, "12")
    const monthName = date.toFormat('MMMM');  // 'MMMM' devuelve el nombre completo del mes (por ejemplo, "diciembre")
    const hour = date.toFormat('HH:mm');  // 'HH:mm' devuelve la hora en formato de 24 horas (por ejemplo, "14:00")

    reservation.value.dateString = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} de ${monthName}`;
    reservation.value.hour = hour;

    // Machacamos con los campos de la reserva previa
    reservation.value.idResource = res.idResource;
    reservation.value.resource = res.resource;
    reservation.value.date = res.date;
    reservation.value.expirationDate = res.expirationDate;
  };
}


onBeforeUnmount(() => {
  // Limpiar el temporizador cuando el componente sea destruido
  if (timer.value) {
    clearInterval(timer.value);
  }
});


</script>

<style lang="scss" scoped>

</style>
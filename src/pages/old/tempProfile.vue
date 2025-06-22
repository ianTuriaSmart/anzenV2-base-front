<template>

  <!-- Row que contiene el título -->
  <div class="row justify-center">
    <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
      {{ $t('tituloConfirmacion') }}
      
    </div>
    <div class="col-12 col-md-8 text-center text-h6 text-light text-primary">
      {{ $t('subtituloConfirmacion') }}
    </div>
  </div>

  <!-- Div que contiene el aviso de tiempo restante -->
<div class="row justify-center q-mt-md">
  <q-card
    flat
    style="border-radius: 30px; background: #ffebb1; color: #b28a17;"
  >
    <q-card-section style="padding: 2px 15px;">
      <!-- Row que contiene el texto que avisa de una reserva previa -->
      <div
        class="col-12 col-md-8 text-center text-h7 text-weight-bold"
        style="display: flex; align-items: center; justify-content: space-between;"
      >
        <!-- Avatar -->
        <q-avatar>
          <q-icon name="access_time" size="sm" />
        </q-avatar>
        
        <!-- Texto -->
        <span style="flex-grow: 1; text-align: center;">
          Tiempo restante: 12min 30s
        </span>
        
        <!-- Espacio a la derecha para igualar el del avatar -->
        <div style="width: 48px;"></div>
      </div>
    </q-card-section>
  </q-card>
</div>

  <!-- Div que contiene las dos tarjetas-->
  <div class="row justify-evenly q-mt-lg">
    <!-- 1. Tarjeta de la reserva-->
    <q-card
      class="text-primary"
      flat
      bordered
      style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
      >

      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('tituloVentanaReserva') }}
          </div>
        </div>

        <!-- Row que contiene la primera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="sports_tennis" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                  <q-item-label>{{ locale === 'es-ES' ? reservation.resource : reservation.resourceVal }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="location_on" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('ubicacion') }}</q-item-label>
                  <q-item-label>Link</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la segunda fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fecha') }}</q-item-label>
                  <q-item-label>{{ reservation.dateString }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="schedule" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('hora') }}</q-item-label>
                  <q-item-label>{{ reservation.hour }}</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la tercera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('precio') }}</q-item-label>
                  <q-item-label>{{ reservation.fee }}€</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="timelapse" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('duracion') }}</q-item-label>
                  <q-item-label>{{ reservation.slotDuration }}h</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 2. Tarjeta datos de usuario -->
    <q-card
      class="text-primary"
      flat
      bordered
      style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
      >

      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('tituloTarjetaUsuario') }}
          </div>
        </div>

        <!-- Row que contiene la primera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="person" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('nombre') }}</q-item-label>
                  <q-item-label> {{ user.name }} </q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="person" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('apellidos') }}</q-item-label>
                  <q-item-label> {{ user.surname }} </q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la segunda fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="badge" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('dni') }}</q-item-label>
                  <q-item-label>{{ user.idDocument }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="call" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('telefono') }}</q-item-label>
                  <q-item-label>{{ user.phone }}</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la tercera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="mail" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('dni') }}</q-item-label>
                  <q-item-label>{{ user.email }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>    
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-- Div que contiene el aviso de reserva previa -->
  <div class="row justify-center q-mt-lg">
    <q-card
      flat
      style="width: 400px; ; border-radius: 30px; background: #ffdddd; color: #a52d2d ;"
      >
      <q-card-section>
        <!-- Row que contiene el texto que avisa de una reserva previa -->
        
          <div class="col-12 col-md-8 text-center text-h7 q-my-md text-weight-bold">
            {{ $t('msgReservaPrevia') }}
          </div>
        
      </q-card-section>
    </q-card>
  </div>

  <!-- Div que contiene los botones de reservar y cancelar -->
  <div class="row q-mb-lg q-mt-lg justify-center">
    <div class="q-mr-lg">
      <q-btn
        color="primary"
        :label="$t('btnCancelar')"
        no-caps
        size="md"
        type="button"
        @click="cancelReservation"
        style="min-width: 260px; min-height: 45px; border-radius: 10px;" />
    </div>
  
    <div class="q-ml-lg">
      <q-btn
        color="primary"
        :label="$t('btnReservar')"
        @click="confirmReservation"
        no-caps
        size="md"
        style="min-width: 260px; min-height: 45px; border-radius: 10px;" />
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { notify, notifyLocation } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useNavigationStore } from 'src/stores/navigationStore.js';
import { apiAddReservation, apiDeleteReservation, apiConfirmReservation } from 'src/services/apiRequests';
import { DateTime } from 'luxon';

const navStore = useNavigationStore(); // Instancia de la store

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const { locale } = useI18n(); // Hook para acceder a las traducciones

const reservation2 = ref({
  idReservation: null,
  idUser: null,
  idResource: null,
  resource: null,
  resourceVal: null,
  date: null,
  dateString: null,
  hour: null,
  slotDuration: null,
  fee: null,
  expirationDate: null,
});

const pending = ref(false);

const countdown = ref('');
const timer = ref(null);

const previousRoute = navStore.previousRoute;


const reservation = {
  idUser: 0,
  idResource: 1,
  resource: 'Padel Playa',
  resourceVal: 'Padel Platja',
  date: '',
  dateString: 'Lunes 13 de enero',
  hour: '21:30',
  slotDuration: 1.5,
  fee: 3.5,
};

const user = {
  name: "Pedro",
  surname: "Martinez",
  email: "ianmarti@hotmail.com",
  phone: "615566227",
  idDocument: "0726252W"
};

onMounted( async() => {
  try {
    // Leemos del store la reserva almacenada
    const storedReservation = navStore.storedReservation;

    if (!storedReservation) {
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


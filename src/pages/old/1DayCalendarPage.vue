<template>
  <q-page>
    <!-- Contenedor del Spinner -->
    <div
      v-if="isLoading"
      class="q-pa-md"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      "
    >
      <!-- Spinner -->
      <q-spinner color="primary" size="120px" :thickness="2" />
    </div>

    <div v-else class="q-mt-lg">
      <!-- Row que contiene el título -->
      <div class="row justify-center">
        <div
          class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary"
          style="max-width: 300px"
        >
          {{ $t("tituloCalendario") }}
        </div>
        <!-- <div class="col-12 col-md-8 text-center text-h6 text-light text-primary bg-blue">
          {{ $t('tituloHome') }}
        </div> -->
      </div>

      <div class="calendar-container">
        <!-- Navegación del calendario -->
        <div class="quasar-header q-mb-md row justify-between">
          <q-btn
            @click="prevDay"
            :label="$t('retrocederDia')"
            :disable="blockNavigation.blockBackward"
            icon="keyboard_arrow_left"
            size="md"
            dense
            flat
            style="text-transform: none; color: #666b71; border-radius: 10px"
          ></q-btn>

          <q-select
            v-model="displayedDay.cellStatusString"
            :options="availableDays"
            rounded
            outlined
            dense
            @update:model-value="changeDay"
            behavior="menu"
            popup-content-class="text-align-center justify-center"
            popup-content-style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background-color: #f7f8fa;
            "
          >
            <template v-slot:prepend>
              <q-icon name="event" size="xs" />
            </template>
          </q-select>

          <q-btn
            @click="nextDay"
            :label="$t('avanzarDia')"
            :disable="blockNavigation.blockForward"
            icon-right="keyboard_arrow_right"
            size="md"
            dense
            flat
            style="text-transform: none; color: #666b71; border-radius: 10px"
          ></q-btn>
        </div>

        <!-- Tabla del calendario -->
        <table class="calendar-table">
          <thead>
            <!-- Encabezado de recursos -->
            <tr>
              <th v-for="resource in resources" :key="resource.idResource">
                {{ resource.name }}
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Filas de horas -->
            <tr v-for="hour in timeSlots" :key="'hour-' + hour">
              <td
                v-for="resource in resources"
                :key="'cell-' + resource.idResource + '-' + hour"
                :class="
                  cellStatus[`${resource.idResource}-${hour}`]?.status ||
                  'available'
                "
                @click="handleClick(resource.idResource, hour)"
              >
                <div class="cell-content">
                  <div class="row justify-center items-center">
                    <div>{{ hour }}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="q-mt-md row justify-start">
          <!-- Botón que activará la leyenda -->
          <q-btn
            :label="$t('leyenda')"
            style="text-transform: none"
            icon="info"
            color="primary"
            flat
            @click="showLegend = true"
            :style="{ borderRadius: '10px' }"
          />
        </div>
      </div>
    </div>

    <!-- Dialogo de confirmación de reserva -->
    <q-dialog v-model="showDialog" persistent>
      <ReservationForm
        @close="closeDialog"
        :reservation="selectedReservation"
      />
    </q-dialog>

    <!-- Dialogo leyenda -->
    <q-dialog v-model="showLegend">
      <CalendarLegend @close="closeLegend" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { format } from "date-fns";
import { apiGetReservations } from "src/services/apiRequests";
import { notify } from "src/utils/notify"; // Importamos función custom para las notificaciones
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { DateTime } from "luxon";
import { socketManager } from "src/services/socket";
import ReservationForm from "src/components/DialogReservation.vue";
import CalendarLegend from "src/components/CalendarLegend.vue";
import { useAuthStore } from "src/stores/authStore";
import { useNavigationStore } from "src/stores/navigationStore.js";
import { useRouter } from "vue-router"; // Importamos el router
import { useI18n } from "vue-i18n";

const router = useRouter(); // Instancia del router de Vue

const navStore = useNavigationStore(); // Instancia de la store

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q

const authStore = useAuthStore(); // Consultamos la store para obtener el id del usuario

const { t, locale } = useI18n(); // Usamos Vue i18n para obtener el idioma actual

// Configuración
// const CURRENT_ID_USER = 2;
// const calendarConfig.value.slotDuration = 1.5;
// const calendarConfig.value.maxDays = 5;
// const calendarConfig.value.startHour = 8;
// const calendarConfig.value.endHour = 23;

const calendarDate = ref(new Date(new Date().setHours(0, 0, 0, 0)));

// const today = new Date();
// const calendarDay = ref(format(today, 'dd/MM/yyyy'));

const calendarConfig = ref({
  // slotDuration: 1.5,
  // startHour: 8,
  // endHour: 23,
  // maxDays: 9,
  // fee: 3.5
});

const resources = ref([
  // { idResource: 1, name: 'Padel Pueblo', nameVal: 'Padel Poble' },
  // { idResource: 2, name: 'Padel Playa', nameVal: 'Padel Platja' },
]);

const reservations = ref([
  {
    // idResource: 1,
    // date: '2024-12-09T16:00:00Z',
    // idUser: 1,
    // confirmed: false,
  },
]);


const blockedDays = ref([]); // Array que contiene los días no disponibles
//[{ date: '2024-12-10', idResource: 1] }]
const blockedSlots = ref([]); // Array que contiene los slots no disponibles
//[{ date: '2024-12-10T17:30:00Z', idResource: 1] }]

const selectedReservation = ref({
  // idUser: 0,
  // idResource: 0,
  // resource: '',
  // date: '',
  // slotDuration: 0,
  // date: '',
  // dateString: '',
  // hour: '',
});

const isLoading = ref(false); // Controla si está cargando

const showDialog = ref(false); // Controla la visibilidad del dialog
const showLegend = ref(false); // Controla la visibilidad de la leyenda

let luxonLocale = ref("es");

onMounted(() => {
  // Guardamos en la store la ruta
  navStore.setPreviousRoute(router.currentRoute.value.fullPath);

  getReservations(calendarDate.value.toISOString());

  socketManager.getSocket().on("updateReservations", (data) => {
    console.log("Websocket: " + data);
    getReservations(calendarDate.value.toISOString());
    notify($q, t, "wsUpdated", "ok");
  });
});

/////////////////// COMPUTEDS //////////////////

// Propiedad computada que a partir de calendarDate construye fechas que necesitamos
const displayedDay = computed(() => {
  // Según el idioma forzamos el locale
  luxonLocale = locale.value === "es-ES" ? "es" : "ca";

  const date = DateTime.fromJSDate(calendarDate.value)
    .setZone("Europe/Madrid") // Establecer la zona horaria
    .setLocale(luxonLocale); // Establece la localización
  const cellStatusString = format(date, "dd/MM/yyyy");

  return {
    date: date, // Objeto date para cuando hagamos click tenerlo
    cellStatusString: cellStatusString, // String para la comprobación de cellStatus
  };
});

// Propiedad computada que a patir del día actual construye los días disponibles en el q-select
const availableDays = computed(() => {
  const days = [];

  for (let i = 0; i <= calendarConfig.value.maxDays - 1; i++) {
    const date = new Date(new Date().setHours(0, 0, 0, 0));

    date.setDate(date.getDate() + i);
    days.push(format(date, "dd/MM/yyyy"));
  }
  return days;
});

// Propiedad computada que generá los tramos horarios teniendo en cuenta calendarConfig.value.slotDuration
const timeSlots = computed(() => {
  const slots = [];
  const durationInMinutes = calendarConfig.value.slotDuration; // Convertimos la duración a minutos
  const totalMinutesInDay =
    (calendarConfig.value.endHour - calendarConfig.value.startHour) * 60; // Total de minutos desde el inicio hasta el fin

  for (
    let minutes = 0;
    minutes < totalMinutesInDay;
    minutes += durationInMinutes
  ) {
    const hour = Math.floor(minutes / 60) + calendarConfig.value.startHour; // Calculamos la hora base
    const minute = minutes % 60; // Calculamos los minutos

    slots.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}` // Formato HH:mm
    );
  }

  return slots;
});

// Propiedad computada que mapea el estado de las celdas
const cellStatus = computed(() => {
  const status = {};

  timeSlots.value.forEach((hour) => {
    resources.value.forEach((resource) => {
      // Generar el identificador único para cada celda
      const idCell = `${resource.idResource}-${hour}`;

      // Generamos la fecha correspondiente a la celda en el día actual
      const dateCell = new Date(
        calendarDate.value.getFullYear(), // Año
        calendarDate.value.getMonth(), // Mes
        calendarDate.value.getDate(), // Día
        hour.split(":")[0], // Hora
        hour.split(":")[1], // Minutos
        0
      );

      // Calculamos la fecha final de la celda en UTC
      const endDateCell = new Date(
        dateCell.getTime() + calendarConfig.value.slotDuration * 60 * 1000
      );

      // Creamos el objeto de la celda que nos permitira comparar los bloqueos
      const cell = {
        date: dateCell.toISOString(),
        day: dateCell.toISOString().split("T")[0],
        idResource: resource.idResource,
      };

      // Evaluamos si la fecha pertenece a un dia bloqueado
      const isBlockedDay = blockedDays.value.some(
        (blockedDay) => blockedDay.date === cell.day && blockedDay.idResource === cell.idResource //Comparamos en UTC y 'YYYY-MM-DD'
      );

      if (isBlockedDay) {
        status[idCell] = { status: "blocked", title: "", icon: "" };
        return;
      };

      // Evaluamos si la fecha pertenece a un slot bloqueado
      const isBlockedSlot = blockedSlots.value.some(
        (blockedSlot) => blockedSlot.date === cell.date && blockedSlot.idResource === cell.idResource
      );

      if (isBlockedSlot) {
        status[idCell] = { status: "blocked", title: "", icon: "" };
        return;
      };

      // Evaluamos si el slot ha expirado
      const now = new Date();

      // Si el slot está en el pasado o en curso, se marca como 'expired'
      if (dateCell < now && now < endDateCell) {
        // El slot esta en curso
        status[idCell] = { status: "expired", title: "Expirado", icon: "" };
        return;
      }

      if (endDateCell <= now) {
        // El slot ha expirado
        status[idCell] = { status: "expired", title: "Expirado", icon: "" };
        return;
      }

      // Buscamos si hay una reserva correspondiente a la celda
      // La fecha de las reservas está en UTC
      const reservation = reservations.value.find(
        (res) =>
          res.idResource === resource.idResource &&
          new Date(res.date) >= dateCell &&
          new Date(res.date) < endDateCell
      );

      if (reservation) {
        // Comprobamos si la reserva esta bloqueada temporalmente
        if (reservation.confirmed === false) {
          status[idCell] = {
            status: "temp-reserved",
            title: "Bloqueada temporalmente",
            icon: "lock",
          };
        } else {
          if (reservation.idUser === authStore.idUser) {
            status[idCell] = {
              status: "user-reserved",
              title: "Reserva",
              icon: "person",
            };
          } else {
            status[idCell] = {
              status: "reserved",
              title: "Ocupado",
              icon: "lock",
            };
          }
        }
      } else {
        status[idCell] = { status: "available", title: "", icon: "" };
      }
    });
  });
  return status;
});

// Propiedad computada que devuelve dos booleanos indicando si podemos navegar hacia adelante y hacia atras
const blockNavigation = computed(() => {
  // Seteamos la hora y los minutos a 0
  const todayDate = new Date(new Date().setHours(0, 0, 0, 0));

  // Para poder retroceder el día del calendario tiene que ser superior al día actual
  const blockBackward = calendarDate.value <= todayDate;

  // Para poder avanzar el día del calendario tiene que ser inferior al dia actual + X dias
  const upperDateLimit = new Date(
    todayDate.getTime() +
      (calendarConfig.value.maxDays - 1) * 24 * 60 * 60 * 1000
  );

  const blockForward = calendarDate.value >= upperDateLimit;
  return { blockBackward, blockForward };
});

/////////////////// FUNCIONES //////////////////
// Navegación
const prevDay = () => {
  const currentDate = new Date(calendarDate.value);
  // Restamos un día sin alterar la hora
  currentDate.setDate(currentDate.getDate() - 1);
  calendarDate.value = currentDate;
};

const nextDay = () => {
  const currentDate = new Date(calendarDate.value);
  // Sumamos un día a currentDate
  currentDate.setDate(currentDate.getDate() + 1);
  calendarDate.value = currentDate;
};

// Función que gestiona los cambios del select del día
const changeDay = (selectedDay) => {
  // Buscamos el indice dentro de availableDays del día seleccionado
  const index = availableDays.value.findIndex((day) => day === selectedDay);

  // El índice es el número de días a sumar
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  currentDate.setDate(currentDate.getDate() + index);
  calendarDate.value = currentDate;
};

// Función que gestióna el click en una celda
const handleClick = (idResource, hour) => {
  const cell = cellStatus.value[`${idResource}-${hour}`];

  if (cell.status === "available") {
    //console.log(`Reserva del recurso ${idResource} en el slot ${hour}`);
    const slot = hour.split(":"); // hour = "00:00"

    // Variable luxon
    const newReservationDate = displayedDay.value.date.set({
      hour: slot[0],
      minute: slot[1],
    });
    // Convertir a UTC y mostrar en formato ISO

    // Obtenemos el nombre del recurso
    const resource = resources.value.find(
      (res) => res.idResource === idResource
    );

    // Obtenemos el texto a mostrar con el día y el mes
    const dayName = displayedDay.value.date.toFormat("cccc"); // 'cccc' devuelve el nombre completo del día (por ejemplo, "jueves")
    const day = displayedDay.value.date.toFormat("dd"); // 'dd' devuelve el día con dos dígitos (por ejemplo, "12")
    const monthName = displayedDay.value.date.toFormat("MMMM"); // 'MMMM' devuelve el nombre completo del mes (por ejemplo, "diciembre")

    // Creamos el displayString que se mostrará el dialogo
    let displayString = "";

    if (luxonLocale === "es") {
      displayString = `${
        dayName.charAt(0).toUpperCase() + dayName.slice(1)
      } ${day} de ${monthName}`;
    } else {
      displayString = `${
        dayName.charAt(0).toUpperCase() + dayName.slice(1)
      } ${day} ${monthName}`;
    }

    // Actualizamos objeto que se pasará al q-dialog
    selectedReservation.value = {
      idUser: authStore.idUser || 0,
      idResource: idResource,
      resource: resource.name,
      resourceVal: resource.nameVal,
      date: newReservationDate.toUTC().toISO(), // Convertir a UTC y mostrar en formato ISO
      hour: hour,
      dateString: displayString,
      slotDuration: calendarConfig.value.slotDuration,
      fee: calendarConfig.value.fee,
    };

    showDialog.value = true;
  }
};

// Interacción API
const getReservations = async (startDate) => {
  isLoading.value = true;

  try {
    const response = await apiGetReservations(startDate);
    //console.log(response);

    // Convertir slotDuration a número y actualizar calendarConfig de manera directa
    calendarConfig.value = {
      ...response.appConfig,
      slotDuration: parseFloat(response.appConfig.slotDuration),
    };

    // Actualizamos los elementos bloqueados
    blockedDays.value = response.blockedDays;
    blockedSlots.value = response.blockedSlots;
    // Actualizamos los recursos
    resources.value = response.resources;
    // Actualizamos las reservas
    reservations.value = response.reservations;
  } catch (error) {
    //console.error(error);
    notify($q, t, error, "nok");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const closeDialog = () => {
  showDialog.value = false;
  selectedReservation.value = {};
};

const closeLegend = () => {
  showLegend.value = false;
};
</script>

<style scoped>
html,
body {
  height: 100%; /* Garantiza que la altura ocupe toda la ventana */
  margin: 0;
}

.q-page {
  display: flex;
  flex-direction: column;
  height: 100%; /* Asegura que la página ocupe toda la altura disponible */
  overflow: hidden; /* Esto evitará el scroll vertical por defecto */
}

/* Fondo general de la página */
.calendar-container {
  background-color: #f7f8fa;
  padding: 20px;
}

/* Estilo base de la tabla */
.calendar-table {
  width: 100%;
  border-spacing: 5px; /* Espaciado entre celdas */
  background-color: #f7f8fa; /* Fondo general de la tabla */
  user-select: none;
}

.calendar-table th,
.calendar-table td {
  text-align: center;
  padding: 10px;
  border-radius: 10px; /* Bordes redondeados */
}

/* Cabecera de las fechas */
.calendar-table thead tr:first-child th {
  background-color: #dee1e6; /* Fondo de las fechas */
  color: #74797f; /* Color del texto */
}

/* Cabecera de los recursos */
.calendar-table thead tr:nth-child(2) th {
  background-color: #eceff4; /* Fondo de los recursos */
  color: #666b71; /* Color del texto */
}

/* Estilos para celdas disponibles */
.available {
  background-color: #ffffff; /* Fondo para celdas disponibles */
  color: #4d4d4d; /* Color del texto */
  cursor: pointer; /* Cambiar el cursor a puntero */
}

/* Hover exclusivamente para celdas disponibles */
.available:hover {
  background-color: #dee1e6; /* Cambiar color al pasar el ratón */
}

/* Estilos para celdas reservadas */
.reserved {
  background-color: #ffdddd; /* Fondo para celdas reservadas */
  color: #a52d2d; /* Texto para celdas reservadas */
}

/* Estilos para celdas reservadas por el usuario */
.user-reserved {
  background-color: #daffe0; /* Fondo para reservas del usuario */
  color: #1b4618; /* Texto para reservas del usuario */
}

/* Estilos para celdas con reservas temporales */
.temp-reserved {
  background-color: #ffebb1; /* Fondo para reservas temporales */
  color: #b28a17; /* Texto para reservas temporales */
}

/* Estilo para celdas expiradas */
.expired {
  background-color: #ffffff; /* Mantener el fondo blanco */
  color: #4d4d4d; /* Texto */
  opacity: 0.3; /* Reducir opacidad */
  pointer-events: none; /* Deshabilitar interacción */
}

/* Estilo para celdas bloqueadas*/
.blocked {
  background-color: #ffffff; /* Mantener el fondo blanco */
  color: #4d4d4d; /* Texto */
  opacity: 0.3; /* Reducir opacidad */
  pointer-events: none; /* Deshabilitar interacción */
}

/* Botones de navegación */
.q-btn {
  opacity: 1; /* Opacidad por defecto */
  transition: opacity 0.3s ease;
}

.q-btn:disabled {
  opacity: 0.8; /* Opacidad reducida cuando están deshabilitados */
}
</style>

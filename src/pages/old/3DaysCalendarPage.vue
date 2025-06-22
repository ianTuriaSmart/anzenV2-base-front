<template>
  <q-page class="background-color">
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
        >
          {{ $t("tituloCalendario") }}
        </div>
        <div
          class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary"
        >
          {{ $t("tituloHome") }}
        </div>
      </div>

      <div class="calendar-container">
        <!-- Navegación del calendario -->
        <div class="q-mb-sm row justify-between">
          <q-btn
            @click="prevDay"
            :label="$t('retrocederDias')"
            :disable="blockNavigation.blockBackward"
            icon="keyboard_arrow_left"
            size="md"
            dense
            flat
            class="q-pr-md"
            style="text-transform: none; color: #666b71; border-radius: 10px;"
          ></q-btn>

          <q-btn
            @click="nextDay"
            :label="$t('avanzarDias')"
            :disable="blockNavigation.blockForward"
            icon-right="keyboard_arrow_right"
            size="md"
            dense
            flat
            class="q-pl-md"
            style="text-transform: none; color: #666b71; border-radius: 10px;"
          ></q-btn>
        </div>

        <!-- Tabla del calendario -->
        <table class="calendar-table">
          <thead>
            <!-- Encabezado de días -->
            <tr>
              <th
                v-for="day in displayedDays"
                :key="'day-' + day"
                :colspan="resources.length"
              >
                {{ day.displayString }}
              </th>
            </tr>

            <!-- Encabezado de recursos -->
            <tr>
              <template v-for="day in displayedDays">
                <th
                  v-for="resource in resources"
                  :key="
                    'resource-' +
                    resource.idResource +
                    '-' +
                    day.cellStatusString
                  "
                >
                  {{ locale === "es-ES" ? resource.name : resource.nameVal }}
                </th>
              </template>
            </tr>
          </thead>

          <tbody>
            <!-- Filas de horas -->
            <tr v-for="hour in timeSlots" :key="'hour-' + hour">
              <template v-for="day in displayedDays">
                <td
                  v-for="resource in resources"
                  :key="'cell-' + resource.idResource + '-' + day + '-' + hour"
                  :class="
                    cellStatus[
                      `${day.cellStatusString}-${resource.idResource}-${hour}`
                    ]?.status || 'available'
                  "
                  @click="handleClick(day, resource.idResource, hour)"
                >
                  <div class="cell-content">
                    <div class="row justify-center items-center">
                      <div>{{ hour }}</div>
                    </div>
                  </div>
                </td>
              </template>
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
import { date, is, useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
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

const authStore = useAuthStore(); // Consultamos la store para obtener el id del usuario

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q

const isLoading = ref(false); // Controla si la página esta cargando

const showDialog = ref(false); // Controla la visibilidad del dialog
const showLegend = ref(false); // Controla la visibilidad de la leyenda

const { locale, t } = useI18n(); // Usamos Vue i18n para obtener el idioma actual

// Constantes
//const CURRENT_ID_USER = 2;
//const TIME_SLOT_DURATION = 1.5;
//const START_HOUR = 8;
//const END_HOUR = 23;

// Configuración
const calendarDate = ref(new Date(new Date().setHours(0, 0, 0, 0)));

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
  // {
  //   idResource: 1,
  //   date: '2024-12-09T17:30:00Z',
  //   idUser: 1,
  //   confirmed: false,
  // },
]);


const blockedDays = ref([]); // Array que contiene los días no disponibles
const blockedSlots = ref([]); // Array que contiene los slots no disponibles

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

// Propiedad computada que devuelve un array con los 3 días a mostrar en formato string
const displayedDays = computed(() => {
  const days = [];

  // Según el idioma forzamos el locale
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  //console.log(luxonLocale);

  for (let i = 0; i < 3; i++) {
    // Crear la fecha en la zona horaria de España usamos LUXON
    const date = DateTime.fromJSDate(new Date(calendarDate.value))
      .setZone("Europe/Madrid") // Establecer la zona horaria
      .plus({ days: i }) // Sumamos el día correspondiente
      .setLocale(luxonLocale); // Establece la localización a español

    // Obtenemos el nombre del día en español (usamos el método 'toFormat' para especificar el formato)
    const dayName = date.toFormat("cccc"); // 'cccc' devuelve el nombre completo del día (por ejemplo, "jueves")
    // Obtenemos el día del mes
    const day = date.toFormat("dd"); // 'dd' devuelve el día con dos dígitos (por ejemplo, "12")
    // Obtenemos el mes en español (usamos 'toFormat' para obtener el nombre del mes)
    const monthName = date.toFormat("MMMM"); // 'MMMM' devuelve el nombre completo del mes (por ejemplo, "diciembre")
    //console.log(monthName);

    // OJO si es 'es' nos llega le mes sin artículo, pero si es 'ca' nos llega el mes con articulo
    let displayString = "";
    // Creamos el displayString que se mostrará en el calendario
    if (luxonLocale === "es") {
      displayString = `${
        dayName.charAt(0).toUpperCase() + dayName.slice(1)
      } ${day} de ${monthName}`;
    } else {
      displayString = `${
        dayName.charAt(0).toUpperCase() + dayName.slice(1)
      } ${day} ${monthName}`;
    }

    // Creamos la variable cellStatusString que utilizaremos para la comprobación de cellStatus
    const cellStatusString = format(date, "dd/MM/yyyy");

    days.push({
      date: date, // Objeto date para cuando hagamos click tenerlo
      displayString: displayString, // String para mostrar en el calendario
      cellStatusString: cellStatusString, // String para la comprobación de cellStatus
    });
  }
  //console.log(days);
  return days;
});

// Propiedad computada que generá los tramos horarios teniendo en cuenta TIME_SLOT_DURATION
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

  displayedDays.value.forEach((day) => {
    timeSlots.value.forEach((hour) => {
      resources.value.forEach((resource) => {
        // Generar el identificador único para cada celda
        const idCell = `${day.cellStatusString}-${resource.idResource}-${hour}`;

        // Generamos la fecha correspondiente a la celda en el día actual
        const [dayOfMonth, month, year] = day.cellStatusString.split("/"); // day en formato DD/MM/YYYY

        const dateCell = new Date(
          parseInt(year), // Año
          parseInt(month) - 1, // Mes
          parseInt(dayOfMonth), // Día
          hour.split(":")[0], // Hora
          hour.split(":")[1], // Minutos
          0
        );

        // Calculamos la fecha final de la celda
        const endDateCell = new Date(
          dateCell.getTime() + calendarConfig.value.slotDuration * 60 * 1000
        );

        // Blocked day {date, idResource}
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
  });
  //console.log(status);
  return status;
});

// Propiedad computada que devuelve dos booleanos indicando si podemos navegar hacia adelante y hacia atras
const blockNavigation = computed(() => {
  const todayDate = ref(new Date(new Date().setHours(0, 0, 0, 0)));

  // Para poder retroceder en el calendario, el día del calendario tiene que ser superior al dia actual
  const blockBackward = calendarDate.value <= todayDate.value;

  // Para poder avanzar en el calendario, el día del calendario tiene que ser inferior al dia actual + 3xMAX_BLOCKS

  const upperDateLimit = new Date(
    todayDate.value.getTime() +
      calendarConfig.value.maxDays * 24 * 60 * 60 * 1000
  );

  // Creamos una nueva variable que contenga calendarDate + 3 días que es la resolución
  const lowerDateLimit = new Date(
    calendarDate.value.getTime() + 3 * 24 * 60 * 60 * 1000
  );
  const blockForward = upperDateLimit <= lowerDateLimit;

  return { blockBackward, blockForward };
});

/////////////////// FUNCIONES //////////////////

// Navegación
const prevDay = () => {
  const currentDate = new Date(calendarDate.value);
  // Restamos tres días sin alterar la hora
  currentDate.setDate(currentDate.getDate() - 3);
  calendarDate.value = currentDate;
};

const nextDay = () => {
  const currentDate = new Date(calendarDate.value);
  // Sumamos tres días a currentDate
  currentDate.setDate(currentDate.getDate() + 3);
  calendarDate.value = currentDate;
};

// Función que gestióna el click en una celda
const handleClick = (day, idResource, hour) => {
  const cell =
    cellStatus.value[`${day.cellStatusString}-${idResource}-${hour}`];

  if (cell.status === "available") {
    const slot = hour.split(":"); // hour = "00:00"

    // Variable luxon
    const newReservationDate = day.date.set({ hour: slot[0], minute: slot[1] });

    // Obtenemos el nombre del recurso
    const resource = resources.value.find(
      (res) => res.idResource === idResource
    );

    // Actualizamos objeto que se pasará al q-dialog
    selectedReservation.value = {
      idUser: authStore.idUser || 0,
      idResource: idResource,
      resource: resource.name,
      resourceVal: resource.nameVal,
      date: newReservationDate.toUTC().toISO(), // Convertir a UTC y mostrar en formato ISO
      dateString: day.displayString,
      hour: hour,
      slotDuration: calendarConfig.value.slotDuration,
      fee: calendarConfig.value.fee,
    };

    //console.log(selectedReservation.value);
    showDialog.value = true;
  }
};

// Interacción API
const getReservations = async (startDate) => {
  isLoading.value = true; // Empieza el proceso de carga

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
    //console.log(resources.value);

    // Actualizamos las reservas
    reservations.value = response.reservations;
    //console.log(reservations.value);
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
  padding: 0 20px 20px 20px;
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
  opacity: 0.3; /* Opacidad reducida cuando están deshabilitados */
}
</style>

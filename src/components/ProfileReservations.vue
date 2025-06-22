<template>
  <div class="row q-mt-md" style="width: 100%;">
    <!-- Versión ordenador, mostramos todos los campos de la reserva por fila -->
    <q-list
      class="text-primary scrollable-list desktop-only horizontal-scroll"
      style="width: 100%;"
      >
    
      <q-item
        v-for="(item, index) in userReservations"
        :key="index"
        class="q-mt-md justify-evenly row item-horizontal"
        style=" border-radius: 10px; background-color: #DEE1E6; width: 100%;"
        >

          <!-- Elementos de la lista-->
          <!-- Código -->
          <div class="row" style="width: 170px;">
            <q-item clickable style="border-radius: 10px;" @click="getQRCode(index)">
            <q-item-section side>
              <q-avatar square color="white" icon="qr_code" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section >
              <q-item-label caption>{{ $t('codigo') }}</q-item-label>
              <q-item-label>{{ $t('verCodigo') }}</q-item-label>
            </q-item-section>
            </q-item>
          </div>
          
          <!-- Instalación -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" :icon="getResourceIcon(item.resource)" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
              <q-item-label>
                {{ $t(item.resource) }}
                <template v-if="item.lightSup">+ {{ $t('luz') }}</template>
              </q-item-label>
            </q-item-section>
          </div>

          <!-- Ubicación -->
          <div class="row" style="width: 170px;">
            <q-item clickable style="border-radius: 10px;" @click="getMapsLink( index)">
              <q-item-section side>
                <q-avatar square color="white" icon="location_on" size="48px" style="border-radius: 10px;">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>{{ $t('ubicacion') }}</q-item-label>
                <q-item-label>{{ $t('maps') }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          
          <!-- Fecha -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('fecha') }}</q-item-label>
              <q-item-label>{{ item.displayDate }}</q-item-label>
            </q-item-section>
          </div>

          <!-- Hora -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="schedule" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('hora') }}</q-item-label>
              <q-item-label>{{ ['mañana', 'tarde', 'diario'].includes(item.displayHour) ? $t(item.displayHour) : item.displayHour }}</q-item-label>
            </q-item-section>
          </div>


          <!-- Duracion -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="timelapse" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('duracion') }}</q-item-label>
              <q-item-label v-if="item.slotDuration">{{ item.slotDuration }} min</q-item-label>
              <q-item-label v-else="item.slotDuration"> - </q-item-label>
            </q-item-section>
          </div>

          <!-- Precio -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('precio') }} </q-item-label>
              <q-item-label>{{ item.fee }} €</q-item-label>
            </q-item-section>
          </div>

      </q-item>
    </q-list>

    <!-- Versión móvil, mostramos solo fecha y hora -->
    <div class="text-center text-caption mobile-only text-primary">
      {{ $t('msgDetalleReserva') }}
    </div>

    <q-list
      class="text-primary scrollable-list mobile-only"
      style="width: 100%;"
      >
      
      <q-item
        v-for="(item, index) in userReservations"
        :key="index"
        class="q-mt-md"
        style="width: 100%; border-radius: 10px; background-color: #DEE1E6;"
        >

          <!-- Elementos de la lista-->
          <!-- Fecha -->
          <div class="row flex flex-center" clickable @click="getReservationDetail(index)">
            <q-item-section side>
              <q-avatar square color="white" icon="calendar_today" size="30px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('fecha') }}</q-item-label>
              <q-item-label>{{ item.displayDate }} {{ item.displayHour }}</q-item-label>
            </q-item-section>
          </div>
        
          <!-- Código QR -->
          <div class="row flex flex-center q-px-sm q-mr-md" clickable @click="getQRCode(index)">
            <q-item-section side>
              <q-avatar square color="white" icon="qr_code" size="30px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('codigo') }}</q-item-label>
              <q-item-label>{{ $t('verCodigo') }}</q-item-label>
            </q-item-section>
          </div>
      </q-item>
    </q-list>
  </div>
          
  <!-- Dialogo para mostrar el detalle de la reserva -->
    <q-dialog v-model="showDialogReservationDetail">
      <ReservationDetail
        @close="closeReservationDetail"
        :reservation="selectedReservation"
        :resourcesGroups="resourcesGroups"
        />
    </q-dialog>

    <!-- Dialogo código QR -->
    <q-dialog v-model="showDialogQR">
      <DialogQRCode
        @close="closeDialogQR"
        :url="selectedQR"
        />
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch} from "vue";
import { useI18n } from 'vue-i18n';
import ReservationDetail from "src/components/DialogReservationDetail.vue";
import { DateTime } from 'luxon';
import DialogQRCode from "src/components/DialogQRCode.vue";
import { getResourceIcon } from 'src/utils/resourceIcon.js';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';


const { locale } = useI18n(); // Hook para acceder a las traducciones

const showDialogReservationDetail = ref(false); // Controla la visibilidad del dialog que muestra el detalle de la reserva en la vista movil
const showDialogQR = ref(false); // Controla la visibilidad del dialogo que muestra el código QR

// Variable que tendrá los datos de la reserva seleccionada
const selectedReservation = ref({});

// Variable que tendrá la url de la reserva seleccionada
const selectedQR = ref({});

const userReservations = ref([]);


const resourcesGroups = ref([]);

const props = defineProps({
  userReservations: {
    type: Array,
    required: true
  }
});

onMounted(() => {
  // Leemos info de los recursos de la session storage
  resourcesGroups.value = sessionStorageUtils.get('resourcesGroups');

  userReservations.value = props.userReservations;

  updateDisplayDates();  // <-- Añades esta línea
  //console.log(userReservations.value);
});


// Función que obtiene los textos de las fechas y horas en el idioma correspondiente
const updateDisplayDates = () => {
  const luxonLocale = locale.value === 'es-ES' ? 'es' : 'ca';
  for (let i = 0; i < userReservations.value.length; i++) {
    const reservation = userReservations.value[i];

    // Convertimos la fecha a un objeto luxon
    const date = DateTime.fromISO(reservation.startDate)
      .setZone('Europe/Madrid')
      .setLocale(luxonLocale);

    // Formatear fecha y hora
    //const dayName = date.toFormat('cccc'); // Nombre del día
    const day = date.toFormat('dd'); // Día del mes
    const monthName = date.toFormat('MMMM'); // Nombre del mes
    let hour = date.toFormat('HH:mm'); // Hora

    // Construir displayDate según el idioma
    reservation.displayDate =
      luxonLocale === 'es'
        ? `${day} de ${monthName}`
        : `${day} ${monthName}`;

    if (reservation.typeSlot === 'partial' && hour === '08:00' || reservation.typeSlot === 'partial' && hour === '15:00') {
      hour = hour === '08:00' ? 'mañana' : 'tarde';
    } else if (reservation.typeSlot === 'daily' && hour === '17:00') {
      hour = 'diario';
    };

    reservation.displayHour = hour;
  }
};

// Watcher que detectara los cambios de idioma
// Actualizar las fechas dinámicamente al cambiar el idioma
watch(locale, () => {
  updateDisplayDates();
});


// Métodos que nos vienen desde el dialogo de detalle de reserva (vista movil)
// Función que muestra el dialogo de detalle de reserva
const getReservationDetail = (index) => {
 //console.log(userReservations.value[index]);
  selectedReservation.value = userReservations.value[index];
  console.log("Selected reservation:", selectedReservation.value);
  showDialogReservationDetail.value = true;
};

// Función que cierra el dialogo de detalle de reserva
const closeReservationDetail = () => {
  showDialogReservationDetail.value = false;
  selectedReservation.value = null;
};


// Función que abre el link de google maps según el recurso
const getMapsLink = (index) => {
  const reservation = userReservations.value[index];
  const resourceName = reservation.resource;

  // Buscar el recurso dentro de todos los grupos por nombre
  const resource = resourcesGroups.value
    .flatMap(group => group.resources)
    .find(r => r.resource === resourceName);

  const link = resource?.locationUrl;

  if (link) {
    window.open(link, '_blank');
  };
};
// Función que obtiene el código QR de la reserva seleccionada
const getQRCode = (index) => {
  selectedQR.value = userReservations.value[index].reservationCode;
  showDialogQR.value = true;
  //console.log(userReservations.value[index].reservationCode);
};

const closeDialogQR = () => {
  showDialogQR.value = false;
  selectedQR.value = null;
};




</script>

<style lang="scss" scoped>
.scrollable-list {
  max-height: 430px; /* Tamaño máximo */
  overflow-y: auto; /* Habilitar scroll vertical */
  scrollbar-width: thin; /* Opcional: Estilo para navegadores modernos */
}

.scrollable-list::-webkit-scrollbar {
  width: 8px; /* Tamaño del scrollbar para navegadores WebKit */
}

.scrollable-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* Color del thumb del scrollbar */
  border-radius: 4px;
}

.item-horizontal {
  min-width: fit-content; /* Mínimo espacio según contenido real */
  display: inline-flex; /* Que cada q-item se comporte como un bloque horizontal */
  align-items: center; /* Centrar verticalmente */
}

</style>
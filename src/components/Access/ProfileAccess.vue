<template>
  <div class="row q-mt-md" style="width: 100%;">
    <!-- Versión ordenador, mostramos todos los campos de la reserva por fila -->
    <q-list
      class="text-primary scrollable-list desktop-only horizontal-scroll"
      style="width: 100%;"
      >
    
      <q-item
        v-for="(item, index) in userAccess"
        :key="index"
        class="q-mt-md justify-evenly row item-horizontal"
        style=" border-radius: 10px; background-color: #DEE1E6; width: 100%;"
        >

          <!-- Elementos de la lista-->
          <!-- Código QR -->
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
          
          <!-- Fecha Inicio -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('fechaInicial') }}</q-item-label>
              <q-item-label>{{ item.displayStartDate }}</q-item-label>
            </q-item-section>
          </div>

          <!-- Fecha Fin -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('fechaFinal') }}</q-item-label>
              <q-item-label>{{ item.displayEndDate }}</q-item-label>
            </q-item-section>
          </div>

          <!-- Tipo de acceso -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="confirmation_number" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('tipoAcceso') }}</q-item-label>
              <q-item-label> {{ translateAccessType(item.accessType, t) }} </q-item-label>
            </q-item-section>
          </div>

          <!-- Precio -->
          <div class="row" style="width: 170px;">
            <q-item-section side>
              <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('precio') }}</q-item-label>
              <q-item-label> {{ item.fee }} € </q-item-label>
            </q-item-section>
          </div>


          <!-- Campo "Días pendientes" -->
          <div class="row" style="width: 170px;" v-show="true">
            <q-item-section side>
              <q-avatar square color="white" icon="123" size="48px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('diasPendientes') }}</q-item-label>
              <q-item-label>
                <span v-if="/^bonus\d+$/.test(item.accessType)">
                  {{ item.remainingDays }}
                </span>
                <span v-else style="opacity: 0;">0</span> <!-- Espacio reservado invisible -->
              </q-item-label>
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
        v-for="(item, index) in userAccess"
        :key="index"
        class="q-mt-md"
        style="width: 100%; border-radius: 10px; background-color: #DEE1E6;"
        >

          <!-- Elementos de la lista-->
          <!-- Fecha Inicial -->
          <div class="row flex flex-center" clickable @click="getAccessDetail(index)">
            <q-item-section side>
              <q-avatar square color="white" icon="calendar_today" size="30px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('fechaInicial') }}</q-item-label>
              <q-item-label>{{ item.displayStartDate }}</q-item-label>
            </q-item-section>
          </div>

          <!-- Instalación -->
          <!-- <div class="row q-ml-md flex flex-center" clickable @click="getAccessDetail(index)">
            <q-item-section side>
              <q-avatar square color="white" :icon="getResourceIcon(item.resource)" size="30px" style="border-radius: 10px;">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
              <q-item-label>
                {{ $t(item.resource) }}
              </q-item-label>
            </q-item-section>
          </div> -->

        
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
    <q-dialog v-model="showDialogAccessDetail">
      <DialogAccessDetail
        @close="closeAccessDetail"
        :access="selectedAccess"
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
import DialogAccessDetail from "src/components/Access/DialogAccessDetail.vue";
import { DateTime } from 'luxon';
import DialogQRCode from "src/components/DialogQRCode.vue";
import { getResourceIcon } from 'src/utils/resourceIcon.js';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { translateAccessType } from 'src/utils/translateAccessType';


const { locale, t } = useI18n(); // Hook para acceder a las traducciones

const showDialogAccessDetail = ref(false); // Controla la visibilidad del dialog que muestra el detalle de la reserva en la vista movil
const showDialogQR = ref(false); // Controla la visibilidad del dialogo que muestra el código QR

// Variable que tendrá los datos de la reserva seleccionada
const selectedAccess = ref({});

// Variable que tendrá la url de la reserva seleccionada
const selectedQR = ref({});

const userAccess = ref([]);


const resourcesGroups = ref([]);

const props = defineProps({
  userAccess: {
    type: Array,
    required: true
  }
});

onMounted(() => {
  //console.log("Entro en ProfileAccess");
  // Leemos info de los recursos de la session storage
  resourcesGroups.value = sessionStorageUtils.get('resourcesGroups');

  userAccess.value = props.userAccess;
  console.log(userAccess.value);

  updateDisplayDates();  // <-- Añades esta línea
  //console.log(userReservations.value);
});


// Función que obtiene los textos de las fechas y horas en el idioma correspondiente
const updateDisplayDates = () => {
  const luxonLocale = locale.value === 'es-ES' ? 'es' : 'ca';
  for (let i = 0; i < userAccess.value.length; i++) {
    const access = userAccess.value[i];

    // Convertimos la fecha a un objeto luxon
    const startDate = DateTime.fromISO(access.startDate)
      .setZone('Europe/Madrid')
      .setLocale(luxonLocale);

    const endDate = DateTime.fromISO(access.endDate)
      .setZone('Europe/Madrid')
      .setLocale(luxonLocale);


    // Formatear fecha y hora
    //const dayName = date.toFormat('cccc'); // Nombre del día
    const startDay = startDate.toFormat('dd'); // Día del mes
    const startMonthName = startDate.toFormat('MMMM'); // Nombre del mes

    const endDay = endDate.toFormat('dd'); // Día del mes
    const endMonthName = endDate.toFormat('MMMM'); // Nombre del mes
    

    // Construir displayDate según el idioma
    access.displayStartDate =
      luxonLocale === 'es'
        ? `${startDay} de ${startMonthName}`
        : `${startDay} ${startMonthName}`;

    access.displayEndDate =
      luxonLocale === 'es'
        ? `${endDay} de ${endMonthName}`
        : `${endDay} ${endMonthName}`;

  }
};

// Watcher que detectara los cambios de idioma
// Actualizar las fechas dinámicamente al cambiar el idioma
watch(locale, () => {
  updateDisplayDates();
});


// Métodos que nos vienen desde el dialogo de detalle de reserva (vista movil)
// Función que muestra el dialogo de detalle de reserva
const getAccessDetail = (index) => {
 //console.log(userReservations.value[index]);
  selectedAccess.value = userAccess.value[index];
  showDialogAccessDetail.value = true;
};

// Función que cierra el dialogo de detalle de reserva
const closeAccessDetail = () => {
  showDialogAccessDetail.value = false;
  selectedAccess.value = null;
};


// Función que abre el link de google maps según el recurso
const getMapsLink = (index) => {
  const access = userAccess.value[index];
  const resourceName = access.resource;

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
  selectedQR.value = userAccess.value[index].qr;
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
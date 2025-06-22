<template>

  <!-- Row que contiene el título -->
  <div class="row justify-center q-mx-lg">
    <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
      {{ $t('tituloConfirmacion') }}
    </div>
  </div>

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
  
  <!--Div que engloba todos los elementos debajo del subtitulo para ocultarlos con el spinner -->
  <div v-if="!isLoading">

    <!-- Div que contiene la tarjeta de reserva confirmada correctamente y explicación -->
    <div class="row justify-center q-mt-md">
      <q-card
        flat
        class="q-mx-md"
        style="border-radius: 30px; background: #daffe0; color: #1b4618;"
        >
        <q-card-section style="padding: 0px 0px;">
          <div class="row no-wrap justify-center items-center q-pl-md q-pr-md">
              <q-avatar>
                <q-icon name="done" size="sm" />
              </q-avatar>
              
              <div class="text-h7 text-weight-bold text-center q-my-sm q-mr-md">
                {{ $t('reservaConfirmada') }}
              </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Div que contiene información sobre la reserva -->
    <div class="row justify-center q-mt-md q-mx-lg text-primary">
      <q-card
        flat
        style=" background: #f7f8fa;"
        >
        <q-card-section style="padding: 0px 0px;">
        
          <!-- Avatar + info -->
          <div
            class="row text-h7  flex-center q-ml-sm q-mr-lg"
            style="display: flex; ;"
            >
            
            <!-- Info -->
            <div  class= text-center style="max-width: 700px;">
              {{ $t('msgInfoReservaConfirmada') }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Div que contiene las dos tarjetas-->
    <div v-if="!isLoading" class="row justify-center q-mt-xs q-mb-lg">
      <!-- 1. Tarjeta de la reserva-->
      <q-card
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        >

        <q-card-section>
          <!-- Row que contiene el título -->
          <div class="row justify-center">
            <div class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary">
              {{ $t('tituloVentanaReserva') }}
            </div>
          </div>

          <!-- Row que contiene la primera fila de avatares -->
          <div class="row">
            <div class="col">
              <q-item >
                  <q-item-section side>
                    <q-avatar square color="white" :icon="getResourceIcon(reservation.resource)" size="48px" style="border-radius: 10px;">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                    <q-item-label>
                      {{ $te(reservation.resource) ? $t(reservation.resource) : reservation.resource }}
                      <template v-if="reservation.lightSup">+ {{ $t('luz') }}</template>
                    </q-item-label>
                  </q-item-section>
              </q-item>
            </div>

            <div class="col">
              <q-item clickable style="border-radius: 10px;" @click="getMapsLink()" >
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
                    <q-item-label>{{ displayedHour }}</q-item-label>
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
                    <q-item-label> {{ reservation.reservationFee === '0' ? $t('gratuito') : `${reservation.reservationFee} €` }}</q-item-label>
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
                    <q-item-label v-if="reservation.slotDuration">{{ reservation.slotDuration }} min</q-item-label>
                    <q-item-label v-else> - </q-item-label>
                  </q-item-section>
                </q-item>
            </div>
          </div>

          
        </q-card-section>
      </q-card>

      <!-- Div que contiene la tarjeta con el código QR -->
      <!-- <q-card
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        > -->

        <!-- <q-card-section> -->
          <!-- Row que contiene el título -->
          <!-- <div class="row justify-center q-mx-md"> -->
            <!-- <div class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary">
              {{ $t('tituloVentanaQR') }}
            </div> -->
            <!-- <div class="col-12 col-md-8 text-center text-caption  text-primary">
              {{ $t('subtituloVentanaQR') }}
            </div> -->
          <!-- </div> -->

          <!-- Row que contiene el QR Code -->
          <!-- <div class="row justify-center q-my-sm">
            <img :src="reservation.code" class="q-mx-auto" style="max-width: 125px; border-radius: 10px;">
          </div>
          </q-card-section> -->
      <!-- </q-card> -->

      <!-- 2. Tarjeta datos de usuario -->
      <q-card
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        >

        <q-card-section>
          <!-- Row que contiene el título -->
          <div class="row justify-center">
            <div class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary">
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
                    <q-item-label> {{ reservation.userName }} </q-item-label>
                  </q-item-section>
              </q-item>
            </div>

            <!-- <div class="col">
              <q-item >
                  <q-item-section side>
                    <q-avatar square color="white" icon="person" size="48px" style="border-radius: 10px;">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ $t('apellidos') }}</q-item-label>
                    <q-item-label> {{ reservation.userSurname }} </q-item-label>
                  </q-item-section>
                </q-item>
            </div> -->
          </div>

          <!-- Row que contiene la segunda fila de avatares -->
          <div class="row">
            <div class="col">
              <q-item >
                  <q-item-section side>
                    <q-avatar square color="white" icon="mail" size="48px" style="border-radius: 10px;">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ $t('email') }}</q-item-label>
                    <q-item-label>{{ reservation.userEmail }}</q-item-label>
                  </q-item-section>
              </q-item>
            </div>    
          </div>

          <!-- Row que contiene la tercera fila de avatares -->
          <div class="row">
            <div class="col">
              <q-item >
                  <q-item-section side>
                    <q-avatar square color="white" icon="badge" size="48px" style="border-radius: 10px;">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ $t('dni') }}</q-item-label>
                    <q-item-label>{{ reservation.userIdDocument }}</q-item-label>
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
                    <q-item-label>{{ reservation.userPhone }}</q-item-label>
                  </q-item-section>
                </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Div que contiene el boton salir cuando se ha confirmado la reserva -->
    <div class="row q-mb-lg q-mt-lg justify-center q-gutter-x-md">
      <div>
        <q-btn
          color="primary"
          :label="$t('btnSalir')"
          no-caps
          size="md"
          type="button"
          @click="exitReservation()"
          style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { apiConfirmReservation } from 'src/services/apiReservations';
import { DateTime } from 'luxon';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { getResourceIcon } from 'src/utils/resourceIcon.js';



const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const reservation = ref({
});




const isLoading = ref(false); // Variable para cargar spinner de carga


onMounted( async() => {
  try {
    //console.log("Entramos en ConfirmationOk");
    isLoading.value = true;

    // Lo primero es comprobar que tenemos una reserva en el sessionStorage
    if (!sessionStorageUtils.get('reservation') || !sessionStorageUtils.get('user')) {
      router.push('/');
      return;
    }

    const storedReservation = sessionStorageUtils.get('reservation').reservation;
    const storedUser = sessionStorageUtils.get('user');
    //console.log("Stored reservation:", storedReservation);
    
    const response = await apiConfirmReservation(
      locale.value,
      storedReservation.idResource,
      storedReservation.date,
      storedReservation.reservationFee,
      storedReservation.lightSup,
      storedReservation.idUserType,
      storedUser);

    reservation.value = response.reservation;
    //console.log("Reserva backend",response.reservation);
    const { dateString, hour } = formatDate(response.reservation);
    reservation.value.dateString = dateString;
    reservation.value.hour = hour;
  

    //console.log("Reserva session:" , sessionStorageUtils.get('reservation'));
    
  } catch (error) {
    console.log(error);
    notify($q, t, error, 'nok');
    router.push('/');
  } finally {
    isLoading.value = false;
    // Borramos del sessionStorage
    sessionStorageUtils.remove('reservation');
    sessionStorageUtils.remove('user');

  }  
});


// Función que obtendra el dateString según el idioma
const formatDate = (res) => {
  const luxonLocale = locale.value === 'es-ES' ? 'es' : 'ca';

  const date = DateTime.fromFormat(
    res.date,
    "yyyy-MM-dd'T'HH:mm:ss",
    {
      zone: "Europe/Madrid",
      locale: luxonLocale
    }
  );

  const dayName = date.toFormat('cccc');
  const day = date.toFormat('dd');
  const monthName = date.toFormat('LLLL');
  let hour = date.toFormat('HH:mm');

  const dateString =
    luxonLocale === 'es'
      ? `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} de ${monthName}`
      : `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day} ${monthName}`;

  if (res.typeSlot === 'partial') {
    hour = hour === '08:00' ? 'mañana' : 'tarde';
  } else if (res.typeSlot === 'daily') {
    hour = 'diario';
  }

  return { dateString, hour };
};

// Función que abre el link de google maps según el recurso
const getMapsLink = () => {
  const group = sessionStorageUtils.get('selectedGroup');
  const resourceName = reservation.value.resource;

  const resource = group.resources.find(r => r.resource === resourceName);
  const link = resource?.locationUrl;

  if (link) {
    window.open(link, '_blank');
  };
};
// Watcher que detectara los cambios de idioma
// Actualizar las fechas dinámicamente al cambiar el idioma
watch(locale, () => {
  
  const { dateString, hour } = formatDate(reservation.value);

  reservation.value.dateString = dateString;
  reservation.value.hour = hour; 

});


const displayedHour = computed(() => {
  if (!reservation.value?.hour) return '';

  if (reservation.value.typeSlot === 'partial' || reservation.value.typeSlot === 'daily') {
    return t(reservation.value.hour);
  }

  return reservation.value.hour;
});


const exitReservation = () => {

  // Redirigir a la página de inicio
  router.push('/').then(() => {
    // Forzar la recarga de la página al llegar a la página de inicio
    window.location.reload();
  });

};


</script>

<style lang="scss" scoped>

</style>


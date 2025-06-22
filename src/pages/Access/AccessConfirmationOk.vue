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
                    <q-avatar square color="white" :icon="getResourceIcon(access.resource)" size="48px" style="border-radius: 10px;">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                    <q-item-label>
                      {{ access?.resource ? ($te(access.resource) ? $t(access.resource) : access.resource) : '' }}
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
                  <q-avatar square color="white" icon="person" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('tipo') }}</q-item-label>
                  <q-item-label>{{  $t(access.accessTypeGroup) }} {{ access.accessType ? translateAccessType(access.accessType, t) : '' }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col">
              <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('precio') }}</q-item-label>
                  <q-item-label>{{ access.fee }} €</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

          <!-- Row que contiene la tercera fila de avatares -->
          <div class="row">
            <div class="col">
              <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fechaInicial') }}</q-item-label>
                  <q-item-label>{{ access.startDateString }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col">
              <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fechaFinal') }}</q-item-label>
                  <q-item-label>{{ access.endDateString }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>

       

        </q-card-section>
      </q-card>

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
                    <q-item-label caption>{{ $t('nombreCompleto') }}</q-item-label>
                    <q-item-label> {{ access.userName }} </q-item-label>
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
                    <q-item-label> {{ access.userSurname }} </q-item-label>
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
                    <q-item-label>{{ access.userEmail }}</q-item-label>
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
                    <q-item-label>{{ access.userIdDocument }}</q-item-label>
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
                    <q-item-label>{{ access.userPhone }}</q-item-label>
                  </q-item-section>
                </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 3. Tarjeta para incluir a los familiares -->
      <q-card
        v-if="access.accessType?.includes('family')"
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        >

        <q-card-section class="q-mb-md">
          <!-- Título -->
          <div class="row justify-center">
            <div class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary">
              {{ $t('miembrosFamilia') }}
            </div>
          </div>

          <!-- 🔹 Vista de lista si está confirmado -->
          <template v-if="familyMembers.length > 0 && access.accessType?.includes('family')">
            <q-list bordered separator class="q-mb-md" style="border-radius: 10px;">
              <q-item v-for="(member, index) in familyMembers" :key="index">
                <q-item-section>
                  <q-item-label>
                    {{ $t('miembro') }} {{ index + 1 }}: {{ member }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
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
          @click="exitAccess()"
          style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { apiConfirmAccess } from 'src/services/apiAccess';
import { DateTime } from 'luxon';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { getResourceIcon } from 'src/utils/resourceIcon.js';
import { translateAccessType } from 'src/utils/translateAccessType';



const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const access = ref({
  resource: '',
  accessType: '',
  accessTypeGroup: '',
  startDateString: '',
  endDateString: '',
  fee: 0,
  userName: '',
  userSurname: '',
  userIdDocument: '',
  userPhone: '',
  userEmail: '',
});

const familyMembers = ref([]);


const isLoading = ref(false); // Variable para cargar spinner de carga


onMounted( async() => {
  try {
    //console.log("Entramos en ConfirmationOk");
    isLoading.value = true;

    // Lo primero es comprobar que tenemos una reserva en el sessionStorage
    if (!sessionStorageUtils.get('access') || !sessionStorageUtils.get('user')) {
      router.push('/');
      return;
    }

    const storedAccess = sessionStorageUtils.get('access').access;
    const storedUser = sessionStorageUtils.get('user');
    familyMembers.value = storedUser.familyMembers;
    //console.log("Stored access:", storedAccess);

    //console.log("Stored access:", storedAccess);
    
    const response = await apiConfirmAccess(
      locale.value,
      storedAccess.idResource,
      storedAccess.startDate,
      storedAccess.endDate,
      storedAccess.accessType,
      storedAccess.fee,
      storedUser,
    );

    access.value = response.access;
    //console.log("Reserva backend",response.access);
    const { startDateString, endDateString } = formatDate(response.access);
    access.value.startDateString = startDateString;
    access.value.endDateString = endDateString;
  

    //console.log("Acceso session:" , sessionStorageUtils.get('access'));
    
  } catch (error) {
    console.log(error);
    notify($q, t, error, 'nok');
    router.push('/');
  } finally {
    isLoading.value = false;
    // Borramos del sessionStorage
    sessionStorageUtils.remove('access');
    sessionStorageUtils.remove('user');

  }  
});


// Función que obtendra el dateString según el idioma
const formatDate = (res) => {
  const luxonLocale = locale.value === 'es-ES' ? 'es' : 'ca';

  const startDate = DateTime.fromFormat(
    res.startDate,
    "yyyy-MM-dd'T'HH:mm:ss",
    {
      zone: "Europe/Madrid",
      locale: luxonLocale
    }
  );

  const startDayName = startDate.toFormat('cccc');
  const startDay = startDate.toFormat('dd');
  const startMonthName = startDate.toFormat('LLLL');

  const startDateString =
    luxonLocale === 'es'
      ? `${startDayName.charAt(0).toUpperCase() + startDayName.slice(1)} ${startDay} de ${startMonthName}`
      : `${startDayName.charAt(0).toUpperCase() + startDayName.slice(1)} ${startDay} ${startMonthName}`;

  const endDate = DateTime.fromFormat(
    res.endDate,
    "yyyy-MM-dd'T'HH:mm:ss",
    {
      zone: "Europe/Madrid",
      locale: luxonLocale
    }
  );

  const endDayName = endDate.toFormat('cccc');
  const endDay = endDate.toFormat('dd');
  const endMonthName = endDate.toFormat('LLLL');

  const endDateString =
    luxonLocale === 'es'
      ? `${endDayName.charAt(0).toUpperCase() + endDayName.slice(1)} ${endDay} de ${endMonthName}`
      : `${endDayName.charAt(0).toUpperCase() + endDayName.slice(1)} ${endDay} ${endMonthName}`;

  return { startDateString, endDateString };
};

// Función que abre el link de google maps según el recurso
const getMapsLink = () => {
  const group = sessionStorageUtils.get('selectedGroup');
  const resourceName = access.value.resource;

  const resource = group.resources.find(r => r.resource === resourceName);
  const link = resource?.locationUrl;

  if (link) {
    window.open(link, '_blank');
  };
};
// Watcher que detectara los cambios de idioma
// Actualizar las fechas dinámicamente al cambiar el idioma
watch(locale, () => {
  
  const { startDateString, endDateString } = formatDate(access.value);

  access.value.startDateString = startDateString;
  access.value.endDateString = endDateString;

});




const exitAccess = () => {

  // Redirigir a la página de inicio
  router.push('/').then(() => {
    // Forzar la recarga de la página al llegar a la página de inicio
    window.location.reload();
  });

};


</script>

<style lang="scss" scoped>

</style>


<template>
  <q-card
      class=" q-ml-xs text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
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
                  <q-avatar square color="white" :icon="getResourceIcon($t(access.resource))" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                  <q-item-label>{{ $t(access.resource) }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item clickable style="border-radius: 10px;" @click="getMapsLink()">
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

        <!-- Row que contiene la tercera fila de avatares -->
        <div class="row">

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="confirmation_number" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('tipoAcceso') }}</q-item-label>
                  <q-item-label >{{ $t(access.accessTypeGroup) }} {{ translateAccessType(access.accessType, t) }} </q-item-label>
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
                  <q-item-label>{{ props.access.slotTariffs[0].amount }} € </q-item-label>
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
        
      
        <!-- Row que contiene la posibilidad del pago en efectivo -->
        <div v-if="authStore.role===100" class="column flex flex-center q-mt-sm">
          <q-checkbox
              v-model="cashPayment"
              :label = "$t('pagoEfectivo')"
              color="primary"
            />

            <!-- <q-input v-if="cashPayment"
            class = "q-mt-md"
            outlined
            label-color="primary"
            :input-style="{ color: '#00406e' }"
            v-model="cashEmail"
            :label="$t('email')"
            dense
            name="email"
            :rules="[checkEmail]"
            autocomplete="username"
            style="width: 80%"
          ></q-input> -->
        </div>

        <!-- Row que contiene la fila con los botones -->
        <div class="row q-mb-lg q-mt-lg">
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnCancelar')"
              no-caps
              size="md"
              type="button"
              @click="$emit('close')"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnReservar')"
              no-caps
              size="md"
              @click="confirmAccess()"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        </div>

      </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'; // Importamos el router
import { useAuthStore } from 'src/stores/authStore.js';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { useI18n } from "vue-i18n";
import { getResourceIcon } from 'src/utils/resourceIcon.js';
import { translateAccessType } from 'src/utils/translateAccessType';
import { notify } from 'src/utils/notify';


const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const { t } = useI18n(); // Hook para acceder a las traducciones

const authStore = useAuthStore();

const router = useRouter(); // Instancia del router de Vue



// Define los eventos que emitirá el componente
const emit = defineEmits(['close']);

// Definimos props que recibirá el componente
const props = defineProps({
  access: {
    type: Object,
    required: true,
    default: () => ({})
  }
});


// Variables que utilizamos para el pago en efectivo si el usuario es admin
// Estado local para checkbox e input
const cashPayment = ref(false);





const confirmAccess = () => {



  // Actualizamos la reserva en la sessionStorage
  const accessInfo = {
    idResource: props.access.idResource,
    resource: props.access.resource,
    startDate: props.access.startDate,
    endDate: props.access.endDate,
    accessType: props.access.accessType,
    accessTypeGroup: props.access.accessTypeGroup,
    fee: props.access.slotTariffs[0].amount,
  }

  if (cashPayment.value) {
    //console.log("Entro aqui con el email: ", cashEmail.value);
    sessionStorageUtils.set('access',
    {
      access: accessInfo,
      cashPayment: true
      });

    //console.log("Se ha escrito en el sessionStorage:" , sessionStorageUtils.get('access'));
    
  } else {
    sessionStorageUtils.set('access',
    {
      access: accessInfo,
      cashPayment: false
    });
  }


  emit('close');
  router.push('/confirmation/acc');

  // Si el usuario está registrado -> Vamos a la ventana de confirmación
  // Si el usuario no está registrado -> Vamos a la ventana de login
  // if (authStore.isAuthenticated)  {
  //   emit('close');
  //   router.push('/confirmation/acc');
  // } else {
  //   emit('close');
  //   router.push('/login');
  // }
};

// Función que abre el link de google maps según el recurso
const getMapsLink = () => {
  const link = props.access.locationUrl;

  if (link) {
    window.open(link, '_blank');
  };
};




</script>


<style lang="scss" scoped>

</style>
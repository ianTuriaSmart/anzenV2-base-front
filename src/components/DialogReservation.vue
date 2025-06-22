<template>
  <q-card
    class="q-ml-xs text-primary"
    flat
    style="width: 400px; background-color: #f7f8fa; border-radius: 30px"
  >
    <q-card-section>
      <!-- Row que contiene el título -->
      <div class="row justify-center">
        <div
          class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary"
        >
          {{ $t("tituloVentanaReserva") }}
        </div>
      </div>

      <!-- Row que contiene la primera fila de avatares -->
      <div class="row">
        <div class="col">
          <q-item>
            <q-item-section side>
              <q-avatar
                square
                color="white"
                :icon="getResourceIcon($t(reservation.resource))"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("instalacion") }}</q-item-label>
              <q-item-label>{{ $t(reservation.resource) }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col">
          <q-item clickable style="border-radius: 10px" @click="getMapsLink()">
            <q-item-section side>
              <q-avatar
                square
                color="white"
                icon="location_on"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("ubicacion") }}</q-item-label>
              <q-item-label>{{ $t("maps") }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!-- Row que contiene la segunda fila de avatares -->
      <div class="row">
        <div class="col">
          <q-item>
            <q-item-section side>
              <q-avatar
                square
                color="white"
                icon="calendar_today"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("fecha") }}</q-item-label>
              <q-item-label>{{ reservation.dateString }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col">
          <q-item>
            <q-item-section side>
              <q-avatar
                square
                color="white"
                icon="schedule"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("hora") }}</q-item-label>
              <q-item-label>{{
                reservation.translateHour
                  ? $t(reservation.hour)
                  : reservation.hour
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!-- Row que contiene la tercera fila de avatares -->
      <div class="row">
        <div class="col">
          <q-item>
            <q-item-section side>
              <q-avatar
                square
                color="white"
                icon="euro"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("precio") }}</q-item-label>
              <q-item-label>
                {{ feeDisplay === "0" ? $t("gratuito") : `${feeDisplay} €` }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="col">
          <q-item>
            <q-item-section side>
              <q-avatar
                square
                color="white"
                icon="timelapse"
                size="48px"
                style="border-radius: 10px"
              >
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ $t("duracion") }}</q-item-label>
              <q-item-label v-if="reservation.slotDuration"
                >{{ reservation.slotDuration }} min</q-item-label
              >
              <q-item-label v-else> - </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!-- Row que contiene un seleccionable para añadir luz a la reserva-->
      <div v-if="lightingSup" class="row flex flex-center q-mt-md text-body1">
          <q-select
            v-model="lightSelection"
            :options="lightOptions"
            :label="`${$t('checkLuz')} (+${reservation.lightFee} €)`"
            label-color="primary"
            style="min-width: 200px"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="lightSelectorChanged"
          />
        
      </div>

      <!-- Selector de tipo de usuario -->
      <div v-if="props.reservation.isUserTypes" class="row flex flex-center q-mt-md text-body1">
        <q-select
          v-model="selectedUserType"
          :options="translatedUserTypes"
          :label="$t('tipoUsuario')"
          label-color="primary"
          style="min-width: 200px"
          outlined
          dense
          emit-value
          map-options
          @update:model-value="onUserTypeChanged"
        />
      </div>

      <!-- Row que contiene un seleccionable para añadir luz a la reserva-->
      <div
        v-if="authStore.role === 100"
        class="column flex flex-center q-mt-md"
      >
        <q-checkbox
          v-model="cashPayment"
          :label="$t('pagoEfectivo')"
          color="primary"
        />
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
            style="min-width: 160px; min-height: 45px; border-radius: 10px"
          />
        </div>

        <div class="col flex flex-center">
          <q-btn
            color="primary"
            :label="$t('btnReservar')"
            no-caps
            size="md"
            @click="confirmReservation()"
            style="min-width: 160px; min-height: 45px; border-radius: 10px"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; // Importamos el router
import { useAuthStore } from "src/stores/authStore.js";
import sessionStorageUtils from "src/utils/sessionStorageUtils";
import { notify } from "src/utils/notify";
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { useI18n } from "vue-i18n";
import { getResourceIcon } from "src/utils/resourceIcon.js";
import { validateEmail } from "src/utils/formValidations";

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const { t } = useI18n(); // Hook para acceder a las traducciones

const authStore = useAuthStore();

const router = useRouter(); // Instancia del router de Vue

const lightSelection = ref(false);
const feeDisplay = ref();

const lightingSup = ref(false); // Variable que utilizamos para saber si hay suplemento por luz

const lightOptions = [
  {
    label: "Si",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
];

// Define los eventos que emitirá el componente
const emit = defineEmits(["close"]);

// Definimos props que recibirá el componente
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const selectedUserType = ref(props.reservation.userTypes[0]?.id); // valor por defecto

const translatedUserTypes = computed(() =>
  props.reservation.userTypes.map((type) => ({
    label: t(type.userType),
    value: type.id,
  }))
);

const updateFee = () => {
  const tariff = props.reservation.tariffs.find(
    (t) => t.idUserType === selectedUserType.value
  );
  const baseFee = tariff ? parseFloat(tariff.amount) : 0;
  const light = lightSelection.value
    ? parseFloat(props.reservation.lightFee || 0)
    : 0;

  const total = baseFee + light;

  // Mostrar sin decimales si es entero, si no con dos
  feeDisplay.value = Number.isInteger(total)
    ? total.toString()
    : total.toFixed(2);
};
const onUserTypeChanged = () => updateFee();
const lightSelectorChanged = () => updateFee();


// Variables que utilizamos para el pago en efectivo si el usuario es admin
// Estado local para checkbox e input
const cashPayment = ref(false);

onMounted(() => {
  // Comprobamos que condiciones tiene la reserva
  lightingSup.value = props.reservation.lightSup;
  //console.log(props.reservation.date);

  //console.log(props.reservation);

  updateFee(); // ✅ Calcula precio base con luz/no luz y tipo de usuario inicial
});

const confirmReservation = () => {
  //console.log(lightSelection.value, lightingSup.value);
 
  // Actualizamos la reserva en la sessionStorage
  const reservationInfo = {
    idResource: props.reservation.idResource,
    resource: props.reservation.resource,
    date: props.reservation.date,
    lightSup: lightSelection.value,
    idUserType: selectedUserType.value,
    reservationFee: feeDisplay.value,
    typeSlot: props.reservation.typeSlot,
    slotDuration: props.reservation.slotDuration,
  };

  if (cashPayment.value) {
    //console.log("Entro aqui con el email: ", cashEmail.value);
    sessionStorageUtils.set("reservation", {
      reservation: reservationInfo,
      cashPayment: true,
    });

    //console.log("Se ha escrito en el sessionStorage:" , sessionStorageUtils.get('access'));
  } else {
    sessionStorageUtils.set("reservation", {
      reservation: reservationInfo,
      cashPayment: false,
    });
  }

  emit("close");
  router.push("/confirmation");
};

// Función que abre el link de google maps según el recurso
const getMapsLink = () => {
  const link = props.reservation.locationUrl;

  if (link) {
    window.open(link, "_blank");
  }
};

// Para las validaciones creamos funciones intermedias que pasen la instacia de t
const checkEmail = (email) => {
  return validateEmail(email, t);
};
</script>

<style lang="scss" scoped></style>

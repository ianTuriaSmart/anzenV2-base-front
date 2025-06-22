<template>
  <!-- Row que contiene el título -->
  <div class="row justify-center q-mx-lg">
    <div
      class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary"
    >
      {{ $t("tituloConfirmacion") }}
    </div>
    <div
      v-if="!confirmed"
      class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary"
    >
      {{ $t("subtituloConfirmacion") }}
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
    <!-- Div que contiene la tarjeta con el mensaje de reserva previa -->
    <!-- <div v-if="pending && !confirmed" class="row justify-center q-mt-md">
      <q-card
        flat
        class="q-mx-md"
        style="border-radius: 30px; background: #ffebb1; color: #b28a17;"
        >
        <q-card-section style="padding: 0px 0px;">
          <div class="row no-wrap justify-center items-center q-pl-md q-pr-md">
              <q-avatar>
                <q-icon name="warning" size="sm" />
              </q-avatar>
              
              <div class="text-h7 text-weight-medium text-center q-my-sm">
                {{ $t('msgReservaPrevia') }}
              </div>
          </div>
        </q-card-section>
      </q-card>
    </div> -->

    <!-- Div que contiene el aviso de tiempo restante -->
    <div v-if="!confirmed" class="row justify-center q-mt-md">
      <q-card
        flat
        style="border-radius: 30px; background: #ffebb1; color: #b28a17"
      >
        <q-card-section style="padding: 0px 0px">
          <!-- Avatar + tiempo restante -->
          <div
            class="row text-h7 text-weight-medium flex-center q-ml-sm q-mr-md"
            style="display: flex"
          >
            <!-- Avatar -->
            <q-avatar>
              <q-icon name="access_time" size="sm" />
            </q-avatar>

            <!-- Texto -->
            <div>{{ $t("tiempoRestante") }}: {{ countdown }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Div que contiene la tarjeta de reserva confirmada correctamente y explicación -->

    <div v-if="confirmed" class="row justify-center q-mt-md">
      <q-card
        flat
        class="q-mx-md"
        style="border-radius: 30px; background: #daffe0; color: #1b4618"
      >
        <q-card-section style="padding: 0px 0px">
          <div class="row no-wrap justify-center items-center q-pl-md q-pr-md">
            <q-avatar>
              <q-icon name="done" size="sm" />
            </q-avatar>

            <div class="text-h7 text-weight-bold text-center q-my-sm q-mr-md">
              {{ $t("reservaConfirmada") }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Div que contiene información sobre la reserva -->
    <div
      v-if="confirmed"
      class="row justify-center q-mt-md q-mx-lg text-primary"
    >
      <q-card flat style="background: #f7f8fa">
        <q-card-section style="padding: 0px 0px">
          <!-- Avatar + info -->
          <div
            class="row text-h7 flex-center q-ml-sm q-mr-lg"
            style="display: flex"
          >
            <!-- Info -->
            <div class="text-center" style="max-width: 700px">
              {{ $t("msgInfoReservaConfirmada") }}
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
        style="
          width: 400px;
          border: 2px solid var(--q-primary);
          border-radius: 30px;
          background: #f7f8fa;
        "
      >
        <q-card-section>
          <!-- Row que contiene el título -->
          <div class="row justify-center">
            <div
              class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary"
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
                    :icon="getResourceIcon(reservation.resource)"
                    size="48px"
                    style="border-radius: 10px"
                  >
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t("instalacion") }}</q-item-label>
                  <q-item-label>
                    {{
                      $te(reservation.resource)
                        ? $t(reservation.resource)
                        : reservation.resource
                    }}
                    <template v-if="reservation.lightSup"
                      >+ {{ $t("luz") }}</template
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col">
              <q-item
                clickable
                style="border-radius: 10px"
                @click="getMapsLink()"
              >
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
                  <q-item-label>{{ displayedHour }}</q-item-label>
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
                  {{
                    reservation.reservationFee === "0"
                      ? $t("gratuito")
                      : `${reservation.reservationFee} €`
                  }}
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
        </q-card-section>
      </q-card>

      <!-- Div que contiene la tarjeta con el código QR -->
      <!-- <q-card
        v-if = "confirmed"
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="width: 400px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        > -->

      <!-- <q-card-section> -->
      <!-- Row que contiene el título -->
      <!-- <div class="row justify-center q-mx-md">
            <div class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary">
              {{ $t('tituloVentanaQR') }}
            </div>
            <div class="col-12 col-md-8 text-center text-caption  text-primary">
              {{ $t('subtituloVentanaQR') }}
            </div>
          </div> -->

      <!-- Row que contiene el QR Code -->
      <!-- <div class="row justify-center q-my-sm">
            <img :src="reservation.qr" class="q-mx-auto" style="max-width: 125px; border-radius: 10px;">
          </div> -->
      <!-- </q-card-section> 
      </q-card> -->

      <!-- 2. Tarjeta datos de usuario -->
      <q-card
        class="text-primary q-mx-md q-mt-md"
        flat
        bordered
        style="
          width: 400px;
          border: 2px solid var(--q-primary);
          border-radius: 30px;
          background: #f7f8fa;
        "
      >
        <q-card-section class="q-mb-md">
          <!-- Título -->
          <div class="row justify-center">
            <div
              class="col-12 col-md-8 text-center text-h6 q-my-md text-weight-bold text-primary"
            >
              {{ $t("tituloTarjetaUsuario") }}
            </div>
          </div>

          <!-- Inputs apilados -->
          <div class="column q-gutter-md">
            <q-input
              v-model="user.name"
              :label="$t('nombreCompleto')"
              outlined
              bg-color="secondary"
              label-color="primary"
              :input-style="{ color: '#00406e' }"
              :disabled="confirmed"
              dense
            />
            <q-input
              v-model="user.email"
              :label="$t('email')"
              outlined
              bg-color="secondary"
              label-color="primary"
              :input-style="{ color: '#00406e' }"
              :disabled="confirmed"
              dense
            />
            <q-input
              v-model="user.idDocument"
              :label="$t('dni')"
              outlined
              bg-color="secondary"
              label-color="primary"
              :input-style="{ color: '#00406e' }"
              :disabled="confirmed"
              dense
            />
            <q-input
              v-model="user.phone"
              :label="$t('telefono')"
              outlined
              bg-color="secondary"
              label-color="primary"
              :input-style="{ color: '#00406e' }"
              :disabled="confirmed"
              dense
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Checkbox terminos y condiciones -->
    <div v-if="!confirmed" class="q-mt-md flex flex-center">
      <q-checkbox v-model="acceptTerms" class="text-primary">
        <template v-slot:default>
          <span>
            {{ $t("acepto") }}
            <a
              href="/legal/terms"
              target="_blank"
              class="text-primary text-bold"
              @click.stop
            >
              {{ $t("terminos") }}
            </a>
          </span>
        </template>
      </q-checkbox>
    </div>

    <!-- Div que contiene los botones de reservar y cancelar -->
    <div
      v-if="!confirmed && !isLoading"
      class="row q-mb-lg q-mt-lg justify-center q-gutter-x-md"
    >
      <div>
        <q-btn
          color="primary"
          :label="$t('btnCancelar')"
          no-caps
          size="md"
          type="button"
          @click="cancelReservation"
          style="min-width: 160px; min-height: 45px; border-radius: 10px"
        />
      </div>

      <div>
        <q-btn
          color="primary"
          :label="$t('btnReservar')"
          @click="confirmReservation"
          no-caps
          size="md"
          style="min-width: 160px; min-height: 45px; border-radius: 10px"
        />
      </div>
    </div>

    <!-- Div que contiene el boton salir cuando se ha confirmado la reserva -->
    <div
      v-if="confirmed"
      class="row q-mb-lg q-mt-lg justify-center q-gutter-x-md"
    >
      <div>
        <q-btn
          color="primary"
          :label="$t('btnSalir')"
          no-caps
          size="md"
          type="button"
          @click="router.push('/')"
          style="min-width: 160px; min-height: 45px; border-radius: 10px"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { notify } from "src/utils/notify";
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useNavigationStore } from "src/stores/navigationStore.js";
import { useAuthStore } from "src/stores/authStore";
import {
  apiConfirmReservationManual,
  apiValidateReservation,
} from "src/services/apiReservations";
import { DateTime } from "luxon";
import sessionStorageUtils from "src/utils/sessionStorageUtils";
import { getResourceIcon } from "src/utils/resourceIcon.js";
import { apiStripeCheckoutRes } from "src/services/TPV/apiStripe";
import { stripeRedirect } from "src/utils/TPV/stripeUtils";
import {
  validateEmail,
  validatePhone,
  validateId,
} from "src/utils/formValidations";

const navStore = useNavigationStore(); // Instancia de la store
const authStore = useAuthStore();

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const reservation = ref({
  // idReservation: null,
  // date: null,
  // expirationDate: null,
  // resource: null,
  // date: null,
  // dateString: null,
  // hour: null,
  // slotDuration: null,
  // reservationFee: null,
  // expirationDate: null,
});

const acceptTerms = ref(false);

const user = ref({
  name: "Ian Bastian Martinez Garcia",
  idDocument: "072622525W",
  phone: "615566227",
  email: "ianmg.compras@gmail.com",
});

const pending = ref(false);

const countdown = ref("");
const timer = ref(null);

const confirmed = ref(false);

const isLoading = ref(false); // Variable para cargar spinner de carga

const cashPayment = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;

    // Lo primero es comprobar que el objeto access existe en la sessionStore
    if (!sessionStorageUtils.get("reservation")) {
      router.push("/");
      return;
    }

    // Siempre será una nueva reserva
    const newReservationInfo =
      sessionStorageUtils.get("reservation").reservation;
    //console.log("newAccessInfo", newAccessInfo);
    cashPayment.value = sessionStorageUtils.get("reservation").cashPayment;

    reservation.value = newReservationInfo;
    //console.log("Reserva:", reservation.value);
    const { dateString, hour } = formatDate(reservation.value);
    //console.log(dateString, hour);
    reservation.value.dateString = dateString;
    reservation.value.hour = hour;

    // Iniciamos la cuenta atrás
    startCountdown();
  } catch (error) {
    //console.log(error);
    notify($q, t, error.message, "nok");
    // Borramos del sessionStorage
    sessionStorageUtils.remove("reservation");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
});

// Función que valida que los inputs del usuario son correctos
const checkUser = () => {
  if (
    !user.value.name ||
    !user.value.idDocument ||
    !user.value.phone ||
    !user.value.email
  ) {
    return { error: true, message: "errorCamposVacios" };
  } else {
    if (validateEmail(user.value.email, t) !== true) {
      return { error: true, message: "errorEmailValido" };
    } else if (validatePhone(user.value.phone, t) !== true) {
      return { error: true, message: "errorTelefonoValido" };
    } else if (validateId(user.value.idDocument, t) !== true) {
      return { error: true, message: "errorDNIValido" };
    }
  }
  return { error: false, message: "" };
};

const cancelReservation = async () => {
  try {
    isLoading.value = true;
    clearInterval(timer.value);

    // Borramos del sessionStorage
    sessionStorageUtils.remove("reservation");
    sessionStorageUtils.remove("reservationExpiration");

    router.push("/calendar");
  } catch (error) {
    notify($q, t, error.message, "nok");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const confirmReservation = async () => {
  try {
    if (!acceptTerms.value) {
      notify($q, t, "errorTerminos", "nok");
      return;
    }

    // Comprobamos que los datos del usuario sean correctos
    const { error, message } = checkUser();
    if (error) {
      notify($q, t, message, "nok");
      return;
    }

    // Guardamos los datos del usuario en el sessionStorage
    sessionStorageUtils.set("user", user.value);

    // Spinner de carga
    isLoading.value = true;
    clearInterval(timer.value);

    // OJO DE MOMENTO NO HAY STRIPE, RESERVAS GRATUITAS
    if (cashPayment.value) {
      //console.log("CONFIRM MANUAL");
      /* VERSION SIN PASARELA DE PAGO
      Se llama el metodo apiConfirmAccesManual solo es válido para cuentas admin */
      await apiConfirmReservationManual(
        locale.value,
        reservation.value.idResource,
        reservation.value.date,
        reservation.value.reservationFee,
        reservation.value.lightSup,
        reservation.value.idUserType,
        user.value
      );

      isLoading.value = false;
      confirmed.value = true;

      // Borramos de la sessionStorage
      sessionStorageUtils.remove("reservation");
      sessionStorageUtils.remove("reservationExpiration");
      sessionStorageUtils.remove("user");

      //notify($q, t, 'reservaConfirmada', 'ok');
      //router.push('/');
    } else {
      //console.log("CONFIRM NORMAL");
      /* VERSION STRIPE FUNCIONAL */
      // Antes de pasar a stripe, comprobamos que el acceso es valido
      await apiValidateReservation(
        reservation.value.idResource,
        reservation.value.date,
        reservation.value.reservationFee,
        reservation.value.lightSup,
        reservation.value.idUserType,
        user.value
      );

      // Si la validación es correcta pasamos a stripe
      const stripeObject = {
        resource: reservation.value.resource,
        date: reservation.value.dateString,
        hour: displayedHour.value,
        amount: reservation.value.reservationFee,
        userEmail: user.value.email,
      };

      const sessionId = await apiStripeCheckoutRes(stripeObject); // Llamamos al backend para crear la sesión de checkout
      //console.log("sessionId", sessionId);

      sessionStorageUtils.remove("reservationExpiration");
      //sessionStorageUtils.remove('access');

      await stripeRedirect(sessionId); // Redirigimos a Stripe con el sessionId
    }
  } catch (error) {
    notify($q, t, error, "nok");
    router.push("/");
  } finally {
    navStore.clearPreviousRoute();
    isLoading.value = false;
  }
};

const startCountdown = () => {
  let expiration;
  const storedExpiration = sessionStorageUtils.get("reservationExpiration");

  if (storedExpiration) {
    expiration = DateTime.fromISO(storedExpiration, { zone: "Europe/Madrid" });
  } else {
    expiration = DateTime.now().setZone("Europe/Madrid").plus({ minutes: 15 });

    sessionStorageUtils.set("reservationExpiration", expiration.toISO());
  }

  const expirationTime = expiration.toMillis();

  const updateCountdown = () => {
    const now = DateTime.now().setZone("Europe/Madrid").toMillis();
    const remainingTime = expirationTime - now;

    if (remainingTime <= 0) {
      countdown.value = "0min 00s";
      notify($q, t, "reservaCaducada", "nok");
      sessionStorageUtils.remove("access");
      sessionStorageUtils.remove("reservationExpiration"); // 🔥 Limpieza
      cancelAccess();
    } else {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      countdown.value = `${minutes}min ${seconds < 10 ? "0" : ""}${seconds}s`;
    }
  };

  if (timer.value) {
    clearInterval(timer.value);
  }
  timer.value = setInterval(updateCountdown, 1000);
  updateCountdown();
};
// Función que obtendra el dateString según el idioma
const formatDate = (res) => {
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";

  const date = DateTime.fromFormat(res.date, "yyyy-MM-dd'T'HH:mm:ss", {
    zone: "Europe/Madrid",
    locale: luxonLocale,
  });

  const dayName = date.toFormat("cccc");
  const day = date.toFormat("dd");
  const monthName = date.toFormat("LLLL");
  let hour = date.toFormat("HH:mm");

  const dateString =
    luxonLocale === "es"
      ? `${
          dayName.charAt(0).toUpperCase() + dayName.slice(1)
        } ${day} de ${monthName}`
      : `${
          dayName.charAt(0).toUpperCase() + dayName.slice(1)
        } ${day} ${monthName}`;

  if (res.typeSlot === "partial") {
    hour = hour === "08:00" ? "mañana" : "tarde";
  } else if (res.typeSlot === "daily") {
    hour = "diario";
  }

  return { dateString, hour };
};

// Función que abre el link de google maps según el recurso
const getMapsLink = () => {
  const group = sessionStorageUtils.get("selectedGroup");
  const resourceName = reservation.value.resource;

  const resource = group.resources.find((r) => r.resource === resourceName);
  const link = resource?.locationUrl;

  if (link) {
    window.open(link, "_blank");
  }
};
// Watcher que detectara los cambios de idioma
// Actualizar las fechas dinámicamente al cambiar el idioma
watch(locale, () => {
  const { dateString, hour } = formatDate(reservation.value);

  reservation.value.dateString = dateString;
  reservation.value.hour = hour;
});

onBeforeUnmount(() => {
  // Limpiar el temporizador cuando el componente sea destruido
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  sessionStorageUtils.remove("reservationExpiration");
});

const displayedHour = computed(() => {
  if (!reservation.value?.hour) return "";

  if (
    reservation.value.typeSlot === "partial" ||
    reservation.value.typeSlot === "daily"
  ) {
    return t(reservation.value.hour);
  }

  return reservation.value.hour;
});
</script>

<style lang="scss" scoped></style>

<template>
  <!-- Row que contiene el título -->
  <div v-if="view === 'login'" class="row justify-center q-mt-lg q-mx-md">
    <div
      class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary"
    >
      {{ $t("tituloLogin") }}
    </div>
    <div
      class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary"
    >
      {{ $t("subtituloLogin") }}
    </div>
  </div>

  <div v-else class="row justify-center q-mt-lg q-mx-md">
    <div
      class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary"
    >
      {{ $t("tituloRecuperacion") }}
    </div>
    <div
      class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary"
    >
      {{ $t("subtituloRecuperacion") }}
    </div>
  </div>

  <!-- Row que contiene la q-card -->
  <div class="row justify-center q-mt-lg">
    <q-card
      class="q-pa-lg q-mb-lg"
      flat
      bordered
      style="
        width: 85%;
        height: 575px;
        border: 2px solid var(--q-primary);
        border-radius: 30px;
        background: #f7f8fa;
      "
    >
      <!-- Avatar centrado -->
      <div v-if="view === 'login'" class="row justify-center">
        <q-avatar
          size="80px"
          color="primary"
          text-color="white"
          icon="person"
        />
      </div>

      <!-- Avatar para la vista de recuperación de contraseña -->
      <div v-else class="row justify-center">
        <q-avatar
          size="80px"
          color="primary"
          text-color="white"
          icon="vpn_key"
        />
      </div>

      <!--Formulario Login -->
      <q-form
        class="q-mt-lg"
        @submit="login(email, password)"
        ref="form"
        prevent-default
      >
        <!-- Email (visible si view !== 'password') -->
        <div
          v-if="view !== 'password'"
          class="q-mt-sm flex items-center justify-center"
        >
          <q-input
            outlined
            bg-color="secondary"
            label-color="primary"
            :input-style="{ color: '#00406e' }"
            v-model="email"
            :label="$t('email')"
            dense
            name="email"
            :rules="[checkEmail]"
            autocomplete="username"
            style="width: 95%"
          ></q-input>
        </div>

        <!-- Fila botón generar código (visible solo en vista recuperación) -->
        <div
          v-if="view === 'recovery'"
          class="q-mt-md flex items-center justify-center"
        >
          <q-btn
            color="primary"
            :label="countdown > 0 ? `${countdown}s` : $t('btnGenerarCodigo')"
            no-caps
            style="
              min-width: 160px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
            @click="startCountdown"
            :disable="checkEmail(email) !== true || countdown > 0"
          />
        </div>

        <!-- Fila input código (visible solo en vista password)-->
        <div
          v-if="view === 'password'"
          class="q-mt-md flex items-center justify-center"
        >
          <q-input
            outlined
            bg-color="secondary"
            label-color="primary"
            :input-style="{ color: '#00406e' }"
            v-model="recoveryCode"
            :rules="[checkRecoveryCode]"
            :label="$t('codigoRecuperacion')"
            dense
            style="flex: 1"
          ></q-input>
        </div>

        <!-- Segunda fila que contiene el password del usuario -->
        <div
          v-if="view !== 'recovery'"
          class="q-mt-md flex items-center justify-center"
        >
          <q-input
            outlined
            bg-color="secondary"
            label-color="primary"
            :input-style="{ color: '#00406e' }"
            v-model="password"
            :label="
              view === 'recovery' ? $t('nuevaContraseña') : $t('contraseña')
            "
            dense
            :rules="[checkPassword]"
            :type="passwordVisibility ? 'password' : 'text'"
            autocomplete="current-password"
            style="width: 95%"
          >
            <template v-slot:append>
              <q-icon
                :name="passwordVisibility ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="passwordVisibility = !passwordVisibility"
                color="primary"
              />
            </template>
          </q-input>
        </div>

        <!-- Tercera fila que contiene la confirmación del password (visible solo en vista recuperación) -->
        <div
          v-if="view === 'password'"
          class="q-mt-md flex items-center justify-center"
        >
          <q-input
            outlined
            bg-color="secondary"
            label-color="primary"
            :input-style="{ color: '#00406e' }"
            v-model="confirmPassword"
            :label="$t('confirmarContraseña')"
            dense
            :rules="[checkConfirmPassword]"
            :type="confirmPasswordVisibility ? 'password' : 'text'"
            autocomplete="current-password"
            style="width: 95%"
          >
            <template v-slot:append>
              <q-icon
                :name="
                  confirmPasswordVisibility ? 'visibility_off' : 'visibility'
                "
                class="cursor-pointer"
                @click="confirmPasswordVisibility = !confirmPasswordVisibility"
                color="primary"
              />
            </template>
          </q-input>
        </div>

        <!-- Boton He olvidado mi contraseña (visible solo en vista login) -->
        <div v-if="view === 'login'" class="row justify-center text-primary">
          <q-btn
            no-caps
            flat
            style="
              min-width: 160px;
              min-height: 45px;
              border-radius: 10px;
              width: 260px;
              text-decoration: underline;
            "
            @click="nextView('recovery')"
          >
            {{ $t("contraseñaOlvidada") }}
          </q-btn>
        </div>

        <!-- Fila reCAPTCHA (visible solo en vista password) -->
        <div
          v-if="view === 'password'"
          class="q-ml-lg bg-yellow flex justify-center align-center"
          style="width: 95%"
        >
          <!-- Contenedor para el reCAPTCHA -->
          <div id="recaptcha-container"></div>
        </div>

        <!-- Div que contiene los botones de la vista login -->
        <div v-if="view === 'login'" class="q-mt-xl q-pt-xl">
          <!-- Fila botón iniciar sesión (visible solo en vista login) -->
          <div class="row justify-center">
            <q-btn
              color="primary"
              :label="$t('btnLogin')"
              no-caps
              size="md"
              type="submit"
              style="
                min-width: 160px;
                min-height: 45px;
                border-radius: 10px;
                width: 260px;
              "
            />
          </div>

          <!-- Fila texto nueva cuenta (visible solo en vista login) -->
          <div class="row justify-center q-mt-lg text-primary">
            {{ $t("textoNuevaCuenta") }}
          </div>

          <!-- Fila botón registrar (visible solo en vista login) -->
          <div class="row justify-center q-mt-sm">
            <q-btn
              color="primary"
              :label="$t('btnRegistro')"
              no-caps
              size="md"
              to="/register"
              style="
                min-width: 160px;
                min-height: 45px;
                border-radius: 10px;
                width: 260px;
              "
            />
          </div>
        </div>

        <!-- Div que contiene el botón volver de la vista recovery -->
        <div
          v-if="view === 'recovery'"
          class="row justify-center no-wrap"
          style="margin-top: 250px"
        >
          <!-- Div vacio para generar espacio de 15 px verticalmente -->
          <q-btn
            color="primary"
            :label="$t('btnVolver')"
            no-caps
            size="md"
            @click="changeWindowView"
            style="
              min-width: 120px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
          />

          <!-- <q-btn
                color="primary"
                :label="$t('btnActualizarPassword')"
                no-caps
                size="md"
                @click="updatePassword()"
                class="q-ml-sm"
                :disable="!codeButtonClicked"
                style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" /> -->
        </div>
      </q-form>
    </q-card>
  </div>

  <!-- Dialogo notificación generación código de recuperación -->
  <q-dialog v-model="showDialogRecoveryCode" persistent>
    <DialogRecoveryCode @close="closeDialogRecoveryCode" />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { apiLogin } from "src/services/apiAuth";
import {
  apiGenerateRecoveryCode,
  apiUpdateUserPassword,
} from "src/services/apiProfile";
import { notify } from "src/utils/notify";
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useAuthStore } from "src/stores/authStore";
import { useNavigationStore } from "src/stores/navigationStore.js";
import { validateEmail, validatePassword } from "src/utils/formValidations";
import { useI18n } from "vue-i18n";
import DialogRecoveryCode from "src/components/DailogRecoveryCode.vue";

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const authStore = useAuthStore();
const navStore = useNavigationStore(); // Instancia de la store

const { t, locale } = useI18n(); // Hook para acceder a las traducciones

// Inputs
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const recoveryCode = ref("");

// Variables que controlan la visibilidad de los campos de contraseña
const passwordVisibility = ref(true);
const confirmPasswordVisibility = ref(true);

// Variable que controla la vista de la ventana (login o recuperación)
const view = ref("login");

// Variable que controla la visibilidad del dialogo informativo indicando que se ha generado el código
const showDialogRecoveryCode = ref(false);

// Variables que controlan el timer para el botón de generar código
const countdown = ref(0); // Cuenta regresiva
let countdownTimer = null; // Timer

const captchaToken = ref(null);

const startCountdown = () => {
  // Validamos email
  if (validateEmail(email.value, t) !== true || email.value.length === 0) {
    notify($q, t, "errorEmailVacio", "nok");
    return;
  }

  if (countdown > 0) return; // Si la cuenta regresiva ya ha empezado, no hacer nada

  countdown.value = 120; // Inicializar la cuenta regresiva en 60 segundos

  generateRecoveryCode(); // Generar el código de recuperación

  // Iniciar el timer para la cuenta regresiva
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

// Renderizamos captcha al montar la página
onMounted(() => {
  renderCaptcha();
});

// Limpieza del temporizador cuando el componente se desmonta
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

// Creamos watcher que renderiza el captcha si estamos en la vista recovery
watch(
  () => view.value,
  () => {
    if (view.value === "recovery") {
      renderCaptcha();
    }
  }
);

// Función que renderiza el captcha
const renderCaptcha = () => {
  nextTick(() => {
    if (window.grecaptcha && window.grecaptcha.render) {
      //console.log("Renderizando reCAPTCHA...");
      window.grecaptcha.render("recaptcha-container", {
        sitekey: "process.env.RECAPTCHA_SITE_KEY",
        callback: onCaptchaSuccess,
        "expired-callback": onCaptchaExpired,
      });
    } else {
      console.error(
        "reCAPTCHA no está disponible. Asegúrate de que el script se haya cargado."
      );
    }
  });
};

// Callback cuando el captcha se completa correctamente
const onCaptchaSuccess = (token) => {
  captchaToken.value = token;
  console.log("Token", token);
  updatePassword();
};

// Callback cuando el captcha se expira
const onCaptchaExpired = () => {
  captchaToken.value = null;
};

const login = async (email, password) => {
  try {
    // Comprobamos que los campos estén rellenos
    // Comprobamos qué campos están vacíos
    if ((!email || email === "") && (!password || password === "")) {
      notify($q, t, "errorCamposVacios", "nok");
      return;
    }

    if (!email || email === "") {
      notify($q, t, "errorEmailVacio", "nok");
      return;
    }

    if (!password || password === "") {
      notify($q, t, "errorPasswordVacio", "nok");
      return;
    }

    const response = await apiLogin(email, password);
    // Guardamos token en el store de pinia y en el localStorage
    authStore.setToken(response.token);
    localStorage.setItem("token", response.token);

    // Comprobamos con el store si es un login forzado
    // Será forzado si viene por una reserva
    if (navStore.forcedLogin) {
      // Limpiamps la variable en el store
      navStore.setForcedLogin(false);
      router.push("/confirmation");
    } else {
      // Es un login normal, volvemos a la ventana previa al login
      const route = navStore.previousRoute ? navStore.previousRoute : "/";
      navStore.clearPreviousRoute();
      router.push(route);
    }
  } catch (error) {
    notify($q, t, error, "nok");
  }
};

// Función que cambia la vista de la ventana
const changeView = (newView) => {
  view.value = newView;

  // Limpiamos los campos
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  recoveryCode.value = "";

  // Limpiamos el timer
  countdown.value = 0;
  clearInterval(countdownTimer);
};

// Funciones para navegar entre las distintas vistas
const nextView = () => {
  if (view.value === "login") {
    view.value = "recovery";
  } else {
    view.value = "password";
  }
};

const prevView = () => {
  view.value = "login";
};

// Función que registra la pulsación del botón de generar código , abre el dialogo y llama al backend
const generateRecoveryCode = async () => {
  try {
    // Llamamos método API para generar código de recuperación
    await apiGenerateRecoveryCode(email.value, locale.value);

    // Abrimos el dialogo
    showDialogRecoveryCode.value = true;

    // Validar email, password y confirmar password
  } catch (error) {
    countdown.value = 0;
    clearInterval(countdownTimer);
    notify($q, t, error, "nok");
  }
};

// Función que cierra el dialogo de recuperación de contraseña
const closeDialogRecoveryCode = () => {
  showDialogRecoveryCode.value = false;
};

// Función que actualiza la contraseña del usuario
const updatePassword = async () => {
  try {
    // Validaciones de los campos
    if (validateEmail(email.value, t) !== true || email.value.length === 0) {
      notify($q, t, "errorEmailVacio", "nok");
      return;
    }

    if (recoveryCode.value.length !== 6) {
      notify($q, t, "errorRecoveryCode", "nok");
      return;
    }

    if (
      validatePassword(password.value, t) !== true ||
      password.value.length === 0
    ) {
      notify($q, t, "errorPasswordValido", "nok");
      return;
    }

    if (password.value !== confirmPassword.value) {
      notify($q, t, "errorConfPassword", "nok");
      return;
    }

    await apiUpdateUserPassword(
      email.value,
      password.value,
      recoveryCode.value
    );
    notify($q, t, "passwordUpdated", "ok");

    // Volvemos a la vista inicial de la página
    view.value = "login";
  } catch (error) {
    notify($q, t, error, "nok");
  }
};

// Para las validaciones creamos funciones intermedias que pasen la instacia de t
const checkEmail = (email) => {
  return validateEmail(email, t);
};

const checkPassword = (password) => {
  return validatePassword(password, t);
};

const checkConfirmPassword = () => {
  if (password.value !== confirmPassword.value) {
    return t("valConfPassword");
  }

  return true;
};

const checkRecoveryCode = () => {
  if (recoveryCode.value.length !== 6) {
    return t("valRecoveryCode");
  }

  return true;
};
</script>

<style lang="scss" scoped></style>

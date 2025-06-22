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

  <!-- Row que contiene la q-card -->
  <div v-if="!isLoading" class="row justify-center q-mt-lg">
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

        <!-- Contenedor del reCAPTCHA -->
        <div
          v-if="view === 'recovery'"
          class="q-mt-md flex justify-center"
          style="margin-bottom: 85px"
        >
          <div
            id="recaptcha-container"
            class="full-width"
            style="max-width: 95%"
          ></div>
        </div>

        <!-- Botón generar código (visible solo en vista recuperación) -->
        <div
          v-if="view === 'recovery'"
          class="q-mt-md flex items-center justify-center"
        >
          <q-btn
            color="primary"
            :label="$t('btnGenerarCodigo')"
            no-caps
            style="
              min-width: 160px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
            @click="generateRecoveryCode()"
            :disable="checkEmail(email) !== true"
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
            style="width: 95%"
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
              view === 'password' ? $t('nuevaContraseña') : $t('contraseña')
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
            @click="changeView('recovery')"
          >
            {{ $t("contraseñaOlvidada") }}
          </q-btn>
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
          class="row justify-center q-mt-md no-wrap"
        >
          <!-- Div vacio para generar espacio de 15 px verticalmente -->
          <!-- Div vacio que mueve los elementos 85px hacia abajo -->

          <q-btn
            color="primary"
            :label="$t('btnVolver')"
            no-caps
            size="md"
            @click="changeView('login')"
            style="
              min-width: 120px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
          />
        </div>

        <!-- Div que contiene los botones de volver y actualizar de la vista password -->
        <div
          v-if="view === 'password'"
          class="row justify-center q-mt-md no-wrap"
          style="margin-top: 150px"
        >
          <!-- Div vacio para generar espacio de 15 px verticalmente -->
          <q-btn
            color="primary"
            :label="$t('btnVolver')"
            no-caps
            size="md"
            @click="changeView('login')"
            class="q-mr-sm"
            style="
              min-width: 120px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
          />

          <q-btn
            color="primary"
            :label="$t('btnActualizarPassword')"
            no-caps
            size="md"
            @click="updatePassword()"
            class="q-ml-sm"
            style="
              min-width: 120px;
              min-height: 45px;
              border-radius: 10px;
              width: 160px;
            "
          />
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
import { ref, nextTick, watch } from "vue";
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
import sessionStorageUtils from "src/utils/sessionStorageUtils";

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

// Variable que controla el token del captcha
const tokenCaptcha = ref(null);

// Variable que controla el spinner de carga
const isLoading = ref(false);

//Creamos watcher que renderiza el captcha si estamos en la vista password
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
        sitekey: process.env.RECAPTCHA_SITE_KEY,
        callback: onCaptchaSuccess,
        "expired-callback": onCaptchaExpired,
        size: "compact",
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
  tokenCaptcha.value = token;
  //console.log("Token", token);
};

// Callback cuando el captcha se expira
const onCaptchaExpired = () => {
  tokenCaptcha.value = null;
};

const login = async (email, password) => {
  try {
    // 1. Validaciones de campos
    if (!email && !password) {
      notify($q, t, "errorCamposVacios", "nok");
      return;
    }
    if (!email) {
      notify($q, t, "errorEmailVacio", "nok");
      return;
    }
    if (!password) {
      notify($q, t, "errorPasswordVacio", "nok");
      return;
    }

    isLoading.value = true;

    // 2. Login y guardado de token
    const response = await apiLogin(email, password);
    authStore.setToken(response.token);
    localStorage.setItem("token", response.token);


    // 6. Login normal, redirigimos al origen o home
    const route = navStore.previousRoute || "/";
    navStore.clearPreviousRoute();
    router.push(route);
    

  } catch (error) {
    notify($q, t, error, "nok");
  } finally {
    isLoading.value = false;
  }
};


// Función que cambia la vista de la ventana
const changeView = (newView) => {
  view.value = newView;

  // Si vamos a la vista password, mantenemos el email
  if (newView !== "password") {
    email.value = "";
  }

  // Limpiamos los campos restantes siempre;
  password.value = "";
  confirmPassword.value = "";
  recoveryCode.value = "";
  tokenCaptcha.value = null;
};

// Función que registra la pulsación del botón de generar código , abre el dialogo y llama al backend
const generateRecoveryCode = async () => {
  try {
    // Validamos email
    if (validateEmail(email.value, t) !== true || email.value.length === 0) {
      notify($q, t, "errorEmailVacio", "nok");
      return;
    }

    // Validamos el captcha
    if (!tokenCaptcha.value) {
      notify($q, t, "errorCaptcha", "nok");
      return;
    }

    isLoading.value = true;

    // Llamamos método API para generar código de recuperación
    await apiGenerateRecoveryCode(
      email.value,
      locale.value,
      tokenCaptcha.value
    );

    isLoading.value = false;

    // Abrimos el dialogo
    showDialogRecoveryCode.value = true;

    // Pasamos a la vista password
    changeView("password");

    // Validar email, password y confirmar password
  } catch (error) {
    changeView("login");
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

    isLoading.value = true;
    await apiUpdateUserPassword(
      email.value,
      password.value,
      recoveryCode.value,
      locale.value,
    );
    notify($q, t, "passwordUpdated", "ok");
    // Volvemos a la vista inicial de la página
    view.value = "login";
    isLoading.value = false;
  } catch (error) {
    notify($q, t, error, "nok");
  } finally {
    isLoading.value = false;
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

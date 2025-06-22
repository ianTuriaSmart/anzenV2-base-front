<template>
  <q-layout view="hHh lpR ffr">
    <!-- Header con color dínamico-->
    <q-header :style="headerColor" class="text-primary q-pa-md">
      <q-toolbar class="row items-center justify-between">
        <!-- Div que contiene el logo con el link -->
        <div class="q-mt-sm">
          <!-- Imagen a la izquierda, que redirige al hacer clic -->
          <a href="https://www.algimiadealfara.es/" target="_blank">
            <img
              src="../assets/logo.webp"
              alt="Logo"
              class="logo-img q-ma-sm"
            />
          </a>
        </div>

        <!-- Botón hamburguesa con menú desplegable (solo visible en vista móvil) -->
        <q-btn-dropdown
          flat
          dense
          icon="menu"
          class="mobile-only"
          :content-style="headerColor"
          content-class="text-primary"
          no-caps
        >
          <q-list>
            <!-- Idioma -->
            <q-item clickable @click="changeLanguage">
              <q-item-section avatar class="text-weight-bold">
                {{ $t("btnIdioma") }}
              </q-item-section>
              <q-item-section>Idioma</q-item-section>
            </q-item>
            <!-- Inicio -->
            <q-item clickable @click="goHome">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>{{ $t("btnInicio") }}</q-item-section>
            </q-item>
            <!-- Confirmación de reservas (si hay una reserva temporal) -->
            <!-- <q-item v-if="navStore.reservation.exist && navStore.reservation.pending" clickable to="/confirmation">
              <q-item-section avatar>
                <q-icon name="calendar_today" />
              </q-item-section>
              <q-item-section>{{$t('btnReservar')}}</q-item-section>
            </q-item> -->
            <!-- Panel de administración (si el usuario está autenticado como admin) -->
            <q-item
              v-if="authStore.isAuthenticated && authStore.role === 100"
              clickable
              @click="goAdmin"
            >
              <q-item-section avatar>
                <q-icon name="manage_accounts" />
              </q-item-section>
              <q-item-section>{{ $t("btnAdmin") }}</q-item-section>
            </q-item>
            <!-- Perfil (si el usuario está autenticado) -->
            <q-item
              v-if="authStore.isAuthenticated"
              clickable
              @click="goProfile"
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>{{ $t("btnPerfil") }}</q-item-section>
            </q-item>
            <!-- Cerrar sesión (si el usuario está autenticado) -->
            <q-item v-if="authStore.isAuthenticated" clickable @click="logout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>{{ $t("btnCerrarSesion") }}</q-item-section>
            </q-item>
            <!-- Iniciar sesión (si no está autenticado) -->
            <q-item v-else clickable @click="login">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>{{ $t("btnAcceder") }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Div que contiene todos los botones/accesos (solo visible en vista escritorio) -->
        <div class="row items-center q-mt-sm desktop-only">
          <!-- Boton Idioma -->
          <q-btn
            style="
              width: 75px;
              justify-content: center;
              align-items: center;
              border-radius: 10px;
            "
            flat
            no-caps
            stack
            @click="changeLanguage"
          >
            <div class="column items-center">
              <!-- Label principal que actúa como "icono" -->
              <span class="text-bold text-primary">{{ $t("btnIdioma") }}</span>

              <!-- Texto auxiliar adicional -->
              <span class="text-subtitle2 text-primary">Idioma</span>
            </div>
          </q-btn>

          <!-- Boton home -->
          <q-btn
            style="
              width: 75px;
              justify-content: center;
              align-items: center;
              border-radius: 10px;
            "
            flat
            icon="home"
            :label="$t('btnInicio')"
            no-caps
            stack
            @click="goHome"
          />

          <!-- Mostrar boton de acceso a confirmación de reservas si hay una reserva temporal -->
          <!-- <div v-if="navStore.reservation.exist && navStore.reservation.pending" class=" text-subtitle1">
            <q-btn
              style="width: 75px; justify-content: center; align-items: center; border-radius: 10px;" 
              flat
              icon="calendar_today" 
              dense
              no-caps
              stack
              :label="$t('btnReservar')"
              to = "/confirmation"
            />
          </div> -->

          <!-- Mostrar saludo si el usuario está autenticado -->
          <div v-if="authStore.isAuthenticated" class="text-subtitle1">
            <q-btn
              v-if="authStore.role === 100"
              style="
                width: 75px;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
              "
              flat
              icon="manage_accounts"
              dense
              no-caps
              stack
              :label="$t('btnAdmin')"
              @click="goAdmin"
            />
            <q-btn
              style="
                width: 75px;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
              "
              flat
              icon="person"
              dense
              no-caps
              stack
              :label="$t('btnPerfil')"
              @click="goProfile"
            />
            <q-btn
              style="
                width: 75px;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
              "
              flat
              icon="logout"
              :label="$t('btnCerrarSesion')"
              no-caps
              stack
              @click="logout"
            />
          </div>

          <!-- Botón de inicio de sesión si no está autenticado -->
          <q-btn
            v-else
            style="width: 75px; justify-content: center; align-items: center"
            flat
            icon="person"
            @click="login"
            no-caps
            stack
            :label="$t('btnAcceder')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Dialogo para confirmar la eliminación del usuario -->
    <q-dialog v-model="showDialog" persistent>
      <DialogExitConfirmation @cancel="cancelDialog" @exit="exitDialog" />
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer flat class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption text-center q-my-md">
            <div>
              {{ $t("footerTitulo") }}
            </div>
            <div>
              {{ $t("footerDireccion") }}
            </div>
            <div class="text-bold">
              {{ $t("footerTelefono") }}
            </div>
            <a
              :href="'mailto:' + 'registre@algimiadealfara.es'"
              class="text-white text-bold"
            >
              registre@algimiadealfara.es
            </a>
          </div>
          <div></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "src/stores/authStore.js";
import { useNavigationStore } from "src/stores/navigationStore.js";
import { notify } from "src/utils/notify"; // Importamos función custom para las notificaciones
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { apiVerifyToken } from "src/services/apiAuth";

import { useI18n } from "vue-i18n";
import DialogExitConfirmation from "src/components/DialogExitConfirmation.vue";
import { useRouter } from "vue-router"; // Importamos el router
import sessionStorageUtils from "src/utils/sessionStorageUtils";

const router = useRouter(); // Instancia del router de Vue

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const authStore = useAuthStore(); // Instancia de la store
const navStore = useNavigationStore(); // Instancia de la store

const { t, locale } = useI18n(); // Acceso al idioma actual

const showDialog = ref(false); // Controla la visibilidad del dialog
let dialogResult = null; // Controla el resultado del dialog

defineOptions({
  name: "MainLayout",
});

// Comprobamos en el onMounted si tenemos un token guardado en el localStorage
onMounted(async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const isValid = await apiVerifyToken(token);
    if (!isValid) throw new Error("Invalid token");

    authStore.setToken(token);

  } catch (err) {
    localStorage.removeItem("token");
    authStore.logout();
  }
});

// Propiedad computada que aplica un color al q-header en función de la página
const headerColor = computed(() => {
  const currentRoute = router.currentRoute.value.name;

  // if (currentRoute === 'Home') {
  //   return { backgroundColor: '#DEE1E6' };
  // } else {
  //   return { backgroundColor: '#f7f8fa' };
  // }
  return { backgroundColor: "#f7f8fa" };
});

// Función que cambia de idioma
const changeLanguage = () => {
  if (locale.value === "es-ES") {
    locale.value = "va-VA";
  } else {
    locale.value = "es-ES";
  }
};

/* Esta función gestiona el dialogo de confirmación de salida de la reserva temporal */
const manageDialog = () => {
  const currentRoute = router.currentRoute.value.name;
  //Solo se mostrará el dialogo si estamos en la ventana de confirmación
  if (
    (currentRoute === "Confirmation" &&
      sessionStorageUtils.get("reservation")?.reservation) ||
    (currentRoute === "ConfirmationAcc" &&
      sessionStorageUtils.get("access")?.access)
  ) {
    showDialog.value = true;

    return new Promise((resolve) => {
      dialogResult = resolve;
    });
  }
  // Si no estamos en la ventana de confirmación resolvemos la promesa para continuar
  return Promise.resolve();
};

// Función que resuelve el dialogo recibiendo el parametro action
const resolveDialog = (action) => {
  // Si dialogResult tiene un valor -> se mostró el diálogo y se generó una promesa
  if (dialogResult) {
    // Resolvemos la promesa
    dialogResult(action);
  }
  showDialog.value = false;
};

// Función que resuelve la promesa cuando el usuario quiere volver a la reserva temporal
const cancelDialog = () => {
  resolveDialog("cancel");
};

// Función que resuelve la promesa cuando el usuario quiere salir de la reserva temporal
const exitDialog = () => {
  resolveDialog("exit");
};


const logout = async () => {
  // localStorage.removeItem('token');
  // isAuthenticated.value = false;
  try {
    // Gestionamos el diálogo
    const action = await manageDialog("logout");
    const tempRes = sessionStorageUtils.get("reservation");
    const tempAcc = sessionStorageUtils.get("access");

    if (action === "cancel") {
      // No hacemos nada
      if (tempRes) {
        // volvemos a la ventana confirmation si existe una reserva pendiente
        router.push("/confirmation");
      } else if (tempAcc) {
        router.push("/confirmation/acc");
      }
      return;
    } 

    // Tanto si la acción ha sido exit como si la promesa se ha resuelto sin valor
    // Procedimiento de cierre de sesión
    authStore.logout();
    localStorage.removeItem("token");
    sessionStorageUtils.remove("reservation");
    sessionStorageUtils.remove("reservationExpiration");
    sessionStorageUtils.remove("access");
    sessionStorageUtils.remove("accessExpiration");

    notify($q, t, "cierreSesion", "ok");
    router.push("/");
  } catch (error) {
    notify($q, t, error.message, "nok");
  }
};

const login = () => {
  router.push("/login");
};

const goHome = async () => {
  try {
    const action = await manageDialog();

    if (action === "cancel") {
      return;
    } 

    sessionStorageUtils.remove("reservation");
    sessionStorageUtils.remove("reservationExpiration");
    sessionStorageUtils.remove("access");
    sessionStorageUtils.remove("accessExpiration");
    // Tanto si la acción ha sido exit como si la promesa se ha resuelto sin valor
    // Volvemos a home
    router.push("/");
  } catch (error) {
    notify($q, t, error.message, "nok");
  }
};

const goProfile = async () => {
  try {
    const action = await manageDialog();
    

    if (action === "cancel") {
      return;
    } 

    sessionStorageUtils.remove("reservation");
    sessionStorageUtils.remove("reservationExpiration");
    sessionStorageUtils.remove("access");
    sessionStorageUtils.remove("accessExpiration");

    // Si no hay error, navegamos a la ventana de perfil
    router.push("/profile");
  } catch (error) {
    notify($q, t, error.message, "nok");
    router.push("/"); // Si hay error volvemos a home
  }
};

const goAdmin = async () => {
  try {
    const action = await manageDialog();

    if (action === "cancel") {
      return;
    } 
    sessionStorageUtils.remove("reservation");
    sessionStorageUtils.remove("reservationExpiration");
    sessionStorageUtils.remove("access");
    sessionStorageUtils.remove("accessExpiration");

    // Si no hay error, navegamos a la ventana de admin
    router.push("/admin");
  } catch (error) {
    notify($q, t, error.message, "nok");
    router.push("/"); // Si hay error volvemos a home
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f7f8fa;
  overflow-x: hidden;
}

/* Asegurarse de que la imagen no distorsione el layout */
.logo-btn {
  padding: 0; /* Eliminar padding del botón */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: none; /* Elimina cualquier sombra predeterminada */
  border: none; /* Elimina borde de enfoque */
  background-color: transparent; /* Elimina cualquier fondo */
}

.logo-img {
  max-height: 45px; /* Ajusta el tamaño máximo de la imagen */
  object-fit: contain; /* Mantiene la proporción de la imagen sin distorsionarla */
}
</style>

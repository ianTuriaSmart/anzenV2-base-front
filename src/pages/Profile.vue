<template>

    <!-- Row que contiene el título -->
    <div class="row justify-center q-mt-lg q-mx-md">
      <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
        {{ $t('tituloPerfil') }}
      </div>
      <div class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary">
        {{ $t('subtituloPerfil') }}
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

    <!-- Div que se engloba todos los elementos a ocultar cuando este cargando-->
    <div v-if="!isLoading">
      <!-- Fila que contiene el toogle de selección de sección -->
      <div class="row justify-center q-mt-sm">
        <q-btn-toggle
          v-model="section"
          no-caps
          unelevated
          text-color="primary"
          :options="[
            {label: $t('datosCliente'), value: '1', style: 'width: 100px;'},
            { label: $t('reservasActivas'), value: '2', style: 'width: 100px;' },
            //{ label: $t('accesosActivos'), value: '3', style: 'width: 100px;' },
            
          ]"
          style="border-radius: 10px; background-color: #DEE1E6;"
        />
        <!-- :disable="isUserReservationsEmpty" -->
      </div>

      <!-- Row que contiene la q-card -->
      <div class="row justify-center q-mt-md">
        <q-card
          class="q-pa-lg"
          flat
          bordered
          style="width: 85%; height: 600px; border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
        >

        <!-- Fila que contiene el avatar, el correo y el botón de eliminar cuenta -->
            <div class="row justify-center">
              <!-- Avatar centrado -->
              <q-avatar
                size="40px"
                color="primary"
                text-color="white"
                icon="person"
              />
            
              <!-- Correo electrónico -->
              <div class="q-ml-md text-subtitle1 flex items-center"> 
                <div class="text-primary">
                  {{userData.email}}
                </div>
              </div>
            </div>

          <!-- Div que contiene los datos del cliente -->
          
          <ProfileUser
            v-if="section === '1'"
            :userData="userData"
            @user-updated = "getUserData()"></ProfileUser>

          <ProfileReservations
            v-if="section === '2'"
            :userReservations="userReservations"></ProfileReservations>

          <ProfileAccess
          v-if="section === '3'"
          :userAccess="userAccess"></ProfileAccess>

        </q-card>
            
      </div>
      <!-- Botón de eliminar cuenta -->
        <div class="row q-my-md flex justify-center">
          <q-btn
            :label="$t('btnEliminarUsuario')"
            no-caps
            type="button"
            unelevated
            @click="deleteUser()"
            style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px; background-color: #ffdddd; color: #a52d2d;"
            />
        </div>
      </div>
      

    <!-- Dialogo para confirmar la eliminación del usuario -->
    <q-dialog v-model="showDialogDeleteUser" persistent>
      <DialogDeleteUser
        @cancel="cancelDialog"
        @delete="deleteUserFromDialog"
        />
    </q-dialog>

  
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { apiGetUserData, apiDeleteUser } from "src/services/apiProfile";
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useAuthStore } from "src/stores/authStore";
import ProfileUser from "src/components/ProfileUser.vue";
import ProfileReservations from "src/components/ProfileReservations.vue";
import ProfileAccess from "src/components/Access/ProfileAccess.vue";
import { useI18n } from 'vue-i18n';
import DialogDeleteUser from "src/components/DialogDeleteUser.vue";


const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n(); // Hook para acceder a las traducciones

const showDialogDeleteUser = ref(false); // Controla la visibilidad del dialog para confirmar la eliminación del usuario


const section = ref('1');

const userData = ref({
  name: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  idDocument: "",
  isReduced: false,
  isReducedPending: false
});


const userReservations = ref([]);
const userAccess = ref([]);

// Variable que controla el spinner de carga
const isLoading = ref(false);

// Función para obtener los datos del usuario de la base de datos
const getUserData = async () => {
  try {
    isLoading.value = true;
    const response = await apiGetUserData();
    
    // Cargamos datos iniciales
    userData.value = { ...response.user, password: '', confirmPassword: '' };
    userReservations.value = response.reservations;
    userAccess.value = response.access;
    
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : (error.message || 'errorDesconocido');
    notify($q, t, errorMessage, 'nok');
    router.push('/');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getUserData();
});


 // Computed para verificar si el array está vacío o no existe
const isUserReservationsEmpty = computed(() => {
  //console.log(userReservations.value);
  return (!userReservations.value || userReservations.value.length === 0);
});


const deleteUser = async () => {
  // console.log("Eliminar!");
  // Mostramos dialogo de confirmación de eliminación
  showDialogDeleteUser.value = true;
};

// Métodos que nos vienen desde el dialogo de confirmación de eliminación
// Cancelamos la eliminación
const cancelDialog = () => {
  // Cerramos el dialogo y no hacemos nada mas
  showDialogDeleteUser.value = false;
};

// Eliminamos el usuario
const deleteUserFromDialog = async () => {
  try {
    isLoading.value = true;
    // Llamamos a la API para eliminar el usuario
    await apiDeleteUser();
    notify($q, t, 'usuarioEliminado', 'ok');
    authStore.logout();
  } catch (error) {
    // En caso de error recargamos la página
    //window.location.reload();
    notify($q, t, error, 'nok');
  } finally {
    isLoading.value = false;
    router.push('/login');
  }
};




</script>

<style lang="scss" scoped>


</style>
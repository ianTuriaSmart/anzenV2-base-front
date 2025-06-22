<template>
  <div>
            <!-- Nombre -->
            <div class="q-mt-md" >
              <q-input
                v-model="userData.name"
                :label="$t('nombre')"
                outlined
                bg-color="secondary"
                label-color="primary"
                :rules= [checkEmpty]
                :input-style="{ color: '#00406e', }"
                dense
                />
            </div>

            <!-- Apellido -->
            <div class="q-mt-sm">
              <q-input
                v-model="userData.surname"
                :label="$t('apellidos')"
                outlined
                bg-color="secondary"
                label-color="primary"
                :rules= [checkEmpty]
                :input-style="{ color: '#00406e', }"
                dense
                />
            </div>

            <!-- Telefono -->
            <div class="q-mt-sm">
              <q-input
                v-model="userData.phone"
                :label="$t('telefono')"
                outlined
                :rules="[checkPhone]"
                bg-color="secondary"
                label-color="primary"
                :input-style="{ color: '#00406e', }"
                dense
                />
            </div>

            <!-- DNI o Pasaporte -->
            <div class="row q-mt-sm justify-between">
              <q-input
                v-model="userData.idDocument"
                :label="$t('dni')"
                outlined
                bg-color="secondary"
                label-color="primary"
                :rules= "[checkId]"
                :input-style="{ color: '#00406e', }"
                dense
                class="full-width"
                />
            </div>

            <div>
              <q-checkbox
                v-model="userData.isReduced"
                :label="$t('seccionTarifasReducidas')"
                :disable="userData.isReducedPending"
                class="text-primary"
                @update:model-value="isReducedChanged"
              >
                <q-tooltip v-if="userData.isReducedPending">
                  {{ $t('validacionPendiente') }}
                </q-tooltip>
              </q-checkbox>
            </div>

            <!-- Botón de password -->
            <div class="q-mt-md">
              <q-input
                v-model="userData.password"
                :label="$t('contraseña')"
                outlined
                bg-color="secondary"
                label-color="primary"
                :input-style="{ color: '#00406e', }"
                dense
                :rules="[checkPassword]"
                :type="passwordVisibility ? 'password' : 'text'"                      
                >
                <!-- Icono del password -->
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

            <!-- Botón de confirmación de password -->
            <div class="q-mt-sm">
              <q-input
                v-model="userData.confirmPassword"
                :label="$t('confirmarContraseña')"
                outlined
                bg-color="secondary"
                label-color="primary"
                :input-style="{ color: '#00406e', }"
                dense
                :rules="[checkConfirmPassword]"
                :type="confirmPasswordVisibility ? 'password' : 'text'"
                >
                <!-- Icono del password -->
                <template v-slot:append>
                  <q-icon
                    :name="confirmPasswordVisibility ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="confirmPasswordVisibility = !confirmPasswordVisibility"
                    color="primary"
                  />
                </template>
              </q-input>
            </div>

            <!-- Row que contiene la fila con los botones -->
            <div class="row q-mb-lg q-mt-xs justify-center no-wrap">
              
                <q-btn
                  class="q-mr-md"
                  color="primary"
                  :label="$t('btnCancelar')"
                  no-caps
                  size="md"
                  type="button"
                  @click="cancelOperation()"
                  style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
              
                <q-btn
                  class="q-ml-md"
                  color="primary"
                  :label="$t('btnEditar')"
                  no-caps
                  size="md"
                  :disable="!hasChanges"
                  @click="updateUserData()"
                  style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
              
            </div>
  </div>

  <!-- Dialogo usuarios empadronados -->
    <q-dialog v-model="showDialogUserReduced">
      <DialogUserReduced
        @close="showDialogUserReduced = false"
        />
    </q-dialog>


</template>

<script setup>
import { ref, onMounted, computed, watch} from "vue";
import { notify } from "src/utils/notify";
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useNavigationStore } from 'src/stores/navigationStore.js';
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { validatePassword, validatePasswordEmpty, validatePhone, validateId } from "src/utils/formValidations";
import { useI18n } from 'vue-i18n';
import { apiUpdateUser } from "src/services/apiProfile";
import DialogUserReduced from "src/components/DialogUserReduced.vue";


const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const navStore = useNavigationStore(); // Instancia de la store
const { t } = useI18n(); // Hook para acceder a las traducciones

const showDialogUserReduced = ref(false); // Controla la visibilidad del dialogo que muestra la info de los usuarios empadronados

const passwordVisibility = ref(true);
const confirmPasswordVisibility = ref(true);


// Guarda los datos iniciales del usuario para poder detectar cambios
const initialUserData = ref({});

const userData = ref({});

// Definimos props que recibirá el componente
const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['user-updated']);

watch(() => props.userData, (newValue) => {
  userData.value = { ...newValue };
});

onMounted(() => {
  initialUserData.value = { ...props.userData };
  userData.value = { ...props.userData };
})



// Función que comprueba si ha habido cambios en los datos del usuario
// Se utiliza para habilitar el botón de Editar
const hasChanges = computed(() => {
  return JSON.stringify(userData.value) !== JSON.stringify(initialUserData.value);
});


// Función que obtiene los campos modificados y los devuelve en un objeto
// Se utiliza para actualizar el usuario al pulsar Editar
const modifiedFields = computed(() => {
  //console.log(Object.keys(userData.value).filter(key => userData.value[key] !== initialUserData.value[key]));

  const modifiedKeys = Object.keys(userData.value).filter(key => userData.value[key] !== initialUserData.value[key]);

  const updatedData = modifiedKeys.reduce((obj, key) => {
    obj[key] = userData.value[key];
    return obj;
  }, {});

  return updatedData;
});

// Función que detecta cada vez que el usuario activa el checkbox de empadronamiento y muestra dialogo
const isReducedChanged = (newValue) => {
  if (newValue) {
    showDialogUserReduced.value = true;
  }
};


const updateUserData = async () => {
  // Llamamos a la computada modifiedFields para obtener los campos modificados
  //console.log(modifiedFields.value);

  // No se puede eliminar de un computed, hacemos una copia
  const fieldsToSend = { ...modifiedFields.value };
  delete fieldsToSend.confirmPassword;
  try {

    // Validación nombre y apellido
    if (userData.value.name.length === 0 || userData.value.surname.length === 0) {
      notify($q, t, 'errorCamposVacios', 'nok');
      return;
    };

    // Validación del telefono
    if (validatePhone(userData.value.phone, t) !== true) {
      notify($q, t, 'errorTelefonoValido', 'nok');
      return;
    };

    // Validación del DNI
    if (validateId(userData.value.idDocument, t) !== true) {
      notify($q, t, 'errorDNIValido', 'nok');
      return;
    };

    if (modifiedFields.value.password) {
      // Validación de la contraseña
      if (validatePassword(userData.value.password, t) !== true) {
        notify($q, t, 'errorPasswordValido', 'nok');
        return;
      };
    }

    // Validación de la confirmación de la contraseña
    if (userData.value.password !== userData.value.confirmPassword) {
      notify($q, t, 'errorConfPassword', 'nok');
      return;
    };

    // Actualizamos en la base de datos
    await apiUpdateUser(fieldsToSend);
    initialUserData.value = { ...userData.value };
    notify($q, t, 'usuarioEditado', 'ok');

    // Refrescamos los datos
    //await getUserData();
    emit('user-updated');

  } catch (error) {
    // En caso de error recargamos la página
    //window.location.reload();
    notify($q, t, error, 'nok');
  }
};


// Para las validaciones de los inputs creamos funciones intermedias que pasen la instacia de t
const checkPassword = (password) => {
  return validatePasswordEmpty(password, t);
};

const checkPhone = (phone) => {
  return validatePhone(phone, t);
};

const checkId = (id) => {
  return validateId(id, t);
};

const checkConfirmPassword = () => {
  if (userData.value.password !== userData.value.confirmPassword) {
    return t('valConfPassword');
  }

  return true;
};

const checkEmpty = (field) => {
  if (field.length === 0) {
    return t('errorCampoVacio');
  }

  return true;
};


// Acciones de los botones
const cancelOperation = () => {
  // Vamos a ruta anterior o a home
  if (navStore.previousRoute) {
    router.push(navStore.previousRoute);
  } else {
    router.push('/');
  }
};




</script>

<style lang="scss" scoped>

</style>
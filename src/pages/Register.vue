<template>

    <!-- Row que contiene el título -->
    <div class="row justify-center q-mt-lg q-mx-md">
      <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
        {{ $t('tituloRegistro') }}
      </div>
      <div class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary">
        {{ $t('subtituloRegistro') }}
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
    <div v-if="!isLoading" class="row justify-center q-mt-lg q-mb-lg">
      <q-card
        class="q-pa-lg"
        flat
        bordered
        style="width: 85%; height: 575px;  border: 2px solid var(--q-primary); border-radius: 30px; background: #f7f8fa;;"
      >
        <!-- Avatar centrado -->
        <div class="row justify-center">
          <q-avatar
            size="80px"
            color="primary"
            text-color="white"
            icon="person_add"
          />
        </div>

          <!-- Wizzard del navegación para el registro -->
          <q-stepper  v-model="currentStep" flat contracted  class="bg-transparent">

            <!-- Paso 1 -->
            <q-step name="step1" title="Información de la cuenta" icon="email">

              <!-- Botón de email -->
              <div>
                <q-input
                  v-model="userData.email"
                  :label="$t('email')"
                  type="email"
                  autocomplete="username"
                  outlined
                  bg-color="secondary"
                  label-color="primary"
                  :input-style="{ color: '#00406e', }"
                  dense
                  :rules="[checkEmail]"
                  />
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
              <div class="q-mt-md">
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
              
              <!-- Espacio vacío del mismo tamaño que el q-input -->
              <div class="q-mt-md" style="height: 60px;"> <!-- Ajusta la altura según el tamaño del input -->
                <!-- Este div mantiene el mismo espacio que tendría el q-input -->
              </div>

              <!-- Row que contiene la fila con los botones -->
              <div class="row q-mb-md q-mt-md justify-center no-wrap" >
                
                  <q-btn
                    color="primary"
                    :label="$t('btnAnterior')"
                    no-caps
                    size="md"
                    type="button"
                    @click="goPrevStep()"
                    class="q-mr-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />

                  <q-btn
                    color="primary"
                    :label="$t('btnSiguiente')"
                    no-caps
                    size="md"
                    @click="goNextStep()"
                    class="q-ml-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
              
              </div>
            </q-step>

            <!-- Paso 2 -->
            <q-step name="step2" title="Datos personales" icon="person">
              
              <!-- Nombre -->
              <div >
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
              <div class="q-mt-md">
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

              <!-- Fecha de Nacimiento -->
              <!-- <div class="q-mt-sm">
                <q-input
                  v-model="userData.birthDate"
                  label="Fecha de Nacimiento"
                  type="date"
                  outlined
                  bg-color="secondary"
                  label-color="primary"
                  :rules= true
                  lazy-rules
                  :input-style="{ color: '#00406e', }"
                  dense
                  />
              </div> -->
              
              <!-- Telefono -->
              <div class="q-mt-md">
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
              <div class="q-mt-md">
                <q-input
                  v-model="userData.idDocument"
                  :label="$t('dni')"
                  outlined
                  bg-color="secondary"
                  label-color="primary"
                  :rules= "[checkId]"
                  :input-style="{ color: '#00406e', }"
                  dense
                  />
              </div>

              <!-- Row que contiene la fila con los botones -->
              <div class="row q-mb-md q-mt-md justify-center no-wrap">
                
                  <q-btn
                    color="primary"
                    :label="$t('btnAnterior')"
                    no-caps
                    size="md"
                    type="button"
                    @click="goPrevStep()"
                    class="q-mr-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
          
                  <q-btn
                    color="primary"
                    :label="$t('btnSiguiente')"
                    no-caps
                    size="md"
                    @click="goNextStep()"
                    class="q-ml-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />

              </div>
            </q-step>

            <!-- Paso 3 -->
            <q-step name="step3" title="Confirmación" icon="check">
              <div class="q-mt-md">
                <q-checkbox
                  v-model="userData.isReduced"
                  :label="$t('usuarioReducido')"
                  :true-value="1"
                  :false-value="0"
                  class="text-primary"
                  @update:model-value="reducedUserChanged"
                  />
              </div>
              
              <div class="q-mt-md">
                <q-checkbox
                  v-model="userData.termsAccepted"
                  :label="$t('terminos')"
                  class="text-primary"
                  />
              </div>
              
              <div class="q-mt-lg">
                <!-- Contenedor para el reCAPTCHA -->
                <div id="recaptcha-container"></div>
              </div>

            

              <!-- Row que contiene la fila con los botones -->
              <div class="row q-mb-md q-mt-lg justify-center no-wrap">
                
                  <q-btn
                    color="primary"
                    :label="$t('btnAnterior')"
                    no-caps
                    size="md"
                    type="button"
                    @click="goPrevStep()"
                    class="q-mr-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
                
                  
                  <!-- <q-btn
                    color="primary"
                    :label="$t('btnRegistrar')"
                    @click="showDialogRfid = true"
                    no-caps
                    size="md"
                    class="q-ml-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" /> -->

                  <q-btn
                    color="primary"
                    :label="$t('btnRegistrar')"
                    @click="register()"
                    no-caps
                    size="md"
                    class="q-ml-sm"
                    style="min-width: 120px; min-height: 45px; border-radius: 10px; width: 160px;" />
                
              </div>
            </q-step>
          </q-stepper>
      </q-card>

      <!-- Dialogo precios reducidos -->
      <q-dialog v-model="showDialogUserReduced">
        <DialogUserReduced
          @close="showDialogUserReduced = false"
          />
      </q-dialog>

      <!-- Dialogo rfid -->
      <!-- <q-dialog v-model="showDialogRfid">
        <DialogRfid
          @close="showDialogRfid = false"
          @register="register()"
          />
      </q-dialog> -->
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import { apiRegister } from "src/services/apiAuth";
import { notify } from "src/utils/notify";
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import DialogUserReduced from "src/components/DialogUserReduced.vue";
//import DialogRfid from "src/components/DialogRfid.vue";
import { validateEmail, validatePassword, validatePhone, validateId } from "src/utils/formValidations";
import { useI18n } from 'vue-i18n';

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const showDialogUserReduced = ref(false); // Controla la visibilidad del dialogo que muestra la info de los usuarios empadronados
//const showDialogRfid = ref(false);

const {locale, t } = useI18n(); // Hook para acceder a las traducciones

// Variable que controla el spinner de carga
const isLoading = ref(false);

const currentStep = ref('step1'); // Variable para controlar el paso actual

const userData = ref({
  name: "",
  surname: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthDate: "",
  phone: "",
  idDocument: "",
  isReduced: 0,
  termsAccepted: false,
  tokenCaptcha: null
});

const passwordVisibility = ref(true);
const confirmPasswordVisibility = ref(true);

watch(currentStep, (newStep) => {
  if (newStep === 'step3') {
    renderCaptcha();
  }
});

// Función que renderiza el captcha
const renderCaptcha = () => {
  nextTick(() => {
    grecaptcha.render('recaptcha-container', {
    sitekey: process.env.RECAPTCHA_SITE_KEY,
    callback: onCaptchaSuccess,
      "expired-callback": onCaptchaExpired,
    'size': 'compact'
  });  
  })
};

// Callback cuando el captcha se completa correctamente
const onCaptchaSuccess = (token) => {
  userData.value.tokenCaptcha = token;
};

// Callback cuando el captcha se expira
const onCaptchaExpired = () => {
  userData.value.tokenCaptcha = null;
};

// Navegación hacia adelante
const goNextStep = () => {
  if (currentStep.value === 'step1') {
    // Condiciones a evaluar
    // 1.Email válido y no vacio
    // 2.Password válido y no vacio
    // 3.Password y confirmar password iguales

    if (validateEmail(userData.value.email, t) !== true || userData.value.email.length === 0) {
      notify($q, t, 'errorEmailVacio', 'nok');
      return;
    };

    if (validatePassword(userData.value.password, t) !== true || userData.value.password.length === 0) {
      notify($q, t, 'errorPasswordValido', 'nok');
      return;
    };

    if (userData.value.password !== userData.value.confirmPassword) {
      notify($q, t, 'errorConfPassword', 'nok');
      return;
    };

    currentStep.value = 'step2';

  } else if (currentStep.value === 'step2') {
    // Condiciones a evaluar
    // 1. Nombre y apellido no vacios
    // 2. Fecha de nacimiento valida (De momento no la usamos, evitar si no hace falta)
    // 3. Teléfono válido
    // 4. DNI español valido	

    if (userData.value.name.length === 0 || userData.value.surname.length === 0) {
      notify($q, t, 'errorCamposVacios', 'nok');
      return;
    };

    if (validatePhone(userData.value.phone, t) !== true) {
      notify($q, t, 'errorTelefonoValido', 'nok');
      return;
    };

    if (validateId(userData.value.idDocument, t) !== true) {
      notify($q, t, 'errorDNIValido', 'nok');
      return;
    };

    currentStep.value = 'step3';
  }

  // Si estamos en el paso tres ya no tenemos el botón de avanzar
};

// Navegación hacia atrás
const goPrevStep = () => {
  // si estamos en el step1 volvemos a la página de login
  if (currentStep.value === 'step1') {
    router.push('login');
  };

  if (currentStep.value === 'step2') {

    // Para no mostrar las contraseñas
    passwordVisibility.value = true;
    confirmPasswordVisibility.value = true;

    currentStep.value = 'step1';
  } else if (currentStep.value === 'step3') {
    currentStep.value = 'step2';
  }
};

const register = async () => {

  // Condiciones a evaluar
  // 1. Aceptar terminos y condiciones
  // 2. Captcha completado

  if (userData.value.termsAccepted !== true) {
    notify($q, t, 'errorTerminos', 'nok');
    return;
  };

  if (!userData.value.tokenCaptcha) {
    notify($q, t, 'errorCaptcha', 'nok');
    return;
  };

  isLoading.value = true;

  try {
    //console.log(userData.value);
    // Transformamos a booleano
    const boolIsReduced = userData.value.isReduced === 1 ? 'true' : 'false';

    await apiRegister(
      locale.value,
      userData.value.name,
      userData.value.surname,
      userData.value.email,
      userData.value.password,
      userData.value.phone,
      boolIsReduced,
      userData.value.idDocument,
      userData.value.tokenCaptcha
    );

    notify($q, t, 'usuarioRegistrado', 'ok');
    
  } catch (error) {
    notify($q, t, error, 'nok');
    //resetUser();
  } finally {
    router.push('/login');
    isLoading.value = false
  }
};


// Función que detecta cada vez que el usuario activa el checkbox de usuario precio reducido y muestra dialogo
const reducedUserChanged = (newValue) => {
  if (newValue) {
    showDialogUserReduced.value = true;
  }
};


// Para las validaciones creamos funciones intermedias que pasen la instacia de t
const checkEmail = (email) => {
  return validateEmail(email, t);
};

const checkPassword = (password) => {
  return validatePassword(password, t);
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

</script>

<style lang="scss" scoped>


</style>
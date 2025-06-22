<template>
  <!-- Row que contiene el título -->
  <div class="row justify-center q-mx-lg">
    <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
      {{ $t('tituloPagoError') }}
      
    </div>
  </div>

  <!-- Div que contiene la tarjeta de reserva confirmada correctamente y explicación -->
    <div class="row justify-center q-mt-md">
      <q-card
        flat
        class="q-mx-md"
        style="border-radius: 30px; background: #ffdddd; color: #a52d2d;"
        >
        <q-card-section style="padding: 0px 0px;">
          <div class="row no-wrap justify-center items-center q-pl-md q-pr-md">
              <q-avatar>
                <q-icon name="error_outline" size="sm" />
              </q-avatar>
              
              <div class="text-h7 text-weight-bold text-center q-my-sm q-mr-md">
                {{ $t('msgPagoError') }}
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
              {{ $t('subtituloPagoError') }}
            </div>
          </div>
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


  <!-- <q-page class="flex flex-center column">
    <q-icon name="error_outline" color="red" size="100px" />
    <div class="text-h5 q-mt-md">Pago fallido</div>
    <div class="text-subtitle2">No se ha podido completar el pago.</div>
    <q-btn label="Volver a intentar" to="/" color="primary" class="q-mt-lg" />
  </q-page> -->
</template>

<script setup>
import { onMounted } from 'vue';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { useQuasar } from 'quasar'; // Importa useQuasar para acceder a $q
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal

const $q = useQuasar();  // Usa useQuasar para obtener la instancia de $q
const router = useRouter();

const { t, locale } = useI18n(); // Hook para acceder a las traducciones


onMounted (() => {
  sessionStorageUtils.remove('user');
  sessionStorageUtils.remove('access');


  // if (!payment || !storedAccess) {
  //   router.push('/');
  //   return;
  // };


});



const exitAccess = async () => {

//console.log("Entro", sessionStorageUtils.get('access'));
try {
  // if (sessionStorageUtils.get('access')) {
  //   sessionStorageUtils.remove('access');
  // };

} catch (error) {
  notify($q, t, error, 'nok');

} finally {
  // Redirigir a la página de inicio
  router.push('/').then(() => {
    // Forzar la recarga de la página al llegar a la página de inicio
    window.location.reload();
  });
}

};

</script>
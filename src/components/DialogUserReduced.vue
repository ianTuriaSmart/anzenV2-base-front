<template>
  <q-card
      class=" q-ml-xs text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h5 q-mt-md text-weight-bold text-primary">
            {{ $t('tituloUsuarioReducido') }}
          </div>

          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary">
            {{ $t('texto1UsuarioReducido') }}
          </div>

          <!-- Botón que redirige a las condiciones de tarifas reducidas -->
          <div  class=" col-12 col-md-8 q-mt-md flex justify-center">
            <q-btn
              :label="$t('condiciones')"
              style="text-transform: none"
              icon="euro"
              color="primary"
              flat
              @click="showReducedFeesDialog = true"
              :style="{ borderRadius: '10px' }"
            />
          </div>

          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary text-weight-bold">
            {{ $t('texto2UsuarioReducido') }}
          </div>
          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary">
            {{ $t('texto3UsuarioReducido') }}
          </div>
          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary">
            {{ $t('texto4UsuarioReducido') }}
          </div>
        </div>

        <!-- Row que contiene la fila con los botones -->
        <div class="row q-mb-lg q-mt-lg">
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnVolver')"
              no-caps
              size="md"
              type="button"
              @click="$emit('close')"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        </div>
      </q-card-section>
  </q-card>

  <!-- Dialogo precios -->
  <q-dialog v-model="showReducedFeesDialog">
      <DialogReducedFeesConditions
        @close="closeDialogs"
        />
  </q-dialog>


</template>

<script setup>
import DialogReducedFeesConditions from 'src/components/DialogReducedFeesConditions.vue'
import { ref } from 'vue';

const showReducedFeesDialog = ref(false);

// Define los eventos que emitirá el componente
const emit = defineEmits(['close']);


const closeDialogs = () => {
  showReducedFeesDialog.value = false;
};




</script>


<style lang="scss" scoped>

</style>
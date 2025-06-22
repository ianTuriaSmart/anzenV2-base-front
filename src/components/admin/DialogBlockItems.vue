<template>
  <q-card
      class=" q-ml-xs text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h5 q-mt-md text-weight-bold text-primary">
            {{ $t('tituloDialogoBlock') }}
          </div>
          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary">
            {{ $t('subtituloDialogoBlock') }}
          </div>
        </div>

        <!-- Div con el input para indicar el motivo del bloqueo -->
        <div class="row justify-center q-mt-md">
          <q-input
                  v-model="blockReason"
                  :label="$t('motivo')"
                  outlined
                  bg-color="secondary"
                  label-color="primary"
                  :input-style="{ color: '#00406e', }"
                  dense
                  style="width: 250px;"
                  />
        </div>
        
        <div class="col-12 col-md-8 text-center text-caption q-my-sm q-mx-md q-mt-md text-primary">
            {{ $t('notaDialogoBlock') }}
        </div>
      
        <!-- Row que contiene la fila con los botones -->
        <div class="row q-mb-md q-mt-lg">
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
        
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnBloquear')"
              no-caps
              size="md"
              @click="$emit('block', blockReason)"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        </div>
      </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

const blockReason = ref('');



// Define los eventos que emitirá el componente
const emit = defineEmits(['close', 'block']);







</script>


<style lang="scss" scoped>

</style>
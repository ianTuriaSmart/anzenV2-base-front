<template>
  <q-card
      class=" q-ml-xs text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h5 q-mt-md text-weight-bold text-primary">
            {{ $t('tituloVentanaQR') }}
          </div>
          <div class="col-12 col-md-8 text-center text-caption q-mt-md  text-primary">
            {{ $t('subtituloVentanaQR') }}
          </div>
        </div>

        <!-- Row que contiene el QR Code -->
        <div class="row justify-center q-my-sm">
          <img :src="props.url" class="q-mx-auto" style="max-width: 200px; border-radius: 10px;">
        </div>

        <div class="col-12 col-md-8 text-center text-caption q-my-sm q-mx-md text-primary">
            {{ $t('notaVentanaQR') }}
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
</template>

<script setup>

// Define los eventos que emitirá el componente
const emit = defineEmits(['close']);

// Definimos props que recibirá el componente
const props = defineProps({
  url: {
    type: String,
    required: true,
    default: ''
  },
});

</script>


<style lang="scss" scoped>

</style>
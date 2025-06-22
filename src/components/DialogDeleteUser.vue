<template>
  <q-card
      class="text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center items-center">
          
          <!-- <div class="">
            <q-avatar
              size="40px"
              color="primary"
              text-color="white"
              icon="delete"
            />
          </div> -->
          
    
          <div class="text-h6 q-my-sm q-ml-sm text-center text-weight-bold text-primary">
            {{ $t('tituloConfEliminarUsuario') }}
          </div>
        </div>

        <!-- Row para el texto del mensaje -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-body2 text-primary q-mt-md q-mb-md">
            {{ $t('textoConfEliminarUsuario') }}
          </div>
        </div>

        <!-- Row que contiene la fila con los botones -->
        <div class="row q-mb-md q-mt-xs">
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnCancelar')"
              no-caps
              size="md"
              type="button"
              @click="$emit('cancel')"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        
          <div class="col flex flex-center">
            <q-btn
              color="primary"
              :label="$t('btnEliminar')"
              no-caps
              size="md"
              @click="$emit('delete')"
              style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
          </div>
        </div>
      </q-card-section>
  </q-card>
</template>

<script setup>

// Define los eventos que emitirá el componente
const emit = defineEmits(['cancel', 'delete']);

</script>


<style lang="scss" scoped>

</style>
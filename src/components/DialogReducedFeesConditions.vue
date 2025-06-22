<template>
    <q-card
      class="text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('tituloCondiciones') }}
          </div>
        </div>

        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center q-my-md text-primary">
            {{ $t('subtituloCondiciones') }}
          </div>
        </div>

        <!-- Condiciones par solicitar tarifas de precio reducido -->
        <div class="q-ml-xl q-pb-md flex column">
          <div class="q-mt-sm">• {{ $t('reducedCond1') }}</div>
          <div class="q-mt-sm">• {{ $t('reducedCond2') }}</div>
          <div class="q-mt-sm">• {{ $t('reducedCond3') }}</div>
          <div class="q-mt-sm">• {{ $t('reducedCond4') }}</div>
        </div>

        <!-- Botón para cerrar -->
        <div class="row justify-center q-mb-md">
          <q-btn
            class=""
            color="primary"
            :label="$t('btnVolver')"
            unelevated
            no-caps
            size="md"
            @click="$emit('close')"
            style="min-width: 160px; min-height: 45px; border-radius: 10px;" />
        </div>

      </q-card-section>
    </q-card>
    
</template>

<script setup>


</script>

<style lang="scss" scoped>

</style>
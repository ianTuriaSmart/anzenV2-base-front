<template>
    <q-card
      class="text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('precios') }}
          </div>
        </div>

        <!-- Leyenda con suplemento de luz -->
<div v-if="props.fees.lightSup" class="q-mt-xs q-ml-xl q-pb-lg flex column">
  <div class="q-mt-sm">• {{ $t('precioNormal', { recurso: $t(props.fees.resource), precio: props.fees.fee }) }}</div>
  <div class="q-mt-sm">• {{ $t('precioLuz', { recurso: $t(props.fees.resource), precio: props.fees.feeWithLight }) }}</div>
  <div class="q-mt-sm">• {{ $t('precioReducido', { recurso: $t(props.fees.resource), precio: props.fees.feeDis }) }}</div>
  <div class="q-mt-sm">• {{ $t('precioReducidoLuz', { recurso: $t(props.fees.resource), precio: props.fees.feeDisWithLight }) }}</div>
</div>

<!-- Leyenda sin suplemento de luz -->
<div v-else class="q-mt-xs q-ml-xl q-pb-lg flex column">
  <div class="q-mt-sm">• {{ $t('precioNormal2', { recurso: $t(props.fees.resource), precio: props.fees.fee }) }}</div>
  <div class="q-mt-sm">• {{ $t('precioReducido2', { recurso: $t(props.fees.resource), precio: props.fees.feeDis }) }}</div>
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


// Definimos props que recibirá el componente
const props = defineProps({
  fees: {
    type: Object,
    required: true,
    default: () => ({})
  }
});


// feesInfo.value = {
//     resource: selectedResources.value[0].resource,
//     fee: selectedResources.value[0].fee,
//     feeDis: selectedResources.value[0].feeDis,
//     feeWithLight: selectedResources.value[0].feeWithLight,
//     feeDisWithLight: selectedResources.value[0].feeDisWithLight,
//     localCitizenDis: selectedResources.value[0].localCitizenDis,
//     lightSup: selectedResources.value[0].lightSup
//   }






</script>

<style lang="scss" scoped>

</style>
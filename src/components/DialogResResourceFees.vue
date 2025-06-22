<template>
  <q-card
    class="text-primary"
    flat
    style="width: 400px; background-color: #f7f8fa; border-radius: 30px; max-height: 90vh; overflow-y: auto;"
  >
    <q-card-section>
      <!-- Row que contiene el título -->
      <div class="row justify-center">
        <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
          {{ $t('precios') }}
        </div>
      </div>

      <!-- Spinner -->
      <div v-if="isLoading" class="q-pa-md" style="position: relative;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
          <q-spinner color="primary" size="120px" :thickness="2" />
        </div>
      </div>

      <!-- Contenido con scroll interno -->
      <div v-if="!isLoading" style="max-height: 60vh; overflow-y: auto;">
        <q-list separator class="q-mb-md">
          <q-item v-for="tariff in tariffs" :key="tariff.idTariff">
            <q-item-section>
              <q-item-label>
                • {{ tariff.tariff }}:
                {{ tariff.amount === '0' ? $t('gratuito') : tariff.amount + ' €' }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="props.selectedResource.lightSup">
            <q-item-section>
              <q-item-label>
                • {{ $t('checkLuz') }}:
                {{ props.selectedResource.lightFee == '0' ? $t('gratuito') : props.selectedResource.lightFee + ' €' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Botón para cerrar -->
        <div class="row justify-center q-mb-md">
          <q-btn
            color="primary"
            :label="$t('btnVolver')"
            unelevated
            no-caps
            size="md"
            @click="$emit('close')"
            style="min-width: 160px; min-height: 45px; border-radius: 10px;"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import {  apiGetReservationTariffs } from 'src/services/apiReservations';



// Definimos props que recibirá el componente
const props = defineProps({
selectedResource: {
  type: Object,
  required: true,
  default: () => ({})
}
});

const tariffs = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  //console.log(props.selectedResource);

   // Obtenemos las tarifas de la reserva
  const response = await apiGetReservationTariffs(props.selectedResource.idResource);
  
  isLoading.value = false;
  tariffs.value = response.tariffs
  //console.log("tarifas", tariffs.value);
})


</script>

<style lang="scss" scoped>

</style>
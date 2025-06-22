<template>
  <q-card
      class=" q-ml-xs text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('tituloVentanaReserva') }}
          </div>
        </div>

        <!-- Row que contiene la primera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" :icon="getResourceIcon(reservation.resource)" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                  <q-item-label>
                    {{ $t(reservation.resource) }}
                    <template v-if="reservation.lightSup">+ {{ $t('luz') }}</template>
                  </q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item clickable style="border-radius: 10px;" @click="getMapsLink()" >
                <q-item-section side>
                  <q-avatar square color="white" icon="location_on" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('ubicacion') }}</q-item-label>
                  <q-item-label>{{ $t('maps') }}</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la segunda fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fecha') }}</q-item-label>
                  <q-item-label>{{ reservation.displayDate }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="schedule" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('hora') }}</q-item-label>
                  <q-item-label>{{ reservation.displayHour }}</q-item-label>
                </q-item-section>
              </q-item>
          </div>
        </div>

        <!-- Row que contiene la tercera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('precio') }}</q-item-label>
                  <q-item-label>{{ reservation.fee }} €</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="timelapse" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('duracion') }}</q-item-label>
                  <q-item-label v-if="reservation.slotDuration">{{ reservation.slotDuration }} min</q-item-label>
                  <q-item-label v-else> - </q-item-label>
                </q-item-section>
              </q-item>
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
</template>

<script setup>
import { getResourceIcon } from 'src/utils/resourceIcon.js';

// Define los eventos que emitirá el componente
const emit = defineEmits(['close']);

// Definimos props que recibirá el componente
const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
  resourcesGroups: {
    type: Array,
    required: true,
  }
});

console.log("Detalle", props.reservation);


// Función que abre el link de google maps según el recurso
const getMapsLink = () => {

  const resourceName = props.reservation.resource;

  // Buscar el recurso dentro de todos los grupos por nombre
  const resource = props.resourcesGroups
    .flatMap(group => group.resources)
    .find(r => r.resource === resourceName);

  const link = resource?.locationUrl;

  if (link) {
    window.open(link, '_blank');
  };
};

</script>


<style lang="scss" scoped>

</style>
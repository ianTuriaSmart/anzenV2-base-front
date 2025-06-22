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
                  <q-avatar square color="white" :icon="getResourceIcon(access.resource)" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('instalacion') }}</q-item-label>
                  <q-item-label>
                    {{ $t(access.resource) }}
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
            <q-item clickable style="border-radius: 10px;" @click="getMapsLink()" >
                <q-item-section side>
                  <q-avatar square color="white" icon="confirmation_number" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('tipoAcceso') }}</q-item-label>
                  <q-item-label> {{ translateAccessType(access.accessType, t) }} </q-item-label>
                </q-item-section>
              </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="euro" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('precio') }}</q-item-label>
                  <q-item-label>{{ access.fee }} €</q-item-label>
                </q-item-section>
            </q-item>
          </div>
        </div>

        <!-- Row que contiene la tercera fila de avatares -->
        <div class="row">
          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fechaInicial') }}</q-item-label>
                  <q-item-label>{{ access.displayStartDate }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item >
                <q-item-section side>
                  <q-avatar square color="white" icon="calendar_today" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('fechaFinal') }}</q-item-label>
                  <q-item-label>{{ access.displayEndDate }}</q-item-label>
                </q-item-section>
            </q-item>
          </div>
        </div>

        <div v-if = "access.remainingDays > 0" class="row">
          <div class="col">
            <q-item clickable style="border-radius: 10px;" @click="getMapsLink()" >
                <q-item-section side>
                  <q-avatar square color="white" icon="123" size="48px" style="border-radius: 10px;">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>{{ $t('diasPendientes') }}</q-item-label>
                  <q-item-label> {{ access.remainingDays }} </q-item-label>
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
import { translateAccessType } from 'src/utils/translateAccessType';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n(); // Hook para acceder a las traducciones

// Define los eventos que emitirá el componente
const emit = defineEmits(['close']);

// Definimos props que recibirá el componente
const props = defineProps({
  access: {
    type: Object,
    required: true,
  },
  resourcesGroups: {
    type: Array,
    required: true,
  }
});


// Función que abre el link de google maps según el recurso
const getMapsLink = () => {

  const resourceName = props.access.resource;

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
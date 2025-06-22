<template>
  <q-card
    class="text-primary"
    flat
    style="width: 400px; background-color: #f7f8fa; border-radius: 30px; max-height: 90vh; overflow-y: auto;"
  >
    <q-card-section>
      <!-- Título -->
      <div class="row justify-center">
        <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
          {{ $t('tituloVentanaReserva') }}
        </div>
      </div>

      <!-- Spinner de carga general -->
      <!-- Spinner de carga general -->
      <div v-if="isLoading" class="q-pa-md" style="min-height: 300px; display: flex; justify-content: center; align-items: center;">
        <q-spinner color="primary" size="120px" :thickness="2" />
      </div>

      <!-- Contenido principal -->
      <div v-if="!isLoading" style="max-height: 60vh; overflow-y: auto;">
        <q-list separator class="q-mb-md">
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('nombre') }}:</strong> {{ reservation.userName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('email') }}:</strong> {{ reservation.userEmail }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('telefono') }}:</strong> {{ reservation.userPhone }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('instalacion') }}:</strong> {{ $t(reservation.resource) }} <template v-if="reservation.lightSup">+ {{ $t('luz') }}</template></q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>Reserva:</strong> {{ reservation.displayDate }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('duracion') }}:</strong> {{ reservation.slotDuration }} min</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="reservation.userTypes">
            <q-item-section>
              <q-item-label>• <strong>{{ $t('tipoUsuario') }}:</strong> {{ $t(reservation.userType) }}</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-item v-if="reservation.countNormal > 0">
            <q-item-section>
              <q-item-label>• <strong>{{ $t('entradasNormalesP') }}:</strong> {{ reservation.countNormal }}</q-item-label>
            </q-item-section>
          </q-item> -->
          <!-- <q-item v-if="reservation.countReduced > 0">
            <q-item-section>
              <q-item-label>• <strong>{{ $t('entradasMenoresP') }}:</strong> {{ reservation.countReduced }}</q-item-label>
            </q-item-section>
          </q-item> -->
          <q-item>
            <q-item-section>
              <q-item-label>• <strong>{{ $t('precio') }}:</strong> {{ reservation.fee === '0' ? $t('gratuito') : `${reservation.fee} €` }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Botones y spinner de envío -->
        <div class="row justify-center q-mb-md" style="position: relative;">
          <q-btn
            color="primary"
            :label="$t('btnVolver')"
            unelevated
            no-caps
            size="md"
            @click="$emit('close')"
            style="min-width: 160px; min-height: 45px; border-radius: 10px;"
          />

          <!-- <q-btn
            color="primary"
            :label="$t('btnEnviarQR')"
            unelevated
            no-caps
            size="md"
            @click="sendreservationEmail"
            style="min-width: 160px; min-height: 45px; border-radius: 10px;"
          /> -->

        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

const { t, locale } = useI18n();
const $q = useQuasar();
const emit = defineEmits(['close']);

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const { reservation } = props;
const isLoading = ref(false);  // para control de spinner global (si es necesario)


</script>

<style lang="scss" scoped>
</style>

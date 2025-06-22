<template>
    <q-card
      class="text-primary"
      flat
      style="width: 400px; background-color: #f7f8fa; border-radius: 30px;">
      
      <q-card-section>
        <!-- Row que contiene el título -->
        <div class="row justify-center">
          <div class="col-12 col-md-8 text-center text-h4 q-my-md text-weight-bold text-primary">
            {{ $t('leyenda') }}
          </div>
        </div>

        <!-- Leyenda de estados de celdas -->        
        <div class="q-mt-xs q-ml-xl q-pb-lg">
          <div class="row items-center">
            <div class="q-mr-sm" :style="{ backgroundColor: '#ffffff', border: '1px solid #4d4d4d', height: '10px', width: '10px', borderRadius: '5px' }"></div>
            <div>{{ $t('leyendaDisponible') }}</div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="q-mr-sm" :style="{ backgroundColor: '#ffdddd', border: '1px solid #a52d2d', height: '10px', width: '10px', borderRadius: '5px' }"></div>
            <div>{{ $t('leyendaOcupado') }}</div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="q-mr-sm" :style="{ backgroundColor: '#daffe0', border: '1px solid #1b4618', height: '10px', width: '10px', borderRadius: '5px' }"></div>
            <div>{{ $t('leyendaMisReservas') }}</div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="q-mr-sm" :style="{ backgroundColor: '#DEE1E6' , border: '1px solid #74797f', height: '10px', width: '10px',borderRadius: '5px' }"></div>
            <div>{{ $t('leyendaNoDisponible') }}</div>
          </div>
          <div class="row items-center q-mt-sm">
            <div class="q-mr-sm" :style="{ backgroundColor: '#ffebb1',  border: '1px solid #b28a17', height: '10px', width: '10px',borderRadius: '5px' }"></div>
            <div>{{ $t('leyendaBloqueadoTemp') }}</div>
          </div>
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
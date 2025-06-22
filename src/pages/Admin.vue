<template>
  <!-- Row que contiene el título -->
    <div class="row justify-center q-mt-lg q-mx-md">
      <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
        {{ $t('tituloPanelAdmin') }}
      </div>
      <div class="col-12 col-md-8 text-center text-body1 text-weight-light text-primary">
        {{ $t('subtituloPanelAdmin') }}
      </div>
    </div>

    <!-- Fila que contiene el toogle de selección de sección -->
    <div class="row justify-center q-mt-md">
      <q-btn-toggle
        v-model="section"
        no-caps
        unelevated
        toggle-color="primary"
        text-color="primary"
        :options="[
        { label: $t('seccionAccesos'), value: 'access', style: 'width: 120px;' },
        { label: $t('seccionReservas'), value: 'reservations', style: 'width: 120px;' },
          // { label: $t('seccionTarifasReducidas'), value: 'reducedUsers', style: 'width: 120px;' },
          // {label: $t('seccionRfid'), value: 'rfid', style: 'width: 120px;'},
          //{ label: $t('seccionReservas'), value: 'reservations', style: 'width: 120px;' },
          //{ label: $t('seccionInstalacion'), value: 'inst', style: 'width: 120px;' },
        ]"
        style="border-radius: 10px; background-color: #DEE1E6;"
      />
    </div>


    <!-- <AdminReducedUsers v-if="section === 'reducedUsers'"></AdminReducedUsers>
    <AdminRfid v-if="section === 'rfid'"></AdminRfid> -->
    <AdminReservations v-if="section === 'reservations' "></AdminReservations>
    <!-- <AdminInstalation v-if="section === 'inst' "></AdminInstalation> -->
    <AdminAccessUsers v-if="section === 'access'"></AdminAccessUsers>
    <!-- <AdminReducedUsers></AdminReducedUsers> -->

</template>

<script setup>
import { ref } from 'vue';
// import AdminInstalation from 'src/components/admin/AdminInstalation.vue';
import AdminReservations from 'src/components/admin/AdminReservations.vue';
//import AdminReducedUsers from 'src/components/admin/AdminReducedUsers.vue';
import AdminAccessUsers from 'src/components/admin/AdminAccessUsers.vue';
//import AdminRfid from 'src/components/admin/AdminRfid.vue';

const section = ref('access');


</script>

<style lang="scss" scoped>

</style>
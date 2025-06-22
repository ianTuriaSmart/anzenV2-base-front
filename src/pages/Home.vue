<template>
  <q-page class="custom-page">

    <!-- Título general -->
    <div class="row justify-center q-mt-lg">
      <div class="col-12 text-center text-h4 text-weight-bold text-primary">
        {{ $t('tituloHome') }}
      </div>
    </div>

    <!-- Subtítulo -->
    <div class="row justify-center q-mx-lg">
      <div class="col-12 col-md-8 text-center text-body1 text-primary q-mt-md q-mb-xl">
        {{ $t('subtituloHome') }}
      </div>
    </div>

    <!-- Tarjetas de grupo apiladas -->
    <div class="column items-center q-gutter-lg q-mb-lg">
      <div
        v-for="resourceGroup in resourcesData"
        :key="resourceGroup.idGroup"
        class="resource-card"
        @click="redirectToPage(resourceGroup)"
      >
        <q-img
          :src="`/img/${resourceGroup.group}.webp`"
          class="resource-image"
        >
          <div class="resource-title absolute-top text-h5 text-white text-bold text-center full-width q-pt-sm">
            {{ $t('reservas') }} {{ $t(resourceGroup.group) }}
          </div>
        </q-img>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNavigationStore } from 'src/stores/navigationStore.js';
import { useQuasar } from 'quasar';
import { apiGetResourcesData } from 'src/services/apiHome';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';

const $q = useQuasar();
const navStore = useNavigationStore();
const router = useRouter();

const resourcesData = ref([]);

const getResourcesData = async () => {
  sessionStorageUtils.remove('selectedGroup');

  if (sessionStorageUtils.get('resourcesGroups')) {
    resourcesData.value = sessionStorageUtils.get('resourcesGroups');
  } else {
    try {
      const response = await apiGetResourcesData();
      resourcesData.value = response;
      sessionStorageUtils.set('resourcesGroups', response);
    } catch (error) {
      console.error('Error al obtener los recursos:', error);
    }
  }
};

// Commit de prueba para ver


onMounted(() => {
  navStore.setPreviousRoute(router.currentRoute.value.fullPath);
  getResourcesData();
});

const redirectToPage = (group) => {
  //console.log(group);
  //console.log(group.resources[0].typeSlot);
  sessionStorageUtils.set('selectedGroup', group);
  if (group.resources[0].typeSlot === 'access' || group.resources[0].typeSlot === 'accessQR') {
    router.push('/access');
  } else {
    router.push('/calendar');
  }
};
</script>

<style scoped>
.custom-page {
  background: #f7f8fa;
  min-height: 100vh; /* Asegura que ocupa toda la altura de la ventana */
  overflow-x: hidden; /* Evita scroll lateral */
}

.resource-card {
  width: 80%;
  max-width: 1200px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: none;
}

.resource-image {
  height: 150px;
  object-fit: cover;
}

.resource-title {
  background: rgba(0, 64, 110, 0.6);
  padding: 8px 0;
}
</style>

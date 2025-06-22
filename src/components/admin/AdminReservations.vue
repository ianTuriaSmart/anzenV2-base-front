<template>
  <!-- Contenedor del Spinner -->
  <div
    v-if="isLoading"
    class="q-pa-md"
    style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    "
  >
    <!-- Spinner -->
    <q-spinner color="primary" size="120px" :thickness="2" />
  </div>

  <!-- Div que engloba todos los elementos a ocultar cuando este cargando-->
  <div v-if="!isLoading">
    <!-- Tarjeta -->
    <div class="row justify-center q-mt-md q-mb-xl">
      <q-card
        flat
        bordered
        style="
          width: 85%;
          height: 570px;
          border: 2px solid var(--q-primary);
          border-radius: 30px;
          background: #f7f8fa;
        "
      >
        <!-- Avatar sección usuarios -->
        <div class="row justify-center q-mt-md">
          <q-avatar
            size="50px"
            color="primary"
            text-color="white"
            icon="person"
          />
        </div>

        <!-- Textos explicativo -->
        <!-- Texto sección usuarios -->
        <div class="row justify-center q-mt-sm">
          <div
            class="col-12 col-md-8 text-center text-h6 text-weight-medium text-primary"
          >
            {{ $t("msgAdminHistReservation") }}
          </div>
        </div>

        <!-- Listas de usuarios -->
        <div class="flex flex-center">
          <!-- Buscador de usuarios -->
          <div class="column q-mt-md q-gutter-sm justify-center items-center">
            <q-input
              v-model="searchFilter"
              :label="$t('buscador')"
              outlined
              dense
              color="primary"
              :input-style="{ color: '#00406e' }"
              style="width: 300px"
              @keyup.enter="searchUsers"
            >
              <template v-slot:append>
                <q-icon
                  name="search"
                  @click="searchUsers"
                  class="cursor-pointer"
                />
                <q-icon
                  name="clear"
                  @click="clearFilter"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>

          <div
            class="q-mt-md scrollable-list"
            style="width: 95%; overflow-x: auto"
          >
            <div class="scroll-inner">
              <q-list class="text-primary">
                <q-item
                  v-for="item in reservations"
                  :key="`${item.email}-${item.startDate}`"
                  class="q-mt-sm reservation-row"
                >
                  <!-- ICONO DE ESTADO A LA IZQUIERDA -->
                  <q-item-section side class="q-pr-sm q-mr-sm">
                    <q-icon
                      name = "info"
                      color = "primary"
                      class="cursor-pointer"
                      size="sm"
                      @click="handleClick(item)"
                    
                    />
                  </q-item-section>

                  <!-- BOTÓN DE EMAIL -->
                  <!-- <q-item-section side class="q-pr-sm q-mr-sm">
                    <q-btn
                      size="lg"
                      color="primary"
                      flat
                      round
                      @click="handleClick(item)"
                      dense
                    >
                      <q-icon name="email" size="sm" />
                    </q-btn>
                  </q-item-section> -->

                  <q-item-section class="q-px-sm" style="min-width: 160px">
                    <q-item-label caption>{{ $t("nombreCompleto") }}</q-item-label>
                    <q-item-label>{{ item.userName }}</q-item-label>
                  </q-item-section>

                  <!-- <q-item-section class="q-px-sm" style="min-width: 240px">
                    <q-item-label caption>{{ $t("email") }}</q-item-label>
                    <q-item-label>{{ item.userEmail }}</q-item-label>
                  </q-item-section> -->

                  <q-item-section class="q-px-sm" style="min-width: 150px">
                    <q-item-label caption>{{ $t("telefono") }}</q-item-label>
                    <q-item-label>{{ item.userPhone }}</q-item-label>
                  </q-item-section>

                  <q-item-section class="q-px-sm" style="min-width: 220px">
                    <q-item-label caption>Reserva </q-item-label>
                    <q-item-label >
                      {{ $t(item.resource) }} -
                            {{
                              formatDate(item).dateString + ", " + formatDate(item).hour
                            }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="showReservationDetail">
    <DialogAdminReservationDetail @close="closeDialogs" :reservation="selectedReservation" />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { DateTime } from "luxon";
import { apiAdminGetReservationsUsers } from "src/services/apiAdmin";
import { notify } from "src/utils/notify";
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
import { useRouter } from "vue-router"; // Para redirigir al usuario a la pantalla principal
import { useI18n } from "vue-i18n";

import DialogAdminReservationDetail from "./DialogAdminReservationDetail.vue";

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q
const router = useRouter();
const { t, locale } = useI18n(); // Hook para acceder a las traducciones

const isLoading = ref(false);

const searchFilter = ref("");

const reservations = ref([]); // Array con los usuarios

const showReservationDetail = ref(false);

const selectedReservation = ref({});

const getReservations = async () => {
  try {
    isLoading.value = true;
    const response = await apiAdminGetReservationsUsers();
    //console.log(response);

    reservations.value = response.reservations;
    //console.log("Users:", users.value);
  } catch (error) {
    console.error(error);
    notify($q, t, error, "nok");
    router.push("/"); // Redireccionamos a home en caso de error obteniendo los datos
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getReservations();
  //console.log(users.value);
});

function handleClick(item) {
  //console.log('Elemento seleccionado:', item);
  selectedReservation.value = item;
  selectedReservation.value.displayDate = formatDate(item).dateString + ", " + formatDate(item).hour;
  console.log(selectedReservation.value);
  // selectedReservation.value.displayStartDate = getDisplayString(
  //   item.startDate,
  //   locale.value
  // );
  // selectedReservation.value.displayEndDate = getDisplayString(
  //   item.endDate,
  //   locale.value
  // );
  showReservationDetail.value = true;
}



const searchUsers = async () => {
  try {
    isLoading.value = true;

    const response = await apiAdminGetReservationsUsers(searchFilter.value.trim());
    reservations.value = response.reservations;
  } catch (error) {
    console.error(error);
    notify($q, t, error, "nok");
  } finally {
    isLoading.value = false;
  }
};

const clearFilter = () => {
  searchFilter.value = "";
  searchUsers();
};

const formatDate = (res) => {
  const luxonLocale = locale.value === 'es-ES' ? 'es' : 'ca';

  const date = DateTime.fromISO(res.startDate, {
    zone: "Europe/Madrid",
    locale: luxonLocale
  });

  const dayName = date.toFormat('cccc');
  const day = date.toFormat('dd');
  const monthName = date.toFormat('LLLL');
  let hour = date.toFormat('HH:mm');

  const dateString =
    luxonLocale === 'es'
      ? `${capitalize(dayName)} ${day} de ${monthName}`
      : `${capitalize(dayName)} ${day} ${monthName}`;

  if (res.typeSlot === 'partial') {
    hour = hour === '08:00' ? t('mañana') : t('tarde');
  } else if (res.typeSlot === 'daily') {
    hour = t('diario');
  }

  return { dateString, hour };
};



function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const closeDialogs = () => {
  showReservationDetail.value = false;
};
</script>

<style lang="scss" scoped>
.scrollable-list {
  height: 325px; /* Tamaño máximo */
  overflow-y: auto; /* Habilitar scroll vertical */
  scrollbar-width: thin; /* Opcional: Estilo para navegadores modernos */
}

.scrollable-list::-webkit-scrollbar {
  width: 8px; /* Tamaño del scrollbar para navegadores WebKit */
}

.scrollable-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* Color del thumb del scrollbar */
  border-radius: 4px;
}

.scroll-inner {
  min-width: 850px; // 🔄 fuerza scroll horizontal si el contenedor padre es más pequeño
}

.scrollable-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.reservation-row {
  background-color: #dee1e6;
  border-radius: 10px;
  min-width: 850px; // ✅ fuerza scroll horizontal si es necesario
  display: flex;
  align-items: center;
}
</style>

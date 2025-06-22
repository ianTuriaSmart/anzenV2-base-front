<template>
  <q-page class="background-color">
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

    <!-- Row que contiene el título -->
    <div class="row justify-center">
      <div
        class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary"
      >
        {{ groupLabel }}
      </div>

      <!-- Imagen del grupo (responsive) -->
      <div class="col-12 flex flex-center q-mt-sm">
        <q-img :src="groupImageUrl" alt="Imagen del grupo" class="banner-img" />
      </div>
    </div>

    <div v-if="!isLoading" class="calendar-container">
      <!-- Cabecera con selector de recurso -->
      <div class="q-pa-md row justify-center items-center">
        <div class="q-mr-sm text-subtitle1 text-primary">
          {{ $t("instalacion") }}
        </div>
        <q-select
          bg-color="white"
          label-color="primary"
          v-model="selectedResource"
          :options="translatedResources"
          option-label="label"
          option-value="idResource"
          :emit-value="false"
          dense
          outlined
          style="min-width: 200px"
          @update:model-value="resourceSelectorChanged"
        />
      </div>

      <!-- Contenedor principal -->
      <div class="q-pa-md row calendar-content">
        <!-- Tarjeta combinada: cabecera + calendario -->
        <div class="calendar-card-wrapper">
          <!-- Instrucción paso 1 -->
          <div class="step-header center">
            <div class="step-circle">1</div>
            <div class="step-label">{{ $t("seleccionaFecha") }}</div>
          </div>

          <div class="calendar-card q-mb-lg">
            <div class="calendar-header">
              <q-btn
                flat
                icon="chevron_left"
                @click="prevMonth"
                style="color: #00406e"
                :disable="isPrevDisabled"
              />
              <div class="month-label">{{ monthLabel }}</div>
              <q-btn
                flat
                icon="chevron_right"
                @click="nextMonth"
                style="color: #00406e"
                :disable="isNextDisabled"
              />
            </div>

            <table class="calendar-table">
              <thead>
                <tr>
                  <th v-for="(day, index) in weekDays" :key="'day-' + index">
                    {{ day }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, wIdx) in calendarGrid" :key="'week-' + wIdx">
                  <td
                    v-for="(cell, cIdx) in week"
                    :key="'cell-' + wIdx + '-' + cIdx"
                    :class="[
                      'calendar-cell',
                      {
                        'current-month': cell.isCurrentMonth,
                        selected: cell.date === selectedDate,
                        disabled: isDisabled(cell),
                        'fully-booked': isFullyBooked(cell.date),
                        'high-demand':
                          isHighDemand(cell.date) && cell.date !== selectedDate,
                      },
                    ]"
                    @click="selectDate(cell.date)"
                  >
                    <div class="cell-content">{{ cell.day }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Leyenda -->
            <div class="legend-row">
              <div class="legend-item">
                <div class="legend-color unavailable"></div>
                <div class="legend-label">{{ $t("unavailable") }}</div>
              </div>
              <div class="legend-item">
                <div class="legend-color booked"></div>
                <div class="legend-label">{{ $t("fullyBooked") }}</div>
              </div>
              <div class="legend-item">
                <div class="legend-color tempBooked"></div>
                <div class="legend-label">{{ $t("highDemand") }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slots disponibles -->
        <div class="slot-wrapper-wrapper" v-if="selectedDate">
          <!-- Instrucción paso 2 -->
          <div class="step-header center">
            <div class="step-circle">2</div>
            <div class="step-label">{{ $t("seleccionaHora") }}</div>
          </div>

          <div class="slot-wrapper">
            <div class="slot-grid fixed-columns">
              <div
                class="slot-grid-inner"
                :class="{ 'centered-slots': allSlots.length <= 2 }"
              >
                <q-btn
                  v-for="slot in allSlots"
                  :key="slot"
                  flat
                  :class="getSlotClass(slot)"
                  @click="selectSlot(slot)"
                >
                  {{ needsTranslation ? $t(slot) : slot }}
                </q-btn>
              </div>
            </div>

            <!-- Div que contiene los precios -->
            <div v-if="!isLoading" class="row flex justify-center q-mt-md">
              <q-btn
                :label="$t('precios')"
                style="text-transform: none"
                icon="euro"
                color="primary"
                flat
                @click="showFeesDialog = true"
                :style="{ borderRadius: '10px' }"
              />
            </div>

            <!-- Leyenda -->
            <div class="legend-row">
              <div class="legend-item">
                <div class="legend-color available"></div>
                <div class="legend-label">{{ $t("available") }}</div>
              </div>
              <!-- <div class="legend-item">
                <div class="legend-color tempBooked"></div>
                <div class="legend-label">{{ $t('tempbooked') }}</div>
              </div> -->
              <div class="legend-item">
                <div class="legend-color booked"></div>
                <div class="legend-label">{{ $t("booked") }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogo de confirmación de reserva -->
    <q-dialog v-model="showReservationDialog">
      <ReservationForm
        @close="closeDialogs"
        :reservation="selectedReservation"
      />
    </q-dialog>

    <!-- Dialogo precios -->
    <q-dialog v-model="showFeesDialog">
      <DialogResResourceFees @close="closeDialogs" :selectedResource="selectedResource" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { DateTime } from "luxon";
import { useI18n } from "vue-i18n";
import { notify } from "src/utils/notify"; // Importamos función custom para las notificaciones
import { useQuasar } from "quasar"; // Importa useQuasar para acceder a $q
//import { socketManager } from "src/services/socket";
import ReservationForm from "src/components/DialogReservation.vue";
//import CalendarFees from "src/components/CalendarFees.vue";
import { useAuthStore } from "src/stores/authStore";
import { useNavigationStore } from "src/stores/navigationStore.js";
import sessionStorageUtils from "src/utils/sessionStorageUtils";
import { useRouter } from "vue-router"; // Importamos el router
import {
  apiGetReservations,
  apiGetReservationTariffs,
} from "src/services/apiReservations";
import DialogResResourceFees from 'src/components/DialogResResourceFees.vue';

const router = useRouter(); // Instancia del router de Vue

// Stores
const navStore = useNavigationStore(); // Store navegación
const authStore = useAuthStore(); // Store autenticación

const $q = useQuasar(); // Usa useQuasar para obtener la instancia de $q

// Dialogos
const showReservationDialog = ref(false);
const showFeesDialog = ref(false);

const { t, locale } = useI18n();

const today = DateTime.local();
const currentMonth = ref(today.startOf("month"));
const selectedDate = ref();

const isLoading = ref(false); // Controla si la página esta cargando

// Información que estará en la sessionStorage
const calendarGroup = ref({}); // Grupo seleccionado
const calendarResources = ref([]); // Recursos del grupo seleccionado

const selectedResource = ref();

const allSlots = ref([]);

// Array de reservas a mostrar en el calendario
const reservations = ref([]);

const locks = ref([]); // Array con los bloqueos del calendario

// Objeto que se pasa al dialogo con la info de la reserva
const selectedReservation = ref({});

// Objeto que se pasa al dialogo de los precios
const feesInfo = ref({});

onMounted(() => {
  // Guardamos en la store la ruta
  navStore.setPreviousRoute(router.currentRoute.value.fullPath);
  // Obtenemos de la sessionStorage el grupo seleccionado
  calendarGroup.value = sessionStorageUtils.get("selectedGroup");

  if (!calendarGroup.value) {
    router.push("/");
    return;
  }

  // Obtenemos el id del grupo y sus recursos
  const idGroup = calendarGroup.value.idGroup;

  if (!idGroup) {
    router.push("/");
    return;
  }

  calendarResources.value = calendarGroup.value.resources || [];
  selectedResource.value = translatedResources.value[0];

  allSlots.value = getTranslatedSlots(selectedResource.value);

  feesInfo.value = {
    resource: selectedResource.value.resource,
    fee: selectedResource.value.fee,
    feeDis: selectedResource.value.feeDis,
    feeWithLight: selectedResource.value.feeWithLight,
    feeDisWithLight: selectedResource.value.feeDisWithLight,
    localCitizenDis: selectedResource.value.localCitizenDis,
    lightSup: selectedResource.value.lightSup,
  };

  // Llamada a la función que consulta la API y actualiza los datos
  getReservations(idGroup);

  // Gestión del websocket para actualización entre clientes
  // 🔑 Conectamos el socket antes de usarlo
  //socketManager.connect();

  // const socket = socketManager.getSocket();
  // if (socket) {
  // socket.on("updateReservations", (data) => {
  //   //console.log("Websocket recibido:", data);
  //   getReservations(idGroup);
  //   notify($q, t, "wsUpdated", "ok");
  //   selectedDate.value = null;
  //   currentMonth.value = today.startOf('month');
  // });
  // } else {
  //   console.warn("El socket aún no está disponible");
  // }
});

onBeforeUnmount(() => {
  // Desconectamos el socket al salir de la página
  //socketManager.disconnect();
});

// Interacción API
const getReservations = async (idGroup) => {
  try {
    isLoading.value = true; // Empieza el proceso de carga
    const response = await apiGetReservations(idGroup);

    // Actualizamos las reservas
    reservations.value = response.reservations;
    locks.value = response.locks || [];
  } catch (error) {
    //console.error(error);
    notify($q, t, error, "nok");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const getTranslatedSlots = (resource) => {
  if (resource.typeSlot === "hourly") {
    return resource.slots || [];
  } else if (resource.typeSlot === "partial") {
    return ["mañana", "tarde"]; // NO traducimos aquí
  } else if (resource.typeSlot === "daily") {
    return ["diario"]; // NO traducimos aquí
  }
  return [];
};

const resourceSelectorChanged = () => {
  const resource = selectedResource.value;
  if (!resource) return;

  allSlots.value = getTranslatedSlots(resource);

  feesInfo.value = {
    resource: resource.resource,
    fee: resource.fee,
    feeDis: resource.feeDis,
    feeWithLight: resource.feeWithLight,
    feeDisWithLight: resource.feeDisWithLight,
    localCitizenDis: resource.localCitizenDis,
    lightSup: resource.lightSup,
  };

  selectedDate.value = null;
};

const isFullyBooked = (dateISO) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  if (selectedResource.value?.typeSlot === "partial") {
    return isMorningReserved(dateISO) && isAfternoonReserved(dateISO);
  }

  if (selectedResource.value?.typeSlot === "daily") {
    return reservations.value.some(
      (r) =>
        r.date === dateISO &&
        r.idResource === selectedId &&
        r.confirmed === true
    );
  }

  // hourly
  const totalSlots = allSlots.value.length;
  const reservedSlots = reservations.value.filter(
    (r) => r.date === dateISO && r.idResource === selectedId
  ).length;

  return reservedSlots >= totalSlots;
};

const isHighDemand = (dateISO) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  if (selectedResource.value?.typeSlot === "partial") {
    const morningConfirmed = isMorningReserved(dateISO, true);
    const afternoonConfirmed = isAfternoonReserved(dateISO, true);
    const morningAny = isMorningReserved(dateISO, false);
    const afternoonAny = isAfternoonReserved(dateISO, false);

    return (
      (morningAny || afternoonAny) && !(morningConfirmed && afternoonConfirmed)
    );
  }

  if (selectedResource.value?.typeSlot === "daily") {
    const selectedId =
      typeof selectedResource.value === "object"
        ? selectedResource.value.idResource
        : selectedResource.value;

    const hasAnyReservation = reservations.value.some(
      (r) => r.date === dateISO && r.idResource === selectedId
    );
    const hasConfirmedReservation = reservations.value.some(
      (r) =>
        r.date === dateISO &&
        r.idResource === selectedId &&
        r.confirmed === true
    );

    return hasAnyReservation && !hasConfirmedReservation;
  }

  // hourly
  const totalSlots = allSlots.value.length;
  const reservedSlots = reservations.value.filter(
    (r) => r.date === dateISO && r.idResource === selectedId
  ).length;

  return (
    reservedSlots >= Math.ceil(totalSlots * 0.5) && reservedSlots < totalSlots
  );
};

const isMorningReserved = (dateISO, onlyConfirmed = true) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  return reservations.value.some(
    (r) =>
      r.date === dateISO &&
      r.idResource === selectedId &&
      r.time === "08:00" &&
      (!onlyConfirmed || r.confirmed === true)
  );
};

const isAfternoonReserved = (dateISO, onlyConfirmed = true) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  return reservations.value.some(
    (r) =>
      r.date === dateISO &&
      r.idResource === selectedId &&
      r.time === "15:00" &&
      (!onlyConfirmed || r.confirmed === true)
  );
};

const needsTranslation = computed(() => {
  return (
    selectedResource.value?.typeSlot === "partial" ||
    selectedResource.value?.typeSlot === "daily"
  );
});

const translatedResources = computed(() => {
  const _ = locale.value; // 👈 forzar dependencia reactiva

  return calendarResources.value.map((res) => ({
    ...res,
    label: t(res.resource),
  }));
});

const groupLabel = computed(() => {
  if (!calendarGroup.value || !calendarGroup.value.group) return "";
  return `${t("reservas")} ${t(calendarGroup.value.group)}`;
});

const groupImageUrl = computed(() => {
  return calendarGroup.value?.group
    ? `/img/${calendarGroup.value.group}.jpg`
    : null;
});

const weekDays = computed(() => {
  const baseDate = DateTime.fromObject({ weekday: 1 });
  const days = [];
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  for (let i = 0; i < 7; i++) {
    days.push(
      baseDate.plus({ days: i }).setLocale(luxonLocale).toFormat("ccc")
    );
  }
  return days;
});

const monthLabel = computed(() => {
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  const displayMonth = currentMonth.value
    .setLocale(luxonLocale)
    .toFormat("MMMM yyyy");
  let displayString = displayMonth;
  if (luxonLocale !== "es") {
    displayString = displayMonth
      .replace(/^d['’]/i, "")
      .replace(/^de\s+/i, "")
      .trim();
    displayString =
      displayString.charAt(0).toUpperCase() + displayString.slice(1);
  }
  return displayString;
});

const calendarGrid = computed(() => {
  const start = currentMonth.value.startOf("week");
  const end = currentMonth.value.endOf("month").endOf("week");
  const days = [];
  let cursor = start;
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push({
        day: cursor.day,
        isCurrentMonth: cursor.month === currentMonth.value.month,
        date: cursor.toISODate(),
        raw: cursor,
      });
      cursor = cursor.plus({ days: 1 });
    }
    days.push(week);
  }
  return days;
});

const isDisabled = (cell) => {
  const cellDate = DateTime.fromISO(cell.date, { zone: "Europe/Madrid" });
  const now = today.startOf("day");
  const isPast = currentMonth.value.hasSame(now, "month") && cellDate < now;
  const notCurrentMonth = !cell.isCurrentMonth;

  if (isPast || notCurrentMonth) return true;

  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  // 📍Aquí cambia la lógica dependiendo del tipoSlot
  if (selectedResource.value?.typeSlot === "partial") {
    const morningBlocked = isPartialSlotLocked("mañana", cell.date);
    const afternoonBlocked = isPartialSlotLocked("tarde", cell.date);

    // Solo bloquea el día si mañana Y tarde están bloqueados
    return (morningBlocked && afternoonBlocked) || isFullyBooked(cell.date);
  } else if (selectedResource.value?.typeSlot === "daily") {
    const fullyDayBlocked = locks.value.some((lock) => {
      const appliesToResource =
        lock.id_resource === null || lock.id_resource === selectedId;
      const appliesToGroup =
        lock.id_group === null || lock.id_group === calendarGroup.value.idGroup;

      if (!appliesToResource || !appliesToGroup) return false;

      const startDate = DateTime.fromISO(lock.start_date, {
        zone: "Europe/Madrid",
      }).startOf("day");
      const endDate = DateTime.fromISO(lock.final_date, {
        zone: "Europe/Madrid",
      }).endOf("day");

      if (cellDate < startDate || cellDate > endDate) return false;

      if (
        lock.days_week &&
        !lock.days_week.includes(cellDate.weekday.toString())
      ) {
        return false;
      }

      // Si el día tiene cualquier bloqueo, bloqueamos el día completo.
      return true;
    });

    return fullyDayBlocked || isFullyBooked(cell.date);
  } else {
    // hourly
    const allSlotsBlocked = allSlots.value.every((slot) => {
      const slotDateTime = DateTime.fromISO(`${cell.date}T${slot}`, {
        zone: "Europe/Madrid",
      });

      return locks.value.some((lock) => {
        const appliesToResource =
          lock.id_resource === null || lock.id_resource === selectedId;
        const appliesToGroup =
          lock.id_group === null ||
          lock.id_group === calendarGroup.value.idGroup;

        if (!appliesToResource || !appliesToGroup) return false;

        const startDate = DateTime.fromISO(lock.start_date, {
          zone: "Europe/Madrid",
        }).startOf("day");
        const endDate = DateTime.fromISO(lock.final_date, {
          zone: "Europe/Madrid",
        }).endOf("day");

        if (cellDate < startDate || cellDate > endDate) return false;

        if (
          lock.days_week &&
          !lock.days_week.includes(cellDate.weekday.toString())
        ) {
          return false;
        }

        if (lock.start_hour && lock.final_hour) {
          const [sh, sm] = lock.start_hour.split(":").map(Number);
          const [eh, em] = lock.final_hour.split(":").map(Number);
          const lockStart = cellDate.set({ hour: sh, minute: sm });
          const lockEnd = cellDate.set({ hour: eh, minute: em });
          return slotDateTime >= lockStart && slotDateTime < lockEnd;
        }

        return true;
      });
    });

    return allSlotsBlocked || isFullyBooked(cell.date);
  }
};

const isPrevDisabled = computed(() => {
  return (
    currentMonth.value.hasSame(today, "month") ||
    currentMonth.value < today.startOf("month")
  );
});

const isNextDisabled = computed(() => {
  const nextMonthLimit = today.plus({ months: 1 }).startOf("month");
  return (
    currentMonth.value.hasSame(nextMonthLimit, "month") ||
    currentMonth.value > nextMonthLimit
  );
});

const prevMonth = () => {
  selectedDate.value = null;
  if (!isPrevDisabled.value) {
    currentMonth.value = currentMonth.value.minus({ months: 1 });
  }
};

const nextMonth = () => {
  selectedDate.value = null;
  if (!isNextDisabled.value) {
    currentMonth.value = currentMonth.value.plus({ months: 1 });
  }
};

const selectDate = (isoDate) => {
  selectedDate.value = isoDate;
  allSlots.value = getTranslatedSlots(selectedResource.value);
};

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getDisplayString(dateISO, localeCode = "es-ES") {
  const luxonLocale = localeCode === "es-ES" ? "es" : "ca";

  const date = DateTime.fromISO(dateISO)
    .setZone("Europe/Madrid")
    .setLocale(luxonLocale);

  const dayName = date.toFormat("cccc");
  const day = date.toFormat("dd");
  const monthName = date.toFormat("MMMM");

  let displayString = "";

  if (luxonLocale === "es") {
    displayString = `${capitalize(dayName)} ${day} de ${monthName}`;
  } else {
    displayString = `${capitalize(dayName)} ${day} ${monthName}`;
  }

  return displayString;
}

const selectSlot = async (slot) => {
  try {
    const resource = selectedResource.value;
    let dateTime;
    let translateHour = true;

    if (resource.typeSlot === "hourly") {
      // Caso hourly: slot es una hora (por ejemplo "17:00")
      // Parseamos con zona Madrid y luego pasamos a UTC
      dateTime = DateTime.fromISO(`${selectedDate.value}T${slot}`, {
        zone: "Europe/Madrid",
      });
      translateHour = false;
    } else if (resource.typeSlot === "partial") {
      // Caso partial: "mañana" o "tarde"
      const partialTimes = {
        mañana: "08:00",
        tarde: "15:00",
      };
      const time = partialTimes[slot.toLowerCase()] || "08:00"; // fallback seguro
      dateTime = DateTime.fromISO(`${selectedDate.value}T${time}`, {
        zone: "Europe/Madrid",
      });
    } else if (resource.typeSlot === "daily") {
      // Caso daily: siempre 17:00 UTC
      dateTime = DateTime.fromISO(`${selectedDate.value}T17:00`, {
        zone: "Europe/Madrid",
      });
    }

    // Obtenemos las tarifas de la reserva
    const dataTariffs = await apiGetReservationTariffs(resource.idResource);
    //console.log("Tarifas obtenidas:", dataTariffs);

    //console.log("Resource:", resource);

    selectedReservation.value = {
      idUser: authStore.idUser || 0,
      idResource: resource.idResource,
      resource: resource.resource,
      date: dateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss"), // ⚡ enviamos formato local limpio
      dateString: getDisplayString(selectedDate.value, locale.value),
      hour: slot, // "mañana", "tarde", "diario" o una hora tipo "17:00"
      slotDuration: resource.slotDuration,
      typeSlot: resource.typeSlot,
      lightSup: resource.lightSup,
      lightFee: resource.lightFee,
      isUserTypes: resource.userTypes,
      locationUrl: resource.locationUrl,
      translateHour,
      tariffs: dataTariffs.tariffs,
      userTypes: dataTariffs.userTypes,
    };

    //console.log(selectedReservation.value);

    showReservationDialog.value = true;
  } catch (error) {
    console.error(error);
    notify($q, t, error, "nok");
  }
};

const isPartialSlotLocked = (slotName, dateISO) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  const selectedDate = DateTime.fromISO(dateISO, { zone: "Europe/Madrid" });

  const morningEnd = selectedDate.set({ hour: 14, minute: 0 });
  const afternoonStart = selectedDate.set({ hour: 14, minute: 0 });

  return locks.value.some((lock) => {
    const appliesToResource =
      lock.id_resource === null || lock.id_resource === selectedId;
    const appliesToGroup =
      lock.id_group === null || lock.id_group === calendarGroup.value.idGroup;

    if (!appliesToResource || !appliesToGroup) return false;

    const lockStartDate = DateTime.fromISO(lock.start_date, {
      zone: "Europe/Madrid",
    }).startOf("day");
    const lockEndDate = DateTime.fromISO(lock.final_date, {
      zone: "Europe/Madrid",
    }).endOf("day");

    if (selectedDate < lockStartDate || selectedDate > lockEndDate)
      return false;

    if (
      lock.days_week &&
      !lock.days_week.includes(selectedDate.weekday.toString())
    ) {
      return false;
    }

    if (!lock.start_hour || !lock.final_hour) {
      // Bloqueo todo el día
      return true;
    }

    const [sh, sm] = lock.start_hour.split(":").map(Number);
    const [eh, em] = lock.final_hour.split(":").map(Number);

    const lockStartTime = selectedDate.set({ hour: sh, minute: sm });
    const lockEndTime = selectedDate.set({ hour: eh, minute: em });

    if (slotName.toLowerCase() === "mañana") {
      // Bloquea mañana si cualquier parte del bloqueo toca antes de las 14:00
      return lockStartTime < morningEnd;
    }

    if (slotName.toLowerCase() === "tarde") {
      // Bloquea tarde si cualquier parte del bloqueo es después de las 14:00
      return lockEndTime > afternoonStart || lockStartTime >= afternoonStart;
    }

    return false;
  });
};

const getSlotClass = (slot) => {
  const selectedId =
    typeof selectedResource.value === "object"
      ? selectedResource.value.idResource
      : selectedResource.value;

  const now = DateTime.local().setZone("Europe/Madrid");
  const currentDate = DateTime.fromISO(selectedDate.value, {
    zone: "Europe/Madrid",
  });

  let isExpired = false;
  if (selectedResource.value?.typeSlot === "hourly") {
    const slotDateTime = DateTime.fromISO(`${selectedDate.value}T${slot}`, {
      zone: "Europe/Madrid",
    });
    isExpired = selectedDate.value === today.toISODate() && slotDateTime < now;
  }

  let isLocked = false;

  if (selectedResource.value?.typeSlot === "partial") {
    let confirmed = false;
    let temporary = false;

    if (slot.toLowerCase() === "mañana") {
      confirmed = isMorningReserved(selectedDate.value, true);
      temporary = isMorningReserved(selectedDate.value, false) && !confirmed;
    }
    if (slot.toLowerCase() === "tarde") {
      confirmed = isAfternoonReserved(selectedDate.value, true);
      temporary = isAfternoonReserved(selectedDate.value, false) && !confirmed;
    }

    if (confirmed) return "time-slot booked";
    if (temporary) return "time-slot temporal-booked";
    if (isLocked) return "time-slot expired";
    return "time-slot available";
  } else if (selectedResource.value?.typeSlot === "daily") {
    const confirmed = reservations.value.some(
      (r) =>
        r.date === selectedDate.value &&
        r.idResource === selectedId &&
        r.confirmed === true
    );
    const temporary = reservations.value.some(
      (r) =>
        r.date === selectedDate.value &&
        r.idResource === selectedId &&
        r.confirmed === false
    );

    if (confirmed) return "time-slot booked";
    if (temporary) return "time-slot temporal-booked";
    if (isLocked) return "time-slot expired";
    return "time-slot available";
  } else {
    // hourly
    const slotDateTime = DateTime.fromISO(`${selectedDate.value}T${slot}`, {
      zone: "Europe/Madrid",
    });
    isLocked = locks.value.some((lock) => {
      const appliesToResource =
        lock.id_resource === null || lock.id_resource === selectedId;
      const appliesToGroup =
        lock.id_group === null || lock.id_group === calendarGroup.value.idGroup;
      if (!appliesToResource || !appliesToGroup) return false;

      const startDate = DateTime.fromISO(lock.start_date, {
        zone: "Europe/Madrid",
      }).startOf("day");
      const endDate = DateTime.fromISO(lock.final_date, {
        zone: "Europe/Madrid",
      }).endOf("day");
      if (currentDate < startDate || currentDate > endDate) return false;

      if (
        lock.days_week &&
        !lock.days_week.includes(currentDate.weekday.toString())
      )
        return false;

      if (lock.start_hour && lock.final_hour) {
        const [sh, sm] = lock.start_hour.split(":").map(Number);
        const [eh, em] = lock.final_hour.split(":").map(Number);
        const lockStart = currentDate.set({ hour: sh, minute: sm });
        const lockEnd = currentDate.set({ hour: eh, minute: em });
        return slotDateTime >= lockStart && slotDateTime < lockEnd;
      }
      return true;
    });
  }

  // Aquí arreglamos para partial
  if (selectedResource.value?.typeSlot === "partial") {
    if (
      slot.toLowerCase() === "mañana" &&
      isMorningReserved(selectedDate.value)
    ) {
      return "time-slot booked";
    }
    if (
      slot.toLowerCase() === "tarde" &&
      isAfternoonReserved(selectedDate.value)
    ) {
      return "time-slot booked";
    }
    if (isLocked) return "time-slot expired";
    return "time-slot available";
  }

  // Para hourly y daily
  const res = reservations.value.find(
    (r) =>
      r.date === selectedDate.value &&
      r.time === slot &&
      r.idResource === selectedId
  );

  if (isExpired || isLocked) return "time-slot expired";
  if (!res) return "time-slot available";
  if (res.confirmed === false) return "time-slot temporal-booked";
  return "time-slot booked";
};

const closeDialogs = () => {
  showReservationDialog.value = false;
  showFeesDialog.value = false;
  selectedReservation.value = {};
};
</script>

<style scoped>
.calendar-container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-content {
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 24px;
}

.calendar-card-wrapper,
.slot-wrapper-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-header {
  display: flex;
  gap: 10px;
  font-weight: 500;
  margin-bottom: 15px;
}

.step-header.center {
  justify-content: center;
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #00406e;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  font-size: 16px;
  color: #00406e;
}

.legend-row {
  display: flex;
  flex-wrap: wrap; /* o no, según quieras que salten de línea o no */
  justify-content: center; /* centra horizontalmente todos los elementos */
  align-items: center; /* alinea verticalmente el centro de cada item */
  gap: 16px; /* espacio entre cada bloque */
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.booked {
  background-color: #ffdddd;
}

.legend-color.tempBooked {
  background-color: #ffebb1;
}

.legend-color.available {
  background-color: #ddffdd;
}

.legend-color.unavailable {
  background-color: #d6d4d4;
}

.legend-label {
  font-size: 12px;
  color: #00406e;
}

.calendar-card,
.slot-wrapper {
  width: 380px;
  background: white;
  border-radius: 12px;
  box-shadow: none;
  padding: 16px;
  flex-shrink: 0;
  min-height: 220px; /* más ajustado */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra verticalmente */
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slot-grid.fixed-columns {
  display: flex;
  justify-content: center;
  min-height: 160px;
}

.slot-grid-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  justify-items: center; /* Centra horizontalmente cada slot */
  align-content: center; /* Centra verticalmente si hay espacio libre */
  min-height: 192px; /* Calculado para 4 filas de 48px de alto + gaps */
}

.centered-slots {
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(120px, auto));
}

.time-slot {
  padding: 12px 0;
  font-weight: 500;
  border-radius: 10px;
  text-transform: none;
  font-size: 14px;
  text-align: center;
  width: 100%;
  height: 48px;
}

.time-slot.available {
  background: #daffe0;
  color: #1b4618;
}

.time-slot.booked {
  background-color: #ffdddd;
  color: #a52d2d;
  pointer-events: none;
}

.time-slot.temporal-booked {
  background-color: #ffebb1;
  color: #b28a17;
  pointer-events: none;
}

.time-slot.expired {
  background-color: #e3e3e3;
  color: #4d4d4d;
  opacity: 0.3;
  pointer-events: none;
}

.legend-color.temporal-booked {
  background-color: #ffebb1;
  border: 1px solid #b28a17;
}

.month-label {
  font-weight: 500;
  font-size: 16px;
  text-transform: capitalize;
  color: #00406e;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.calendar-table th {
  text-align: center;
  padding: 10px;
  color: #666b71;
  font-weight: 500;
}

.calendar-table td {
  height: 48px;
  text-align: center;
  vertical-align: middle;
  color: #e74b12;
}

.calendar-cell {
  border-radius: 50%;
  color: #999;
  cursor: pointer;
}

.calendar-cell:hover:not(.disabled):not(.selected) {
  background-color: #f0f0f0;
  cursor: pointer;
}

.calendar-cell.current-month {
  color: #333;
}

.calendar-cell.selected {
  background-color: #00406e;
  color: white !important;
  font-weight: bold;
}

.calendar-cell.disabled {
  color: #ccc;
  pointer-events: none;
}

.calendar-cell.fully-booked {
  background-color: #ffdddd;
  color: #a52d2d;
  pointer-events: none;
}

.calendar-cell.high-demand {
  background-color: #ffebb1;
  color: #b28a17;
}

.cell-content {
  height: 36px;
  width: 36px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.banner-img {
  width: 80%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin: 16px auto;
}
</style>

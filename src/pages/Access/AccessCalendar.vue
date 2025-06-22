<template>
  <q-page class="background-color">
    <div v-if="isLoading" class="q-pa-md" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; text-align: center;">
      <q-spinner color="primary" size="120px" :thickness="2" />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 text-center text-h4 text-weight-bold text-primary">
        {{ groupLabel }}
      </div>
      <div class="col-12 flex flex-center q-mt-sm">
        <q-img :src="groupImageUrl" alt="Imagen del grupo" class="banner-img" />
      </div>
    </div>

    <div v-if="!isLoading" class="calendar-container">
      <!-- <div class="q-pa-md row justify-center items-center"> -->
        <!-- Aquí puede ir la fecha de caducidad del RFID -->
        <!-- Caducidad del RFID para este recurso
      </div> -->

      <!-- <div class="col-12 flex flex-center q-mt-sm" v-if="!authStore.isAuthenticated">
        <div class="q-pa-sm text-primary text-weight-medium text-center" style="font-size: 14px;">
          {{ $t("iniciaSesionParaVerAccesos") }}
        </div>
      </div> -->

      <div class="q-pa-md row calendar-content">
        <div class="calendar-card-wrapper">
          <div class="step-header center">
            <div class="step-circle">1</div>
            <div class="step-label">{{ $t("seleccionaFecha") }}</div>
          </div>

          <div class="calendar-card">
            <div class="calendar-header">
              <q-btn flat icon="chevron_left" @click="prevMonth" style="color: #00406e;" :disable="isPrevDisabled" />
              <div class="month-label">{{ monthLabel }}</div>
              <q-btn flat icon="chevron_right" @click="nextMonth" style="color: #00406e;" :disable="isNextDisabled" />
            </div>

            <table class="calendar-table">
              <thead>
                <tr>
                  <th v-for="(day, index) in weekDays" :key="'day-' + index">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, wIdx) in calendarGrid" :key="'week-' + wIdx">
                  <td v-for="(cell, cIdx) in week" :key="'cell-' + wIdx + '-' + cIdx"
                      :class="['calendar-cell', { 'current-month': cell.isCurrentMonth, 'selected': cell.date === selectedDate, 'disabled': isDisabled(cell), 'user-access': cell.isUserAccess }]"
                      @click="selectDate(cell.date)">
                    <div class="cell-content">{{ cell.day }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Leyenda -->
            <div class="legend-row">
              <!-- <div class="legend-item">
                <div class="legend-color user-access"></div>
                <div class="legend-label">{{ $t('userAccessDay') }}</div>
              </div> -->
              <!-- <div class="legend-item">
                <div class="legend-color booked"></div>
                <div class="legend-label">{{ $t('fullyBooked') }}</div>
              </div>
              <div class="legend-item">
                <div class="legend-color tempBooked"></div>
                <div class="legend-label">{{ $t('highDemand') }}</div>
              </div> -->
            </div>

          </div>
        </div>

        <div class="slot-wrapper-wrapper" v-if="selectedDate">
          <div class="step-header center">
            <div class="step-circle">2</div>
            <div class="step-label">{{ $t("seleccionaAcceso") }}</div>
          </div>

          <div class="slot-wrapper">
            <!-- 🆕 Título del grupo seleccionado -->
            <div v-if="selectedAccessTypeGroup" class="q-mt-sm full-width text-center text-weight-bold text-primary">
                  {{ $t(selectedAccessTypeGroup) }}
            </div>

            <div v-else class="q-mt-sm full-width text-center text-weight-bold text-primary" style="visibility: hidden">
              &nbsp;
            </div>

            <div class="slot-grid fixed-columns">
              <div class="slot-grid-inner centered-slots">
            
                <!-- 1️⃣ Selección de grupo -->
                <template v-if="!selectedAccessTypeGroup">
                  <q-btn
                    v-for="(group, index) in accessGroups"
                    :key="'group-' + index"
                    flat
                    class="time-slot available"
                    @click="handleGroupClick(group)"
                  >
                    {{ $t(group.groupAccessType) }}
                  </q-btn>
                </template>

                <!-- 2️⃣ Selección de accessType dentro del grupo -->
                <template v-else>
                  <q-btn
                    v-for="(slot, index) in selectedGroupSlots"
                    :key="'slot-' + index"
                    flat
                    class="time-slot available"
                    @click="selectSlot(slot)"
                  >
                    {{ translateAccessType(slot, t) }}
                  </q-btn>

                </template>
              </div>
            </div>

            <!-- Botón volver en nueva fila centrada -->
            <div v-if="selectedAccessTypeGroup" class="row justify-center">
              <q-btn
                icon="arrow_back"
                color="primary"
                flat
                @click="selectedAccessTypeGroup = null"
                :label="$t('btnVolver')"
                :style="{ borderRadius: '10px' }"
                style="text-transform: none"
              />
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
          </div>
        </div>
      </div>

      <q-dialog v-model="showAccessDialog">
        <AccessForm @close="closeDialogs" :access="selectedAccess" />
      </q-dialog>

      <q-dialog v-model="showFeesDialog">
        <DialogAccResourceFees @close="closeDialogs" :selectedResource="selectedResource" />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useNavigationStore } from 'src/stores/navigationStore';
import { useAuthStore } from 'src/stores/authStore';
import sessionStorageUtils from 'src/utils/sessionStorageUtils';
import { notify } from 'src/utils/notify';
import { apiGetAccessLocks } from 'src/services/apiAccess';
import AccessForm from 'src/components/Access/DialogAccess.vue';
import { translateAccessType } from 'src/utils/translateAccessType';
import { apiGetAccessUser, apiGetAccessTariffs } from 'src/services/apiAccess';
import DialogAccResourceFees from 'src/components/DialogAccResourceFees.vue';



const $q = useQuasar();
const { t, locale } = useI18n();
const router = useRouter();
const navStore = useNavigationStore();
const authStore = useAuthStore();

const isLoading = ref(false);
const calendarGroup = ref({});
const selectedResource = ref();
const selectedDate = ref();
const locks = ref([]);
const showAccessDialog = ref(false);
const selectedAccess = ref({});
const userAccesses = ref([
  // {
  //   startDate: '2025-05-20T00:00:00',
  //   endDate: '2025-05-20T00:00:00'
  // },
  // {
  //   startDate: '2025-05-21T00:00:00',
  //   endDate: '2025-05-27T00:00:00'
  // },
  // {
  //   startDate: '2025-06-01T00:00:00',
  //   endDate: '2025-06-03T00:00:00'
  // }
]);



const showFeesDialog = ref(false);

// Ajustes para mostrar primero los grupos
const selectedAccessTypeGroup = ref(null);

const accessGroups = computed(() => {
  //console.log("AccessGroups", selectedResource.value?.slotsGrouped);
  return selectedResource.value?.slotsGrouped || [];
});

const selectedGroupSlots = computed(() => {
  //console.log("SelectedGroupSlots", selectedAccessTypeGroup.value);
  const group = accessGroups.value.find(g => g.groupAccessType === selectedAccessTypeGroup.value);
  //console.log("Group", group);
  return group?.accessTypes || [];
});



const handleGroupClick = async (group) => {
  // const slots = group.accessTypes || [];
  // console.log("Slots", slots);
  // console.log(slots[0]);

  // if (slots.length === 1) {
  //   console.log("SlotHandler", slots[0], typeof slots[0]);
  //   await selectSlot(slots[0]);
  // } else {
  //   selectedAccessTypeGroup.value = group.groupAccessType;
  // }
  selectedAccessTypeGroup.value = group.groupAccessType;
};


onMounted(async () => {
  navStore.setPreviousRoute(router.currentRoute.value.fullPath);

  sessionStorageUtils.remove('access');
  sessionStorageUtils.remove('accessExpiration');
  sessionStorageUtils.remove('user');

  calendarGroup.value = sessionStorageUtils.get('selectedGroup');
  if (!calendarGroup.value) return router.push("/");

  selectedResource.value = calendarGroup.value.resources?.[0];
  if (!selectedResource.value) return router.push("/");

  await getAccessLocks(calendarGroup.value.idGroup);

  // Gestión accesos del usuario solo si esta logueado
  if (authStore.isAuthenticated && authStore.idUser) {
    const startRange = today.startOf('month').toFormat("yyyy-MM-dd");
    const endRange = today.plus({ months: 1 }).endOf('month').toFormat("yyyy-MM-dd");
    
    await getUserAccesses(calendarGroup.value.idGroup, startRange, endRange);
  };

});

const getAccessLocks = async (idGroup) => {
  try {
    
    isLoading.value = true;
    const response = await apiGetAccessLocks(idGroup);

    locks.value = response.locks || [];
  } catch (err) {
    notify($q, t, err, "nok");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const getUserAccesses = async (idGroup,startDate, endDate) => {
  try {
    const response = await apiGetAccessUser(idGroup, startDate, endDate);
    userAccesses.value = response.accesses || [];
  } catch (err) {
    notify($q, t, err, "nok");
  }
};


const isDisabled = (cell) => {
  const cellDate = DateTime.fromISO(cell.date, { zone: 'Europe/Madrid' });
  const now = DateTime.local().startOf('day');

  if (cellDate < now || !cell.isCurrentMonth) return true;

  const selectedId = selectedResource.value?.idResource;

  // 🔒 Deshabilitar si está fuera de temporada
  const endSeason = selectedResource.value?.endSeason
    ? DateTime.fromISO(selectedResource.value.endSeason).endOf('day')
    : null;
  if (endSeason && cellDate > endSeason) return true;

  // Verifica bloqueos
  const isLocked = locks.value.some(lock => {
    const appliesToResource = lock.id_resource === null || lock.id_resource === selectedId;
    const appliesToGroup = lock.id_group === null || lock.id_group === calendarGroup.value.idGroup;
    if (!appliesToResource || !appliesToGroup) return false;

    if (Array.isArray(lock.days_week)) {
      const lockDays = lock.days_week.map(String);
      if (!lockDays.includes(cellDate.weekday.toString())) return false;
    }

    const startDate = DateTime.fromISO(lock.start_date).startOf('day');
    const endDate = DateTime.fromISO(lock.final_date).endOf('day');
    return cellDate >= startDate && cellDate <= endDate;
  });

  // Verifica si el usuario ya tiene acceso en ese día
  const hasUserAccess = userAccesses.value.some(access => {
    const start = DateTime.fromISO(access.startDate).startOf('day');
    const end = DateTime.fromISO(access.endDate).endOf('day');
    return cellDate >= start && cellDate <= end;
  });

  return isLocked || hasUserAccess;
};


const selectDate = (dateISO) => {
  selectedDate.value = dateISO;
};


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
};

const selectSlot = async (slot) => {
  try {
    
    //console.log("SelectslotMethod", slot, typeof slot);
    let startLuxon = DateTime.fromISO(`${selectedDate.value}T00:00`, { zone: 'Europe/Madrid' });

    if (slot.startsWith("season") || slot.startsWith("bonus")) {
      // Si el slot es de temporada, el inicio es el dia actual
      startLuxon = DateTime.local().startOf('day');
    }

    const { endDate, endDateString } = getAccessEndDate(
      startLuxon,
      slot,
      locks.value,
      selectedResource.value,
      calendarGroup.value,
      locale.value
    );

    // Obtenemos las tarifas de la reserva
    const dataTariffs = await apiGetAccessTariffs(selectedResource.value.idResource);
      //console.log("Tarifas obtenidas:", tariffs);
    const { tariffs } = dataTariffs;

    // Obtenemos todas las tarifas que coinciden con el tipo de acceso (slot)
    const slotTariffs = tariffs.filter(t => t.accessType === slot);

    selectedAccess.value = {
      idUser: authStore.idUser || 0,
      idResource: selectedResource.value.idResource,
      resource: selectedResource.value.resource,
      startDate: startLuxon.toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      startDateString: getDisplayString(startLuxon.toISODate(), locale.value),
      endDate,
      endDateString,
      accessType: slot,
      accessTypeGroup: selectedAccessTypeGroup.value,
      slotTariffs,
      locationUrl: selectedResource.value.locationUrl
    };
    showAccessDialog.value = true;
    //console.log(selectedAccess.value);

  } catch (err) {
    console.error(err);
    notify($q, t, err, "nok");
  }
};


// Función principal para calcular endDate y endDateString
function getAccessEndDate(startDateLuxon, alias, locks, selectedResource, calendarGroup, locale) {
  let endDateLuxon;
  const number = parseInt(alias.match(/\d+/)?.[0] || '1', 10);

  if (alias === "daily") {
    endDateLuxon = startDateLuxon;
  } else if (alias === "days" || alias.startsWith("days")) {
    endDateLuxon = addWorkingDays(startDateLuxon, number - 1, locks, selectedResource, calendarGroup);
  } else if (alias === "weekly") {
    endDateLuxon = startDateLuxon.plus({ days: 6 });
  } else if (alias === "weeks" || alias.startsWith("weeks")) {
    endDateLuxon = startDateLuxon.plus({ days: (number * 7) - 1 });
  } else if (alias === "monthly" || alias.startsWith("monthly")) {
    endDateLuxon = startDateLuxon.plus({ months: 1 }).minus({ days: 1 });
  } else if (alias === "months" || alias.startsWith("months")) {
    endDateLuxon = startDateLuxon.plus({ months: number }).minus({ days: 1 });
  } else if (alias === "annual") {
    endDateLuxon = startDateLuxon.plus({ years: 1 }).minus({ days: 1 });
  } else if (alias.startsWith("bonus")) {
    // Si existe endSeason, fecha final = endSeason
    // Si no, fecha final = startDate + 2 meses
    endDateLuxon = selectedResource.endSeason
      ? DateTime.fromISO(selectedResource.endSeason, { zone: 'Europe/Madrid' }).endOf('day')
      : startDateLuxon.plus({ months: 2 }).minus({ days: 1 });
  } else if (alias === "season" || alias.startsWith("season")) {
    // Si existe endSeason, fecha final = endSeason
    // Si no, fecha final = fin año actual
    endDateLuxon = selectedResource.endSeason
      ? DateTime.fromISO(selectedResource.endSeason, { zone: 'Europe/Madrid' }).endOf('day')
      : DateTime.now().setZone('Europe/Madrid').endOf('year');
  } else {
    endDateLuxon = startDateLuxon; // fallback
  }

  // ✅ Truncar con endSeason si es anterior
  const seasonLimit = selectedResource.endSeason
    ? DateTime.fromISO(selectedResource.endSeason, { zone: 'Europe/Madrid' }).endOf('day')
    : null;

  if (seasonLimit && seasonLimit < endDateLuxon) {
    endDateLuxon = seasonLimit;
  }

  return {
    endDate: endDateLuxon.toFormat("yyyy-MM-dd'T'HH:mm:ss"),
    endDateString: getDisplayString(endDateLuxon.toISODate(), locale),
  };
}


function addWorkingDays(startDate, daysToAdd, locks, selectedResource, calendarGroup) {
  let daysAdded = 0;
  let cursor = startDate;

  while (daysAdded < daysToAdd) {
    cursor = cursor.plus({ days: 1 });
    const weekday = cursor.weekday.toString();

    const isBlocked = locks.some(lock => {
      const appliesToResource = lock.id_resource === null || lock.id_resource === selectedResource.idResource;
      const appliesToGroup = lock.id_group === null || lock.id_group === calendarGroup.idGroup;
      if (!appliesToResource || !appliesToGroup) return false;

      const start = DateTime.fromISO(lock.start_date, { zone: 'Europe/Madrid' }).startOf('day');
      const end = DateTime.fromISO(lock.final_date, { zone: 'Europe/Madrid' }).endOf('day');
      if (cursor < start || cursor > end) return false;

      if (!lock.days_week || lock.days_week.map(String).includes(weekday)) return true;

      return false;
    });

    if (!isBlocked) {
      daysAdded++;
    }
  }

  return cursor;
}



const closeDialogs = () => {
  showAccessDialog.value = false;
  showFeesDialog.value = false;
  selectedAccess.value = {};
};

const today = DateTime.local();
const currentMonth = ref(today.startOf('month'));

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

const isPrevDisabled = computed(() => currentMonth.value <= today.startOf('month'));
const isNextDisabled = computed(() => currentMonth.value >= today.plus({ months: 1 }).startOf('month'));

const weekDays = computed(() => {
  const baseDate = DateTime.fromObject({ weekday: 1 });
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  return Array.from({ length: 7 }, (_, i) => baseDate.plus({ days: i }).setLocale(luxonLocale).toFormat('ccc'));
});

const calendarGrid = computed(() => {
  const start = currentMonth.value.startOf('week');
  const end = currentMonth.value.endOf('month').endOf('week');
  const days = [];
  let cursor = start;

  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = cursor.toISODate();
      const cellDate = cursor.startOf('day');

      const isLocked = locks.value.some(lock => {
        const appliesToResource = lock.id_resource === null || lock.id_resource === selectedResource.value?.idResource;
        const appliesToGroup = lock.id_group === null || lock.id_group === calendarGroup.value?.idGroup;
        if (!appliesToResource || !appliesToGroup) return false;

        if (Array.isArray(lock.days_week)) {
          const lockDays = lock.days_week.map(String);
          if (!lockDays.includes(cellDate.weekday.toString())) return false;
        }

        const start = DateTime.fromISO(lock.start_date).startOf('day');
        const end = DateTime.fromISO(lock.final_date).endOf('day');
        return cellDate >= start && cellDate <= end;
      });

      const isTodayOrFuture = cellDate.toISODate() >= today.toISODate();

      const isUserAccess = !isLocked && isTodayOrFuture && userAccesses.value.some(access => {
        const start = DateTime.fromISO(access.startDate).toISODate();
        const end = DateTime.fromISO(access.endDate).toISODate();
        const cell = cellDate.toISODate();
        return cell >= start && cell <= end;
      });


      week.push({
        day: cursor.day,
        isCurrentMonth: cursor.month === currentMonth.value.month,
        date,
        isUserAccess
      });

      cursor = cursor.plus({ days: 1 });
    }
    days.push(week);
  }

  return days;
});



const groupLabel = computed(() => {
  return calendarGroup.value?.group ? `${t('accesos')} ${t(calendarGroup.value.group)}` : '';
});

const groupImageUrl = computed(() => {
  return calendarGroup.value?.group ? `/img/${calendarGroup.value.group}.webp` : null;
});

const monthLabel = computed(() => {
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  const displayMonth = currentMonth.value.setLocale(luxonLocale).toFormat('MMMM yyyy');
  let displayString = displayMonth;
  if (luxonLocale !== "es") {
    displayString = displayMonth
      .replace(/^d['’]/i, "")
      .replace(/^de\s+/i, "")
      .trim();
    displayString = displayString.charAt(0).toUpperCase() + displayString.slice(1);
  }
  return displayString;
});

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
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

.legend-color.user-access{
  background-color: #daffe0;
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
  color: #e74b12
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

.calendar-cell.user-access {
  background-color: #daffe0;
  color: #1b4618;
  pointer-events: none;
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
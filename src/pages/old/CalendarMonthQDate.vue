<template>
  <q-page class="background-color">
    <!-- Cabecera con selector de recurso -->
    <div class="q-pa-md row justify-center items-center">
      <div class="q-mr-sm text-subtitle1">{{ $t("seleccionaRecurso") }}</div>
        <q-select
          v-model="selectedResource"
          :options="resources"
          option-label="resource"
          option-value="idResource"
          emit-value
          map-options
          dense
          outlined
          style="min-width: 200px"
          @update:model-value="resourceSelectorChanged"
        />
    </div>

    <!-- Navegación del mes -->
    <div class="calendar-header">
      <q-btn
        flat
        icon="chevron_left"
        @click="prevMonth"
        class="nav-button"
        :disable="isPrevDisabled"
      />
      <div class="month-label">{{ monthLabel }}</div>
      <q-btn
        flat
        icon="chevron_right"
        @click="nextMonth"
        class="nav-button"
        :disable="isNextDisabled"
      />
    </div>

    <!-- Tabla del calendario mensual -->
    <div class="calendar-wrapper">
      <table class="calendar-table">
        <thead>
          <tr>
            <th v-for="(day, index) in weekDays" :key="'day-' + index">{{ day }}</th>
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
                  'selected': cell.date === selectedDate,
                  'disabled': isDisabled(cell)
                }
              ]"
              @click="selectDate(cell.date)"
            >
              <div class="cell-content">{{ cell.day }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DateTime } from 'luxon';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const today = DateTime.local();
const currentMonth = ref(today.startOf('month'));
const selectedDate = ref();

const resources = ref([
  { idResource: 1, resource: 'Pista 1' },
  { idResource: 2, resource: 'Pista 2' }
]);

const selectedResource = ref(resources.value[0].idResource);

const weekDays = computed(() => {
  const baseDate = DateTime.fromObject({ weekday: 1 });
  const days = [];
  const luxonLocale = locale.value === "es-ES" ? "es" : "ca";
  for (let i = 0; i < 7; i++) {
    days.push(baseDate.plus({ days: i }).setLocale(luxonLocale).toFormat('ccc'));
  }
  return days;
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

const calendarGrid = computed(() => {
  const start = currentMonth.value.startOf('week');
  const end = currentMonth.value.endOf('month').endOf('week');
  const days = [];
  let cursor = start;
  while (cursor <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push({
        day: cursor.day,
        isCurrentMonth: cursor.month === currentMonth.value.month,
        date: cursor.toISODate(),
        raw: cursor
      });
      cursor = cursor.plus({ days: 1 });
    }
    days.push(week);
  }
  return days;
});


const isDisabled = (cell) => {
  const cellDate = DateTime.fromISO(cell.date);
  const now = today.startOf('day');
  const isPast = currentMonth.value.hasSame(now, 'month') && cellDate < now;
  return !cell.isCurrentMonth || isPast;
};

const isPrevDisabled = computed(() => {
  // Desactivar si el mes mostrado es igual o anterior al mes actual
  return currentMonth.value.hasSame(today, 'month') || currentMonth.value < today.startOf('month');
});

const isNextDisabled = computed(() => {
  const nextMonthLimit = today.plus({ months: 1 }).startOf('month');
  // Desactivar si el mes mostrado es igual o posterior al mes siguiente
  return currentMonth.value.hasSame(nextMonthLimit, 'month') || currentMonth.value > nextMonthLimit;
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
};

const resourceSelectorChanged = () => {
  console.log(selectedResource.value);
};
</script>

<style scoped>
.calendar-wrapper {
  max-width: 380px;
  margin: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 380px;
  margin: 0 auto 5px auto;
  background: white;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.month-label {
  font-weight: 500;
  font-size: 16px;
  text-transform: capitalize;
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
}

.calendar-cell {
  border-radius: 50%;
  color: #999;
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

.cell-content {
  height: 36px;
  width: 36px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
</style>
<template>
  <q-page class="q-pa-md">
    <q-table
      flat
      dense
      :rows="timeSlots"
      :columns="columns"
      row-key="hour"
      class="calendar-table"
    >
      <template v-slot:body-cell="props">
        <q-td
          :props="props"
          :class="getReservationClass(props.col.name, props.row.hour)"
          @click="handleClick(props.col.name, props.row.hour)"
          @mouseover="handleHover(props.col.name, props.row.hour, true)"
          @mouseout="handleHover(props.col.name, props.row.hour, false)"
        >
          <div>
            <template v-if="props.col.name === 'hour'">
              {{ props.row.hour }}
            </template>
            <template v-else>
              <q-icon
                v-if="getReservationClass(props.col.name, props.row.hour) === 'reserved'"
                name="event_busy"
                color="red"
                size="md"
              />
              <q-icon
                v-else-if="getReservationClass(props.col.name, props.row.hour) === 'user-reserved'"
                name="event_available"
                color="green"
                size="md"
              />
              <q-icon
                v-else
                name="event_note"
                size="md"
              />
              <span>{{ getReservationTitle(props.col.name, props.row.hour) }}</span>
            </template>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, parseISO, addDays, subDays } from 'date-fns';

// Configuración
const CURRENT_USER = 'Ian';
const TIME_SLOT_DURATION = 1;

// Día actual en UTC y formato dd/MM/yyyy
const currentDateUTC = ref(new Date().toISOString());

const currentDate = computed(() => {
  return format(parseISO(currentDateUTC.value), 'dd/MM/yyyy');
});

const resources = ref([
  { id: 'PADEL_1', name: 'PADEL 1' },
  { id: 'PADEL_2', name: 'PADEL 2' },
  { id: 'PADEL_3', name: 'PADEL 3' },
  { id: 'PADEL_4', name: 'PADEL 4' },
]);

const reservations = ref([
  {
    resourceId: 'PADEL_1',
    start: '2024-12-02T09:00:00Z',
    user: 'Pepe',
  },
  {
    resourceId: 'PADEL_2',
    start: '2024-12-02T12:00:00',
    user: 'Ian',
  },
  {
    resourceId: 'PADEL_3',
    start: '2024-12-03T09:00:00Z',
    user: 'Pepe',
  },
  {
    resourceId: 'PADEL_4',
    start: '2024-12-03T10:00:00',
    user: 'Ian',
  },
]);

// Generar intervalos de tiempo
const timeSlots = computed(() => {
  const slots = [];
  const start = 9; // 09:00
  const end = 22; // 22:00
  for (let hour = start; hour < end; hour++) {
    slots.push({ hour: `${hour.toString().padStart(2, '0')}:00` });
  }
  return slots;
});

// Configurar las columnas dinámicamente
const columns = computed(() => {
  return [
    { name: 'hour', label: 'Hora', align: 'left', field: 'hour' },
    ...resources.value.map((resource) => ({
      name: resource.id,
      label: resource.name,
      align: 'center',
      field: resource.id,
    })),
  ];
});

// Obtener estado del slot
const getSlotStatus = (resourceId, hourSlot) => {
  const dateSlotUtc = new Date(`${currentDateUTC.value.split('T')[0]}T${hourSlot}:00Z`);
  const endDateSlotUtc = new Date(dateSlotUtc.getTime() + TIME_SLOT_DURATION * 60 * 60 * 1000);

  const reservation = reservations.value.find(
    (res) =>
      res.resourceId === resourceId &&
      new Date(res.start) >= dateSlotUtc &&
      new Date(res.start) < endDateSlotUtc
  );

  if (reservation) {
    if (reservation.user === CURRENT_USER) {
      return { status: 'user-reserved', title: 'Reserva' };
    }
    return { status: 'reserved', title: 'Ocupado' };
  }

  return { status: 'available', title: '' };
};

// Obtener clase para celdas
const getReservationClass = (resourceId, hourSlot) => {
  return getSlotStatus(resourceId, hourSlot).status;
};

// Obtener título del evento
const getReservationTitle = (resourceId, hourSlot) => {
  return getSlotStatus(resourceId, hourSlot).title;
};

// Navegación entre días
const prevDay = () => {
  currentDateUTC.value = format(subDays(parseISO(currentDateUTC.value), 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

const nextDay = () => {
  currentDateUTC.value = format(addDays(parseISO(currentDateUTC.value), 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

// Manejar clics en celdas
const handleClick = (resourceId, hourSlot) => {
  const slot = getSlotStatus(resourceId, hourSlot);
  if (slot.status === 'available' || slot.status === 'user-reserved') {
    console.log(`Reserva para el recurso ${resourceId} en el slot ${hourSlot}`);
  }
};

// Hover (no se requiere manipulación directa en este ejemplo)
const handleHover = () => {};
</script>

<style scoped>
.calendar-table {
  max-width: 100%;
}

.user-reserved {
  background-color: #ccffcc;
}

.reserved {
  background-color: #ffcccc;
}

.available {
  background-color: #ffffff;
  cursor: pointer;
}
</style>

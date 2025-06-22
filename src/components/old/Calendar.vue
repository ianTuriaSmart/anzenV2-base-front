<template>
  <div class="calendar-container">
    <div class="header">
      <button @click="prevDay">←</button>
      <span>{{ currentDate }}</span>
      <button @click="nextDay">→</button>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
          <!-- <th>HORA</th> -->
          <th v-for="resource in resources" :key="resource.id">{{ resource.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hour in timeSlots" :key="hour">
          <!-- <td>{{ hour }}</td> -->
          <td
            v-for="resource in resources"
            :key="resource.id"
            :class="getReservationClass(resource.id, hour)"
            @click="handleClick(resource.id, hour)"
            @mouseover="handleHover(resource.id, hour, true)"
            @mouseout="handleHover(resource.id, hour, false)"
            :style="{ cursor: getCursorStyle(resource.id, hour) }"
          >
            <div>{{ hour }}</div>
            <span>{{ getReservationTitle(resource.id, hour) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { format, parseISO, addDays, subDays } from 'date-fns';


// Configuración
const CURRENT_USER = 'Ian';
const TIME_SLOT_DURATION = 1;

// Constante reactiva con el día actual en UTC y formato dd/MM/yyyy
const currentDateUTC = ref(new Date().toISOString());

const currentDate = computed(() => {
  return format(parseISO(currentDateUTC.value), 'dd/MM/yyyy')
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

// Generar slots horarios (09:00 - 22:00)
const timeSlots = computed(() => {
  const slots = [];
  const start = 9; // 09:00
  const end = 22; // 22:00
  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
});


// Función para obtener el estado de un Slot (Ocupado/Disponible/Reservado por el usuario actual)
const getSlotStatus = (resourceId, hourSlot) => {
  // En hourSlot nos llega por ejemplo las 09:00 en formato local

  // Generamos la fecha completa del slot en UTC
  const dateSlotUtc = new Date(`${currentDateUTC.value.split('T')[0]}T${hourSlot}:00Z`);
  const endDateSlotUtc = new Date(dateSlotUtc.getTime() + TIME_SLOT_DURATION * 60 * 60 * 1000);

  // Buscamos si hay una reserva en el slot
  const reservation = reservations.value.find(
    (res) =>
      res.resourceId === resourceId &&
      new Date(res.start) >= dateSlotUtc &&
      new Date(res.start) < endDateSlotUtc
  );

  if (reservation) {
    // Existe una reserva en el slot
    if (reservation.user === CURRENT_USER) {
      return {status: 'user-reserved', title: 'Reserva', icon: 'person'};
    }
    return { status: 'reserved', title: 'Ocupado', icon: 'reserved' }
  }

  return {status: 'available', title: ''};  
}

// Obtener clase para celdas reservadas
const getReservationClass = (resourceId, hourSlot) => {
  return getSlotStatus(resourceId, hourSlot).status;
};

// Obtener título del evento
const getReservationTitle = (resourceId, hourSlot) => {
  return getSlotStatus(resourceId, hourSlot).title;
};

// Navegación (simplificada)
const prevDay = () => {
  if (!isFirstDay.value) {
    currentDateUTC.value = format(subDays(parseISO(currentDateUTC.value), 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  }
};

const nextDay = () => {
  console.log('Ir al día siguiente');
  currentDateUTC.value = format(addDays(parseISO(currentDateUTC.value), 1), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

// Función que gestióna el click en una celda
const handleClick = (resourceId, hourSlot) => {
  const slotStatus = getSlotStatus(resourceId, hourSlot).status;
  if (slotStatus === 'available' || slot.status === 'user-reserved') {
    console.log(`Reserva para el recurso ${resourceId} en el slot ${hourSlot}`);
  }
};

// Funciones que gestionan el hover
const handleHover = (resourceId, hourSlot, isHovered) => {
  const slotStatus = getSlotStatus(resourceId, hourSlot).status;
  if (slotStatus === 'available') {
    const cell = document.querySelector(`[data-resource-id="${resourceId}"][data-hour-slot="${hourSlot}"]`);
  }
  if (cell) {
    cell.textContent = isHovered ? 'Reservar' : '';
    cell.style.backgroundColor = isHovered ? '#e0e0e0' : '#fff';
  }
}


const jumpToDay = (day) => {
  currentDateUTC.value = day;
};

// Función que gestiona el puntero del ratón
const getCursorStyle = (resourceId, hourSlot) => {
  const slotStatus = getSlotStatus(resourceId, hourSlot).status;
  return slotStatus === 'available' || slotStatus === 'user-reserved' ? 'pointer' : 'default';
}

const getSlotIcon = (resourceId, hourSlot) => getSlotStatus(resourceId, hourSlot).icon;

</script>


<style scoped>
.calendar-table td {
  user-select: none;
}

.calendar-container {
  width: 100%;
  margin: 20px auto;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
}

.calendar-table th,
.calendar-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 10px;
}

.calendar-table th {
  background-color: #f4f4f4;
}

.reserved {
  background-color: #ffcccc;
}

.available {
  background-color: #ffffff;
}

.user-reserved {
  background-color: #ccffcc;
}

.available:hover {
  background-color: #e0e0e0;
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hover-content {
  display: none;
}

</style>
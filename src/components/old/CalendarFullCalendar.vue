<template>
  <div>
    <FullCalendar
      :options="calendarOptions"
    />

  </div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';


const events = [
  {
    title: 'Pádel 1 reservado',
    start: '2024-12-01T10:00:00',
    end: '2024-12-01T11:00:00',
    backgroundColor: '#ff0000',
  },
  {
    title: 'Pádel 2 reservado',
    start: '2024-12-01T12:00:00',
    end: '2024-12-01T13:00:00',
    backgroundColor: '#00ff00',
  },
];

const calendarOptions = {
  locale: esLocale,
  plugins: [dayGridPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  events: events,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,dayGridMonth',
  },
};


</script>

<style lang="scss" scoped>

</style>
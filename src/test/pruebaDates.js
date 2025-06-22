const { format } = require("date-fns");

// Obtener objeto fecha del día actual
const dateToday = new Date();
console.log(dateToday, typeof(dateToday));

// Creamos un string con formato DD/MM/YYYY
const stringToday = dateToday.toLocaleDateString();
console.log(stringToday, typeof (stringToday));

// Creamos un string en formato ISO 2024-12-05T08:50:59.245Z (UTC)
const stringTodayUTC = dateToday.toISOString();
console.log(stringTodayUTC, typeof(stringTodayUTC));

// 1.Pasar el date actual en formato local a string con formato DD/MM/YYYY
const formattedDay = format(new Date(), "dd/MM/yyyy");
console.log(formattedDay, typeof(formattedDay));


// 2. Construir a partir del string formattedDay el objeto date en formato local y UTC
  const year = formattedDay.slice(-4);
  const month = formattedDay.slice(3, 5);
  const day = formattedDay.slice(0, 2);

// Construimos la fecha en formato local
const dateLocal = new Date(year, month - 1, day, 15, 30, 20);
console.log(dateLocal, typeof(dateLocal));

// Construimos la fecha en formato UTC
const dateUtc = new Date(
  Date.UTC(
    dateLocal.getUTCFullYear(),
    dateLocal.getUTCMonth(),
    dateLocal.getUTCDate(),
    dateLocal.getUTCHours(),
    dateLocal.getUTCMinutes(),
    dateLocal.getUTCSeconds()
  )
);

console.log(dateUtc, typeof (dateUtc));

// Obtener el nombre del día de la semana
const dayTest = new Date('2024-12-08T09:00:00Z')
//const dayOfWeek = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
const dayOfWeek = dayTest.toLocaleDateString('es-ES', { weekday: 'long' });
console.log(dayOfWeek, typeof (dayOfWeek));

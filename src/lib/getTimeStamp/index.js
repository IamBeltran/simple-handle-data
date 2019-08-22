//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY-MODULES DEPENDENCY.                                            │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS-MODULE DEPENDENCIES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY-MODULES DEPENDENCIES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const strings = [
  // * 0 Numbers 01 To 60
  '00_01_02_03_04_05_06_07_08_09_10_' +
    '11_12_13_14_15_16_17_18_19_20_' +
    '21_22_23_24_25_26_27_28_29_30_' +
    '31_32_33_34_35_36_37_38_39_40_' +
    '41_42_43_44_45_46_47_48_49_50_' +
    '51_52_53_54_55_56_57_58_59_60',
  // * 1 Months
  'Enero_Febrero_Marzo_Abril_Mayo_' +
    'Junio_Julio_Agosto_Septiembre_' +
    'Octubre_Noviembre_Diciembre',
  // * 2 Week Days
  'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado',
  // * 3 Months Short
  'Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.',
  // * 4 Week Days Short
  'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.',
  // * 5 Week Days Short
  'a.m._p.m.',
];

const strNumbers = Array.from(strings[0].split('_'));
// const months = Array.from(strings[1].split('_'));
// const weekDays = Array.from(strings[2].split('_'));
// const monthsShort = Array.from(strings[3].split('_'));
// const weekDaysShort = Array.from(strings[4].split('_'));
// const ampm = Array.from(strings[5].split('_'));

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MODULE - GET TIMESTAMP.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

/**
 *
 * @name          getDateInArray
 * @description   Function to generate an array with parts of a the Date
 * @param         {Date} [dateForArray=new Date(Date.now())] - Date for save in array
 * @returns       {number[]} dateInArray - Array with parts of a the Date
 */
function getDateInArray(dateForArray = new Date(Date.now())) {
  if (!(dateForArray instanceof Date)) {
    throw new Error('The input value is not a Date');
  }
  const date = dateForArray;
  const dateInArray = [];

  dateInArray.push(date.getFullYear()); //      0 - (yyyy)
  dateInArray.push(date.getMonth()); //         1 - (0-11)
  dateInArray.push(date.getDate()); //          2 - (1-31)
  dateInArray.push(date.getHours()); //         3 - (0-23)
  dateInArray.push(date.getMinutes()); //       4 - (0-59)
  dateInArray.push(date.getSeconds()); //       5 - (0-59)
  dateInArray.push(date.getMilliseconds()); //  6 - (0-999)
  dateInArray.push(date.getDay()); //           7 - (0-6)
  dateInArray.push(date.getTime()); //          8 - Milliseconds since January 1, 1970
  return dateInArray;
}

/**
 *
 * @name          getStrMilliSecond
 * @description   Function to generate an array with parts of a the Date
 * @param         {number} numMilliSecond - Date for save in array
 * @returns       {string} dateInArray - Array with parts of a the Date
 */
function getStrMilliSecond(numMilliSecond) {
  let strMilliSeconds;
  if (numMilliSecond >= 100) {
    strMilliSeconds = `${numMilliSecond}`;
  } else if (numMilliSecond >= 10 && numMilliSecond < 100) {
    strMilliSeconds = `0${numMilliSecond}`;
  } else {
    strMilliSeconds = `00${numMilliSecond}`;
  }
  return strMilliSeconds;
}

/**
 *
 * @name          getTimeStamp
 * @param         {number} option - Option of Format timestamp
 * @description   Function to generate timestamp
 * @returns       {string} timeStamp - String with a timestamp
 */
function getTimeStamp(option) {
  const dateInArray = getDateInArray();
  const formats = [
    '{year}{month}{DayOfMonth}.{hour}.{minute}.{second}.{millisecond}',
    '{year}.{month}.{DayOfMonth}.{hour}.{minute}.{second}.{millisecond}',
    '{year}{month}{DayOfMonth}T{hour}{minute}{second}{millisecond}',
  ];
  const format = formats[option] || formats[0];
  const [
    numYear,
    numMonth,
    numDayOfMonth,
    numHour,
    numMinute,
    numSecond,
    numMilliSeconds,
  ] = dateInArray;
  const strYear = `${numYear}`;
  const strMonth = strNumbers[numMonth + 1];
  const strDayOfMonth = strNumbers[numDayOfMonth];
  const strHour = strNumbers[numHour];
  const strMinute = strNumbers[numMinute];
  const strSecond = strNumbers[numSecond];
  const strMilliSecond = getStrMilliSecond(numMilliSeconds);
  const timeStamp = format
    .replace(/\{year}/gi, strYear)
    .replace(/\{month}/gi, strMonth)
    .replace(/\{DayOfMonth}/gi, strDayOfMonth)
    .replace(/\{hour}/gi, strHour)
    .replace(/\{minute}/gi, strMinute)
    .replace(/\{second}/gi, strSecond)
    .replace(/\{milliSecond}/gi, strMilliSecond);
  return timeStamp;
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
export default getTimeStamp;

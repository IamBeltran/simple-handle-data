//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const notifier = require('node-notifier');
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const path = require('path');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ PATH OF MY DEPENDENCIES MODULES AND FILE.                                         │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const notificationIconPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'assets',
  'icons',
  '512x512.png',
);

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
/**
 *
 * @name          sendNotification
 * @description   Function that show a native notification on macOS, Windows and Linux
 * @param         {Object} options - Options of notification
 * @param         {string} options.title - Title of notification
 * @param         {string} options.message - Message of notification
 * @param         {('info'|'warn'|'error')} options.type - Type of notificationtitle info | warn | error
 * @returns       {Void} - Launch a notification
 */
function sendNotification({ title, message, type }) {
  const types = ['info', 'warn', 'error'];
  const isCorrectType = types.includes(type);
  notifier.notify({
    title,
    message,
    icon: notificationIconPath,
    sound: true,
    wait: true,
    type: isCorrectType ? type : 'info',
  });
}

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
module.exports = sendNotification;

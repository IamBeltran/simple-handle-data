//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const path = require('path');
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const icons = {
  x01: '16x16.png',
  x02: '24x24.png',
  x03: '32x32.png',
  x04: '48x48.png',
  x05: '64x64.png',
  x06: '96x96.png',
  x07: '128x128.png',
  x08: '256x256.png',
  x09: '512x512.png',
  x10: '1024x1024.png',
  icon: 'icon.ico',
};

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
/**
 *
 * @name          getIcons
 * @description   Function that return a icon path
 * @param         {('x01'|'x02'|'x03'|'x04'|'x05'|'x06'|'x07'|'x08'|'x09'|'x10'|'icon')} name - Type of notificationtitle info | warn | error
 * @returns       {string} - Path of icon
 */
const getIcons = name => path.join(__dirname, '..', '..', 'assets', 'icons', icons[`${name}`]);

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const getAssets = (module.exports = exports = {}); // eslint-disable-line no-multi-assign

// » Main Modules
getAssets.getIcons = getIcons;

/* eslint-disable import/no-extraneous-dependencies */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE ELECTRON DEPENDENCIES MODULES.                                            │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const electron = require('electron');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const path = require('path');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const helpers = require('../helpers');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const { app } = electron;
const {
  getAssets: { getIcons },
} = helpers;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const APP_VERSION = '1.2.2';
const APP_NAME = 'Simple Handle Data';
const APP_TEAM = 'BRSoft, LLC';
const APP_COPYRIGHT = 'Copyright © 2014-2020 BRSoft, LLC';
const USER_DATA_PATH = path.join(app.getPath('appData'), APP_NAME);
const APP_ICON_FILE_X01 = getIcons('x01');
const APP_ICON_FILE_X02 = getIcons('x02');
const APP_ICON_FILE_X03 = getIcons('x03');
const APP_ICON_FILE_X04 = getIcons('x04');
const APP_ICON_FILE_X05 = getIcons('x05');
const APP_ICON_FILE_X06 = getIcons('x06');
const APP_ICON_FILE_X07 = getIcons('x07');
const APP_ICON_FILE_X08 = getIcons('x08');
const APP_ICON_FILE_X09 = getIcons('x09');
const APP_ICON_FILE_X10 = getIcons('x10');
const APP_ICON = getIcons('icon');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const configurations = {
  APP_VERSION,
  APP_NAME,
  APP_TEAM,
  APP_COPYRIGHT,
  USER_DATA_PATH,
  APP_ICON_FILE_X01,
  APP_ICON_FILE_X02,
  APP_ICON_FILE_X03,
  APP_ICON_FILE_X04,
  APP_ICON_FILE_X05,
  APP_ICON_FILE_X06,
  APP_ICON_FILE_X07,
  APP_ICON_FILE_X08,
  APP_ICON_FILE_X09,
  APP_ICON_FILE_X10,
  APP_ICON,
};

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
module.exports = configurations;

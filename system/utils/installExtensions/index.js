/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  default: installExtension,
  APOLLO_DEVELOPER_TOOLS,
  REACT_DEVELOPER_TOOLS,
  REACT_PERF,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE ELECTRON DEPENDENCIES MODULES.                                            │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const helpers = require('../../helpers');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  loggers: { loggerInfo, loggerError },
} = helpers;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const installerPromisify = extension => {
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  return new Promise((resolve, reject) => {
    installExtension(extension, forceDownload)
      .then(name => resolve(`Added Extension: ${name}`))
      .catch(err =>
        reject(new Error(`Error installing ${extension.id} extension: ${err.message}`)),
      );
  });
};

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ SET MAIN MODULE - [NAME-MODULE].                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const installExtensions = async () => {
  try {
    loggerInfo('Installing developer tool');
    require('devtron').install();
    await installerPromisify(APOLLO_DEVELOPER_TOOLS).then(success => loggerInfo(success));
    await installerPromisify(REACT_DEVELOPER_TOOLS).then(success => loggerInfo(success));
    await installerPromisify(REACT_PERF).then(success => loggerInfo(success));
    await installerPromisify(REDUX_DEVTOOLS).then(success => loggerInfo(success));
  } catch (error) {
    loggerError(error);
  }
};

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
module.exports = installExtensions;

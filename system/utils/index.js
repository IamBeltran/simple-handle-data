//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE UTILS MODULES.                                                            │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const createTray = require('./createTray');
const installExtensions = require('./installExtensions');
const sendNotification = require('./sendNotification');

//  ──[ EXPORT MODULE ]──────────────────────────────────────────────────────────────────
const utils = (module.exports = exports = {}); // eslint-disable-line no-multi-assign

// » Main Modules
utils.createTray = createTray;
utils.installExtensions = installExtensions;
utils.sendNotification = sendNotification;

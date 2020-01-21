/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const isDevelopment = require('electron-is-dev');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const path = require('path');
const url = require('url');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE CONFIGURATIONS APP.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// » Configurations are required before all other modules
// » to assign USER_DATA_PATH to the userData variable
const configurationsPath = path.join(__dirname, '..', 'system', 'configurations');
const { USER_DATA_PATH, APP_ICON } = require(configurationsPath);

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE ELECTRON DEPENDENCIES MODULES.                                            │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const { app, BrowserWindow, ipcMain } = require('electron');

app.setPath('userData', USER_DATA_PATH);

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ PATH OF FILES.                                                                    │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const webcontextPath = path.join(__dirname, '..', 'system', 'node-integration.js');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ PATH MY DEPENDENCIES MODULES.                                                     │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const helpersPath = path.join(__dirname, '..', 'system', 'helpers');
const utilsPath = path.join(__dirname, '..', 'system', 'utils');
const handleFirebasePath = path.join(__dirname, '..', 'system', 'handlers', 'handleFirebase');
const handleWorkbookPath = path.join(__dirname, '..', 'system', 'handlers', 'handleWorkbook');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const helpers = require(helpersPath);
const utils = require(utilsPath);
const handleFirebase = require(handleFirebasePath);
const handleWorkbook = require(handleWorkbookPath);

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const {
  loggers: { loggerInfo, loggerWithLabel },
} = helpers;
const { createTray, installExtensions, sendNotification } = utils;
const { doSignInWithEmailAndPassword, doSignOut } = handleFirebase;
const { sheetToJSON, createWorkbook } = handleWorkbook;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

// SECTION: WORSPACE FOR DEVELOPMENT
if (isDevelopment) {
  // Enable live reload for Electron too
  const electronPath = path.resolve(__dirname, '..', 'node_modules/electron');
  require('electron-reload')(__dirname, {
    electron: require(electronPath),
  });
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
}
// !SECTION

// SECTION: WORSPACE FOR PRODUCTION

// !SECTION

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// » html file for mainWindow
const startUrl = isDevelopment
  ? 'http://localhost:3000'
  : url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF AUXILIARY FUNCTIONS.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
function createWindow() {
  // SECTION: mainWindow
  // » Create the browser window (mainWindow)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    show: false,
    icon: APP_ICON,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: webcontextPath,
    },
  });

  // » And load the index.html of the app.
  mainWindow.loadURL(startUrl);

  if (!isDevelopment) {
    mainWindow.removeMenu();
  }

  mainWindow.webContents.once('dom-ready', () => {
    if (isDevelopment) {
      installExtensions();
      mainWindow.webContents.openDevTools();
    }
  });

  // » Emitted when the web page has been rendered (while not being shown)
  // » and window can be displayed without a visual flash.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // » Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  // !SECTION
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ LOGGIN PATH OF APP                                                                │
//  └───────────────────────────────────────────────────────────────────────────────────┘
if (isDevelopment) {
  loggerInfo('Starting electron application');
  loggerWithLabel('      Home', app.getPath('home'));
  loggerWithLabel('  App Data', app.getPath('appData'));
  loggerWithLabel(' User Data', app.getPath('userData'));
  loggerWithLabel('     Cache', app.getPath('cache'));
  loggerWithLabel('      Temp', app.getPath('temp'));
  loggerWithLabel('       Exe', app.getPath('exe'));
  loggerWithLabel('    Module', app.getPath('module'));
  loggerWithLabel('   Desktop', app.getPath('desktop'));
  loggerWithLabel(' Documents', app.getPath('documents'));
  loggerWithLabel(' Downloads', app.getPath('downloads'));
  loggerWithLabel('     Music', app.getPath('music'));
  loggerWithLabel('  Pictures', app.getPath('pictures'));
  loggerWithLabel('    Videos', app.getPath('videos'));
  loggerWithLabel('      Logs', app.getPath('logs'));
  loggerWithLabel('  App Path', app.getAppPath());
  // loggerWithLabel('FlashSystem', app.getPath('pepperFlashSystemPlugin'));
}

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ APPLICATION'S EVENT LISTENERS                                                     │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
// » Emitted when Electron has finished initializing.
app.on('ready', () => {
  loggerInfo('APP ON READY');
  createWindow();
  createTray();
});

// » Emitted when all windows have been closed.
app.on('window-all-closed', () => {
  // Quit when all windows are closed.
  if (process.platform !== 'darwin') app.quit();
});

// »  Emitted when the application is activated.
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  loggerInfo('APP ON ACTIVATE');
  if (mainWindow === null) {
    createWindow();
    createTray();
  }
});

// »  Emitted before the application starts closing its windows..
app.on('before-quit', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  loggerInfo('APP IS CLOSING');
});

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ IPC'S EVENT LISTENERS (Inter-Process Communication)                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// » SEND-INFO-NOTIFICATION
ipcMain.on('send-info-notification', (event, notification) => {
  sendNotification({
    title: notification.title,
    message: notification.message,
    type: 'info',
  });
});

// » SEND-WARN-NOTIFICATION
ipcMain.on('send-warn-notification', (event, notification) => {
  sendNotification({
    title: notification.title,
    message: notification.message,
    type: 'warn',
  });
});

// » SEND-ERROR-NOTIFICATION
ipcMain.on('send-error-notification', (event, notification) => {
  sendNotification({
    title: notification.title,
    message: notification.message,
    type: 'error',
  });
});

// » LOGIN-SEND
ipcMain.on('login-send', async (event, { email, password }) => {
  await doSignInWithEmailAndPassword(email, password)
    .then(user => {
      event.reply('login-reply-success', user);
    })
    .catch(error => {
      event.reply('login-reply-error', error);
    });
});

// » LOGOUT-SEND
ipcMain.on('logout-send', async (event, { email, password }) => {
  await doSignOut(email, password)
    .then(() => {
      event.reply('logout-reply-success', null);
    })
    .catch(error => {
      event.reply('logout-reply-error', error);
    });
});

// » SHEET-TO-JSON
ipcMain.on('sheet-to-json', async (event, { workbook, collection }) => {
  sheetToJSON(workbook, collection)
    .then(result => {
      event.reply('sheet-to-json-reply-success', result);
    })
    .catch(err => {
      const { message } = err;
      event.reply('sheet-to-json-reply-error', message);
    });
});

// » CREATE-WORKBOOK
ipcMain.on('create-workbook', async (event, { data, collection, type }) => {
  await createWorkbook(data, { collection, data: type })
    .then(result => {
      const { workbook, filename } = result;
      event.reply('create-workbook-reply-success', { workbook, filename });
    })
    .catch(err => {
      const { message } = err;
      event.reply('create-workbook-reply-error', message);
    });
});

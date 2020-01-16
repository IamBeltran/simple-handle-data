/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE THIRDPARTY DEPENDENCIES MODULES.                                          │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const electron = require('electron');
const notifier = require('node-notifier');
const isDev = require('electron-is-dev');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE NODEJS DEPENDENCIES MODULE.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const path = require('path');
const url = require('url');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ PATH OF FILES.                                                                    │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const webcontextPath = path.join(__dirname, '..', 'system', 'node-integration.js');
const appIconPath = path.join(__dirname, '..', 'assets', 'icons', 'icon.ico');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ PATH MY DEPENDENCIES MODULES.                                                     │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const handleFirebasePath = path.join(__dirname, '..', 'system', 'helpers', 'handleFirebase');
const handleWorkbookPath = path.join(__dirname, '..', 'system', 'helpers', 'handleWorkbook');

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ REQUIRE MY DEPENDENCIES MODULES.                                                  │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const handleFirebase = require(handleFirebasePath);
const handleWorkbook = require(handleWorkbookPath);

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DESTRUCTURING DEPENDENCIES.                                                       │
//  └───────────────────────────────────────────────────────────────────────────────────┘
const { app, BrowserWindow, ipcMain, Menu, Tray } = electron;
const { doSignInWithEmailAndPassword, doSignOut } = handleFirebase;
const { sheetToJSON, createWorkbook } = handleWorkbook;

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ DECLARATION OF CONSTANTS-VARIABLES.                                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘

// SECTION: WORSPACE FOR DEVELOPMENT
if (isDev) {
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

let appIcon = null;

const startUrl = isDev
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
    icon: appIconPath,
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: webcontextPath,
    },
  });
  // » And load the index.html of the app.
  mainWindow.loadURL(startUrl);

  if (!isDev) {
    mainWindow.removeMenu();
  }

  if (isDev) {
    mainWindow.webContents.once('dom-ready', () => {
      require('devtron').install();
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      mainWindow.webContents.openDevTools();
    });
  }

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
//  │ APPLICATION'S EVENT LISTENERS                                                     │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow);
// » Emitted when Electron has finished initializing.
app.on('ready', () => {
  createWindow();
  appIcon = new Tray(appIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Cerrar',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);
  appIcon.setToolTip('Simple Handle Data');
  appIcon.setContextMenu(contextMenu);
});

// » Emitted when all windows have been closed.
app.on('window-all-closed', () => {
  // Quit when all windows are closed.
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

//  ┌───────────────────────────────────────────────────────────────────────────────────┐
//  │ IPC'S EVENT LISTENERS (Inter-Process Communication)                               │
//  └───────────────────────────────────────────────────────────────────────────────────┘
// » SEND-NOTIFICATION
ipcMain.on('send-notification', (event, notification) => {
  notifier.notify({
    title: notification.title,
    message: notification.message,
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

console.log(app.getPath('userData'));

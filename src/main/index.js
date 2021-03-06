// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from 'electron';
const unhandled = require('electron-unhandled');
const fse = require('fs-extra');
unhandled();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line no-underscore-dangle
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

function createWindow() {
    /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000,
        webPreferences: {
            webSecurity: process.env.NODE_ENV !== 'development',
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL(winURL);
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.allowRendererProcessReuse = false;
app.userAgentFallback = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

let openedFile = null;

if (process.platform === 'win32' && process.argv.length >= 2) {
    // eslint-disable-next-line prefer-destructuring
    openedFile = fse.pathExistsSync(process.argv[1]) ? process.argv[1] : null;
}

// Attempt to bind file opening
app.on('will-finish-launching', () => {
    // Event fired When someone drags files onto the icon while your app is running
    app.on('open-file', (event, file) => {
        if (app.isReady() === false) {
            openedFile = file;
        } else {
            mainWindow.send('file-opened', file);
        }
        event.preventDefault();
    });
});

app.on('ready', () => {
    createWindow();
});

ipcMain.on('get-opened-file', (event) => {
    event.returnValue = openedFile;
});

ipcMain.on('logout', () => {
    mainWindow.webContents.session.clearStorageData();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

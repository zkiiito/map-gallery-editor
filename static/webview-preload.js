const { ipcRenderer } = require('electron');
const SettingsStore = require('electron-store');
const settingsStore = new SettingsStore();

global.sendError = (err) => {
    ipcRenderer.sendToHost(err);
};

global.googleMapsApiKey = settingsStore.get('googleMapsApiKey', null);
global.loadGoogleMapsApi = require('load-google-maps-api');
global.loadJS = require('load-js');

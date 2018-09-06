const { ipcRenderer } = require('electron');

global.sendError = (err) => {
    ipcRenderer.sendToHost(err);
};

global.googleMapsApiKey = 'AIzaSyBxibPU_2mMsI8c5o0wVeG6uBnxps0c6wE';
global.loadGoogleMapsApi = require('load-google-maps-api');
global.loadJS = require('load-js');

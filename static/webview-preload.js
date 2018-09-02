const { ipcRenderer } = require('electron');

global.sendError = (err) => {
    ipcRenderer.sendToHost(err);
};

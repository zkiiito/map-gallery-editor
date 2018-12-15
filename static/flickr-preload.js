const { ipcRenderer } = require('electron');

global.send = (token) => {
    ipcRenderer.sendToHost(token);
};

const { ipcRenderer } = require('electron');

global.sendToken = (token) => {
    ipcRenderer.sendToHost(token);
};

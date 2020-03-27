// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import ImageProcessor from 'EnvServices/ImageProcessor';
import ProjectHandler from 'EnvServices/ProjectHandler';
import store from '@/store';
import EventBus from '@/services/EventBus';
import BaseController from '@/services/env/BaseController';
import AppServer from '@/services/AppServer';
import GooglePhotosServer from '@/services/GooglePhotosServer';

const { dialog, shell } = remote;

const Controller = Object.assign(BaseController, {
    openProject() {
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
            }).then((result) => {
                if (result.filePaths.length === 1) {
                    Controller.openProjectFile(result.filePaths[0]);
                    return resolve();
                }
                return reject();
            });
        });
    },
    saveProjectAs() {
        dialog.showSaveDialog({
            filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
        }).then((result) => {
            if (result.filePath) {
                // force id regeneration
                store.commit('setId', false);
                store.commit('setFilename', result.filePath);
                Controller.saveProject();
            }
        });
    },
    addImagesFromDevice() {
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [{ name: 'Images', extensions: ['jpg', 'JPG', 'jpeg', 'JPEG'] }],
            }).then((result) => {
                if (result.filePaths.length > 0) {
                    ImageProcessor.processNewImages(result.filePaths).then((slides) => {
                        store.commit('addSlides', slides);
                        return resolve();
                    }).catch((err) => {
                        EventBus.$emit('error', err);
                        reject(err);
                    });
                }
            });
        });
    },
    exportProject() {
        dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }).then((result) => {
            if (result.filePaths.length === 1) {
                ProjectHandler.exportProject(result.filePaths[0])
                    .then((url) => {
                        shell.openExternal(url);
                    })
                    .catch((err) => {
                        EventBus.$emit('error', err);
                    });
            }
        });
    },
    publish() {
        ProjectHandler.publishProject()
            .then((url) => {
                shell.openExternal(url);
            })
            .catch((err) => {
                EventBus.$emit('error', err);
            });
    },
    login() {
        store.commit('openPopup', 'auth');
    },
    logout() {
        AppServer.logout().then(() => {
            store.commit('setFlickrUser', null);
            ipcRenderer.send('logout');
        });
    },
    init() {
        const fileName = ipcRenderer.sendSync('get-opened-file');
        if (fileName === null) {
            this.openSplash();
        } else {
            this.openProjectFromOS(fileName);
        }
    },
    openProjectFromOS(fileName) {
        store.commit('setSplashMode', false);
        store.commit('closePopups');
        this.openProjectFile(fileName);
    },
    openGooglePhotos() {
        if (GooglePhotosServer.authReady()) {
            store.commit('openPopup', 'googlePhotos');
        } else {
            store.commit('openPopup', 'authPhotos');
        }
    },
});

ipcRenderer.on('file-opened', Controller.openProjectFromOS);

export default Controller;

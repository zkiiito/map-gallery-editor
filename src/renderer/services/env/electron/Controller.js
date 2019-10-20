// eslint-disable-next-line import/no-extraneous-dependencies
import { remote, ipcRenderer } from 'electron';
import ImageProcessor from 'EnvServices/ImageProcessor';
import ProjectHandler from 'EnvServices/ProjectHandler';
import store from '@/store';
import EventBus from '@/services/EventBus';
import BaseController from '@/services/env/BaseController';

const { dialog, shell } = remote;

const Controller = Object.assign(BaseController, {
    openProject() {
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
            }, (filename) => {
                if (filename) {
                    Controller.openProjectFile(filename.toString());
                    return resolve();
                }
                return reject();
            });
        });
    },
    saveProjectAs() {
        dialog.showSaveDialog({
            filters: [{ name: 'MapGallery Editor files', extensions: ['mapgallery'] }],
        }, (fileName) => {
            if (fileName) {
                // force id regeneration
                store.commit('setId', false);
                store.commit('setFilename', fileName.toString());
                Controller.saveProject();
            }
        });
    },
    addImages(prevSlide) {
        return new Promise((resolve, reject) => {
            dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [{ name: 'Images', extensions: ['jpg', 'JPG', 'jpeg', 'JPEG'] }],
            }, (files) => {
                if (files) {
                    ImageProcessor.processNewImages(files).then((slides) => {
                        if (prevSlide) {
                            store.commit('addSlidesAfter', {
                                slide: prevSlide,
                                slides,
                            });
                        } else {
                            store.commit('addSlides', slides);
                        }
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
        dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, (dir) => {
            if (dir) {
                ProjectHandler.exportProject(dir.toString())
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
});

ipcRenderer.on('file-opened', Controller.openProjectFromOS);

export default Controller;

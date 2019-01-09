import store from '../store';
import EventBus from './EventBus';
import AppServer from './AppServer';
import ImageProcessor from './ImageProcessor';
import ProjectHandler from './ProjectHandler';

const { dialog, shell } = require('electron').remote; // eslint-disable-line
const uuidv4 = require('uuid/v4');

const Controller = {
    newProject() {
        store.commit('setFilename', null);
        store.dispatch('resetProject', []);
        EventBus.$emit('clearErrors');
        Controller.openProjectData();
    },
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
    openProjectFile(filename) {
        store.commit('setFilename', filename);
        ProjectHandler.openProject(store.state.ui.filename)
            .then(() => {
                store.commit('setView', 'gallery');
                EventBus.$emit(EventBus.events.PROJECT_OPENED);
            })
            .catch((err) => {
                store.commit('setFilename', null);
                EventBus.$emit('error', err);
            });
    },
    saveProject() {
        if (!store.state.ui.filename) {
            Controller.saveProjectAs();
            return;
        }

        ProjectHandler.saveProject(store.state.ui.filename)
            .catch((err) => {
                store.commit('setFilename', null);
                EventBus.$emit('error', err);
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
    addMapSlide() {
        return Controller.addMapSlideAfter(store.state.gallery.currentSlide);
    },
    addMapSlideAfter(prevSlide) {
        const slide = {
            id: uuidv4(),
            from: 'Budapest',
            to: 'Vienna',
            speed: 5000,
            mode: 'DRIVING',
            waypoints: [],
        };

        store.commit('addSlidesAfter', {
            slide: prevSlide,
            slides: [slide],
        });
        return slide;
    },
    prevSlide() {
        store.commit('moveSlide', -1);
    },
    nextSlide() {
        store.commit('moveSlide', 1);
    },
    closeSlide() {
        store.commit('setCurrentSlide', null);
    },
    deleteSlide() {
        store.commit('deleteSlide', store.state.gallery.currentSlide);
    },
    orderExif() {
        store.commit('orderByExif');
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
    logout() {
        AppServer.logout();
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
    openFlickr() {
        store.commit('openPopup', 'flickr');
    },
    openProjectData() {
        store.commit('openPopup', 'projectData');
    },
    openSplash() {
        store.commit('openPopup', 'splash');
    },
};

export default Controller;

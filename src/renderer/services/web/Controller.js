import ImageProcessor from 'EnvServices/ImageProcessor';
import ProjectHandler from 'EnvServices/ProjectHandler';
import store from '@/store';
import EventBus from '@/services/EventBus';
import AppServer from '@/services/AppServer';

const uuidv4 = require('uuid/v4');

const Controller = {
    newProject() {
        store.commit('setFilename', null);
        store.dispatch('resetProject', []);
        EventBus.$emit('clearErrors');
        this.openProjectData();
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
            this.saveProjectAs();
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
        const inputElement = document.getElementById('fileselector');
        const listenerFunction = (e) => {
            inputElement.removeEventListener('change', listenerFunction, false);
            const files = [...e.target.files];
            ImageProcessor.processNewImages(files)
                .then((slides) => {
                    if (prevSlide) {
                        store.commit('addSlidesAfter', {
                            slide: prevSlide,
                            slides,
                        });
                    } else {
                        store.commit('addSlides', slides);
                    }
                })
                .catch((err) => {
                    EventBus.$emit('error', err);
                });
        };

        inputElement.addEventListener('change', listenerFunction, false);
        inputElement.click();
        return Promise.resolve();
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
        store.commit('setView', 'gallery');
    },
    deleteSlide() {
        store.commit('deleteSlide', store.state.gallery.currentSlide);
    },
    undoDeleteSlide() {
        store.commit('undoDeleteSlide');
    },
    orderExif() {
        store.commit('orderByExif');
    },
    exportProject() {
        EventBus.$emit('error', 'Export not supported');
    },
    logout() {
        AppServer.logout();
    },
    publish() {
        ProjectHandler.publishProject()
            .then((url) => {
                console.log(url);
            })
            .catch((err) => {
                EventBus.$emit('error', err);
            });
    },
    login() {
        AppServer.login();
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
    init() {
        this.openSplash();
    },
    openProjectFromOS(fileName) {
        store.commit('setSplashMode', false);
        store.commit('closePopups');
        this.openProjectFile(fileName);
    },
};

export default Controller;

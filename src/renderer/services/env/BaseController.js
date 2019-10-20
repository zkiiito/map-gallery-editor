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
        Controller.openProjectData();
    },
    openProject() {
        // implement
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
        // implement
    },
    addImages(prevSlide) {
        // implement
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
        // implement
    },
    logout() {
        AppServer.logout();
    },
    publish() {
        // implement
    },
    login() {
        // implement
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
        // implement
    },
};

export default Controller;

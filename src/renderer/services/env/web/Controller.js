import ImageProcessor from 'EnvServices/ImageProcessor';
import ProjectHandler from 'EnvServices/ProjectHandler';
import store from '@/store';
import EventBus from '@/services/EventBus';
import AppServer from '@/services/AppServer';
import BaseController from '@/services/env/BaseController';

const Controller = Object.assign(BaseController, {
    openProject() {
        // TODO
    },
    saveProjectAs() {
        // TODO
    },
    addImagesFromDevice() {
        const inputElement = document.getElementById('fileselector');
        const listenerFunction = (e) => {
            inputElement.removeEventListener('change', listenerFunction, false);
            const files = [...e.target.files];
            let prevSlide = store.state.gallery.addAfterSlide;

            ImageProcessor.processNewImages(files, (slide) => {
                if (prevSlide) {
                    store.commit('setAddAfterSlide', prevSlide);
                    prevSlide = slide;
                }
                store.commit('addSlides', [slide]);
            })
                .catch((err) => {
                    EventBus.$emit('error', err);
                });
        };

        inputElement.addEventListener('change', listenerFunction, false);
        inputElement.click();
        return Promise.resolve();
    },
    publish() {
        ProjectHandler.publishProject()
            .then((url) => {
                window.open(url, 'mapgallerywindow');
            })
            .catch((err) => {
                EventBus.$emit('error', err);
            });
    },
    login() {
        AppServer.login();
    },
    refreshProjects() {
        return AppServer.getGalleries()
            .then((galleries) => {
                store.commit('setHistory', galleries);
            });
    },
    init() {
        EventBus.$on(EventBus.events.USER_CHANGED, (user) => {
            if (user) {
                this.refreshProjects();
            }
        });

        this.openSplash();
    },
});

export default Controller;

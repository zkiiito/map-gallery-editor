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
    addImages(prevSlide) {
        const inputElement = document.getElementById('fileselector');
        const listenerFunction = (e) => {
            inputElement.removeEventListener('change', listenerFunction, false);
            const files = [...e.target.files];
            ImageProcessor.processNewImages(files, (slide) => {
                if (prevSlide) {
                    store.commit('addSlidesAfter', {
                        slide: prevSlide,
                        slides: [slide],
                    });
                    prevSlide = slide;
                } else {
                    store.commit('addSlides', [slide]);
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
    init() {
        EventBus.$on(EventBus.events.USER_CHANGED, () => {
            AppServer.getGalleries().then((galleries) => {
                store.commit('setHistory', galleries);
            });
        });

        this.openSplash();
    },
});

export default Controller;

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import EventBus from '../services/EventBus';
const uuidv4 = require('uuid/v4');

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        gallery: {
            state: {
                id: uuidv4(),
                title: '',
                description: '',
                slides: [],
                currentSlide: null,
                user: null,
            },
            mutations: {
                setSlides(state, slides) {
                    state.slides = slides;
                    state.currentSlide = null;
                },
                setCurrentSlide(state, slide) {
                    state.currentSlide = slide;
                    EventBus.$emit('currentSlide', slide);
                },
                updateOrder(state, ids) {
                    state.slides = ids.reduce((newSlides, id) => {
                        newSlides.push(state.slides.find(el => el.id === id));
                        return newSlides;
                    }, []);
                },
                addSlide(state, slide) {
                    state.slides.push(slide);
                },
                addSlideAfterCurrent(state, slide) {
                    if (state.currentSlide) {
                        const index = state.slides.findIndex(slide => slide === state.currentSlide);
                        state.slides.splice(index + 1, 0, slide);
                    } else {
                        state.slides.push(slide);
                    }
                },
                addSlides(state, slides) {
                    state.slides = state.slides.concat(slides);
                },
                moveSlide(state, diff) {
                    const slideCount = state.slides.length;

                    if (slideCount > 0) {
                        if (state.currentSlide === null) {
                            state.currentSlide = state.slides[0]; // eslint-disable-line
                        } else {
                            let idx = state.slides.indexOf(state.currentSlide);
                            idx += diff;

                            while (idx < 0) {
                                idx += slideCount;
                            }

                            while (idx >= slideCount) {
                                idx -= slideCount;
                            }

                            state.currentSlide = state.slides[idx];
                        }
                    }
                },
                updateCurrentSlide(state, newValues) {
                    if (state.currentSlide === null) {
                        return;
                    }

                    Object.keys(newValues).forEach((key) => {
                        state.currentSlide[key] = newValues[key];
                    });
                },
                deleteCurrentSlide(state) {
                    if (state.currentSlide === null) {
                        return;
                    }

                    const idx = state.slides.indexOf(state.currentSlide);
                    state.slides.splice(idx, 1);

                    if (state.slides.length > 0) {
                        state.currentSlide = state.slides[idx > 0 ? (idx - 1) : 0];
                    } else {
                        state.currentSlide = null;
                    }
                },
                orderByExif(state) {
                    state.slides.sort((a, b) => {
                        if (a.exif_date && b.exif_date) {
                            return a.exif_date.getTime() - b.exif_date.getTime();
                        }

                        if (a.exif_date) {
                            return 1;
                        }

                        return -1;
                    });
                },
                setTitle(state, title) {
                    state.title = title;
                    EventBus.$emit(EventBus.events.PROJECT_TITLE_CHANGED, title);
                },
                setDescription(state, description) {
                    state.description = description;
                },
                setId(state, id) {
                    state.id = id || uuidv4();
                },
            },
            actions: {
                resetProject({ commit }) {
                    commit('setId', null);
                    commit('setTitle', '');
                    commit('setDescription', '');
                    commit('setSlides', []);
                },
                loadSlides({ commit }, data) {
                    commit('setSlides', data);
                },
            },
            getters: {
                currentSlideType: (state) => {
                    if (state.currentSlide === null) {
                        return null;
                    }

                    if (Object.prototype.hasOwnProperty.call(state.currentSlide, 'from')) {
                        return 'map';
                    }

                    return 'image';
                },
                fileData: state => ({
                    id: state.id,
                    title: state.title,
                    description: state.description,
                    slides: state.slides,
                }),
            },
        },
        ui: {
            state: {
                popups: [],
                returnToSplash: false,
                filename: null,
            },
            mutations: {
                openPopup(state, popup) {
                    state.popups.push(popup);
                    EventBus.$emit(EventBus.events.POPUP_OPENED, popup);
                },
                closePopup(state, popup) {
                    state.popups = state.popups.filter(openpopup => popup !== openpopup);
                    EventBus.$emit(EventBus.events.POPUP_CLOSED, popup, state.popups.length);
                },
                setFilename(state, filename) {
                    state.filename = filename;
                    EventBus.$emit('filename', filename);
                },
                setReturnToSplash(state, returnToSplash) {
                    state.returnToSplash = returnToSplash;
                },
            },
            getters: {
                isPopupOpen: state => (popup => state.popups.indexOf(popup) >= 0),
            },
        },
        user: {
            state: {
                googleUser: null,
                flickrUser: null,
            },
            mutations: {
                setGoogleUser(state, user) {
                    state.googleUser = user;
                },
                setFlickrUser(state, user) {
                    state.flickrUser = user;
                },
            },
        },
        app: {
            state: {
                galleryHistory: [],
            },
            mutations: {
                setFilename(state, filename) {
                    if (filename) {
                        const idx = state.galleryHistory.indexOf(filename);
                        if (idx > -1) {
                            state.galleryHistory.splice(idx, 1);
                        }

                        state.galleryHistory.push(filename);
                    }
                },
            },
        },
    },
    plugins: [createPersistedState({
        key: 'MapGalleryEditor',
        paths: ['app'],
    })],
});
